import { invalidateSessionsForUser } from '@avelin/auth'
import { db, eq, schema } from '@avelin/database'
import { sql } from 'drizzle-orm'

export async function linkAnonymousToRealAccount({
  anonymousUserId,
  userId,
}: {
  anonymousUserId: string
  userId: string
}) {
  // Modifications to make:
  // Rooms - creatorId
  // RoomParticipants - userId

  // Invalidate anonymous sessions
  await invalidateSessionsForUser(anonymousUserId)

  await db.transaction(async (tx) => {
    await tx
      .update(schema.users)
      .set({
        retiredAt: sql`now()`,
        linkedUserId: userId,
      })
      .where(eq(schema.users.id, anonymousUserId))
  })
}
