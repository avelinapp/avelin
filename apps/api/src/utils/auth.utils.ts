import { invalidateSessionsForUser } from '@avelin/auth'
import {
  and,
  db,
  eq,
  getTableColumns,
  inArray,
  schema,
  sql,
} from '@avelin/database'
import { difference, intersection, pick, unique } from 'remeda'

export async function linkAnonymousToRealAccount({
  anonymousUserId,
  userId,
}: {
  anonymousUserId: string
  userId: string
}) {
  // Invalidate anonymous sessions
  await invalidateSessionsForUser(anonymousUserId, { db })

  /* Room Participation */
  await db.transaction(async (tx) => {
    const anonRps = await tx
      .select({ ...pick(getTableColumns(schema.roomParticipants), ['roomId']) })
      .from(schema.roomParticipants)
      .where(eq(schema.roomParticipants.userId, anonymousUserId))

    const anonRoomIds = unique(anonRps.map((rp) => rp.roomId))

    if (anonRoomIds.length) {
      const realRps = await tx
        .select({
          ...pick(getTableColumns(schema.roomParticipants), ['roomId']),
        })
        .from(schema.roomParticipants)
        .where(eq(schema.roomParticipants.userId, userId))

      const realRoomIds = unique(realRps.map((rp) => rp.roomId))

      // Which rooms did the anonymous user join, which the real user did not?
      // We can transfer the participation entries to the real user
      const roomsToTransfer = difference(anonRoomIds, realRoomIds)

      await tx
        .update(schema.roomParticipants)
        .set({
          userId,
        })
        .where(
          and(
            eq(schema.roomParticipants.userId, anonymousUserId),
            inArray(schema.roomParticipants.roomId, roomsToTransfer),
          ),
        )

      // Which rooms did both users join?
      // We can delete the entries for the anonymous user from the `room_participants` table
      const roomsToDelete = intersection(anonRoomIds, realRoomIds)

      await tx
        .delete(schema.roomParticipants)
        .where(inArray(schema.roomParticipants.roomId, roomsToDelete))
    }

    // Room ownership
    await tx
      .update(schema.rooms)
      .set({
        creatorId: userId,
      })
      .where(eq(schema.rooms.creatorId, anonymousUserId))

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
