import { newId, newRoomSlug } from '@avelin/id'
import { now, client as zeroClient } from './zero'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Room {
  // Static factory method
  static async create() {
    const z = zeroClient!

    const id = newId('room')
    const slug = newRoomSlug()

    await z.mutate.rooms.insert({
      id,
      slug,
      creatorId: z.userID,
      editorLanguage: 'plaintext',
      createdAt: now(),
      updatedAt: now(),
    })

    const [room] = z.query.rooms.where('id', id).run()

    return room
  }

  static async delete({ id }: { id: string }) {
    const z = zeroClient!

    const roomParticipants = z.query.roomParticipants
      .where('roomId', '=', id)
      .run()

    await z.mutateBatch(async (tx) => {
      await tx.rooms.delete({ id })

      for (const rp of roomParticipants) {
        await tx.roomParticipants.delete({
          roomId: id,
          userId: rp.userId,
        })
      }
    })
  }
}
