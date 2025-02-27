import { db, schema } from '@avelin/database'
import { newId } from '@avelin/id'
import { Elysia, t } from 'elysia'

export const waitlist = new Elysia({ prefix: '/waitlist' }).post(
  '/join',
  async ({ body: { email } }) => {
    const res = await db
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
