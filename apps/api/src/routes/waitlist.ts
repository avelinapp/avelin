import { db, eq, schema } from '@avelin/database'
import { newId } from '@avelin/id'
import { Elysia, t } from 'elysia'
import WaitlistInviteEmail from '../emails/waitlist-invite'
import { posthog } from '../lib/posthog'
import { resend } from '../lib/resend'
import { auth } from './auth'

export const waitlist = new Elysia({ prefix: '/waitlist' })
  .post(
    '/join',
    async ({ body: { email }, error }) => {
      const waitlistConfig = (await posthog.getFeatureFlagPayload(
        'waitlist',
        '_irrelevant_',
      )) as { enabled: boolean } | undefined

      if (!waitlistConfig?.enabled) {
        // TODO: Investigate `error.status` type error when calling this from the client
        return error(403, {
          error: 'Waitlist is disabled.',
        })
      }

      await db
        .insert(schema.waitlistEntries)
        .values({
          id: newId('waitlistEntry'),
          email,
          status: 'waitlist_joined',
          /* When the user joins the whitelist. */
          joinedAt: new Date(),
        })
        .onConflictDoNothing({ target: schema.waitlistEntries.email })
        .returning()

      return {}
    },
    {
      body: t.Object({
        email: t.String({
          format: 'email',
        }),
      }),
    },
  )
  .use(auth)
  .post(
    '/invite',
    async ({ user, body: { waitlistEntryId }, error }) => {
      if (!user.isAdminUser) {
        return error(403, {
          error: 'Only admins can invite users.',
        })
      }

      if (!waitlistEntryId) {
        return error(400, {
          error: 'Must provide either an email or a waitlistEntryId.',
        })
      }

      async function sendEmail(email: string) {
        const res = await resend.emails.send({
          from: 'Avelin <notifications@avelin.app>',
          to: [email],
          subject: 'Welcome to Avelin',
          replyTo: 'Kian Bazarjani <kian@bazza.dev>',
          react: WaitlistInviteEmail(),
        })

        if (res.error) {
          return error(500, { error: res.error.message })
        }

        return res.data
      }

      const [entry] = await db
        .select()
        .from(schema.waitlistEntries)
        .where(eq(schema.waitlistEntries.id, waitlistEntryId))

      if (!entry) {
        return error(404, {
          error: 'Waitlist entry not found.',
        })
      }

      await sendEmail(entry.email)

      await db
        .update(schema.waitlistEntries)
        .set({ invitedAt: new Date(), status: 'invite_sent' })
        .where(eq(schema.waitlistEntries.id, waitlistEntryId))
    },
    {
      auth: true,
      body: t.Object({
        waitlistEntryId: t.String(),
      }),
    },
  )
