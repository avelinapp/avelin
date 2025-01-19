import { invalidateSessionsForUser } from '@avelin/auth'
import { db, eq, schema, sql } from '@avelin/database'

export async function linkAnonymousToRealAccount({
  anonymousUserId,
  userId,
}: {
  anonymousUserId: string
  userId: string
}) {
  // Invalidate anonymous sessions
  await invalidateSessionsForUser(anonymousUserId, { db })

  await db.transaction(async (tx) => {
    // Room participation
    await tx
      .update(schema.roomParticipants)
      .set({
        userId: userId,
      })
      .where(eq(schema.roomParticipants.userId, anonymousUserId))

    // TODO: Room ownership

    // Retire anonymous user
    await tx
      .update(schema.users)
      .set({
        retiredAt: sql`now()`,
        linkedUserId: userId,
      })
      .where(eq(schema.users.id, anonymousUserId))
  })
}
