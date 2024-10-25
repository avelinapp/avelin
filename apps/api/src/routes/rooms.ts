import { Hono } from 'hono'
import { db, schema } from '@avelin/database'
import { newId, newRoomSlug } from '@avelin/id'

export const roomApp = new Hono().post('/create', async (c) => {
  const newRoom = await db.transaction(async (tx) => {
    const [room] = await tx
      .insert(schema.rooms)
      .values({
        id: newId('room'),
        slug: newRoomSlug(),
      })
      .returning()

    return room
  })

  return c.json(newRoom)
})
