import { Hono } from 'hono'
import { db, Room, schema, eq } from '@avelin/database'
import { newId, newRoomSlug } from '@avelin/id'
import { hocuspocusApp } from './hocuspocus'
import { createMiddleware } from 'hono/factory'

const roomMiddleware = createMiddleware<{ Variables: { room: Room } }>(
  async (c, next) => {
    if (c.req.path === '/rooms/create') {
      return await next()
    }

    const slug = c.req.param('slug')

    const [room] = await db
      .select()
      .from(schema.rooms)
      // @ts-ignore
      .where(eq(schema.rooms.slug, slug))
      .limit(1)

    if (!room) {
      c.status(404)
      return c.json({ error: 'Room not found.' }, 404)
    }

    c.set('room', room)

    await next()
  },
)

export const roomApp = new Hono()
  .use('/:slug', roomMiddleware)
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
    const room = c.get('room')

    return c.json(room, 200)
  })
  .route('/sync/webhook', hocuspocusApp)
