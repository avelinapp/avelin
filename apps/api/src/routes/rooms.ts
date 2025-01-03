import { Hono } from 'hono'
import { db, Room, schema } from '@avelin/database'
import { eq } from 'drizzle-orm'
import { newId, newRoomSlug } from '@avelin/id'
import { hocuspocusApp } from './hocuspocus'

export const roomApp = new Hono()
  .post('/create', async (c) => {
    const newRoom = await db.transaction(async (tx) => {
      const [room] = await tx
        .insert(schema.rooms)
        .values({
          id: newId('room'),
          slug: newRoomSlug(),
        })
        .returning({
          id: schema.rooms.id,
          slug: schema.rooms.slug,
        })

      return room
    })

    return c.json(newRoom as Required<Room>, 200)
  })
  .get('/:slug', async (c) => {
    const slug = c.req.param('slug')

    const [room] = await db
      .select({
        id: schema.rooms.id,
        slug: schema.rooms.slug,
      })
      .from(schema.rooms)
      // @ts-ignore
      .where(eq(schema.rooms.slug, slug))
      .limit(1)

    if (!room) {
      return c.json({ error: 'Room not found.' }, 404)
    }

    return c.json(room, 200)
  })
  .route('/sync/webhook', hocuspocusApp)
