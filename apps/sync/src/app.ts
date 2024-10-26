import { Context, Hono } from 'hono'
import { createBunWebSocket } from 'hono/bun'
import type { ServerWebSocket } from 'bun'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { db, Room, schema } from '@avelin/database'
import { eq } from 'drizzle-orm'

type RoomContext = { room: Room }

export const { upgradeWebSocket, websocket } =
  createBunWebSocket<ServerWebSocket>()

const upgradeWs = () =>
  upgradeWebSocket(async (c: Context<{ Variables: RoomContext }>) => {
    const room = c.get('room')

    return {
      onOpen(event, ws) {
        console.log('[OPEN]', room.id)
        ws.send(`Hello from server! ${room.id}`)
      },
      onMessage(event, ws) {},
      onClose: (event, ws) => {
        console.log('[CLOSED]', room.id)
        ws.close()
      },
    }
  })

export const app = new Hono<{ Variables: RoomContext }>()
  .use('*', cors())
  .use(logger())
  .get('/ws', async (c, next) => {
    // Perform auth and authorization checks
    console.log('Checking connection...')

    const roomSlug = c.req.query('roomSlug')

    if (!roomSlug) {
      return c.json({ error: 'Please provide a room slug.' }, 400)
    }

    const [room] = await db
      .select()
      .from(schema.rooms)
      .where(eq(schema.rooms.slug, roomSlug))
      .limit(1)

    if (!room) {
      return c.json({ error: 'Room not found.' }, 404)
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 4000)
    })

    c.set('room', room)

    return next()
  })
  .get('/ws', upgradeWs())

export type AppType = typeof app
