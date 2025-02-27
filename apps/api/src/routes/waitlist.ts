import { db, schema } from '@avelin/database'
import { newId } from '@avelin/id'
import { Elysia, t } from 'elysia'
import { posthog } from '../lib/posthog'

export const waitlist = new Elysia({ prefix: '/waitlist' }).post(
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
