import { newId, newRoomSlug } from '@avelin/id'
import type { ZeroSchema } from '@avelin/zero'
import type { Zero } from '@rocicorp/zero'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Room {
  // Static factory method
  static async create(z: Zero<ZeroSchema>) {
    const id = newId('room')
    const slug = newRoomSlug()

    await z.mutate.rooms.insert({
      id,
      slug,
      creatorId: z.userID,
    })

    const [room] = z.query.rooms.where('id', id).run()

    return room
  }
}
