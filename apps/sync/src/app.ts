import { Context, Hono } from 'hono'
import { createBunWebSocket } from 'hono/bun'
import type { ServerWebSocket } from 'bun'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { closeConn, getYDoc, messageListener, setupWSConnection } from './utils'
import { db, Room, schema } from '@avelin/database'
import { eq } from 'drizzle-orm'
import * as Y from 'yjs'
import * as syncProtocol from 'y-protocols/sync'
import * as awarenessProtocol from 'y-protocols/awareness'

import * as encoding from 'lib0/encoding'
import * as decoding from 'lib0/decoding'
import * as map from 'lib0/map'

type RoomContext = { room: Room }

const messageSync = 0
const messageAwareness = 1

// const pingTimeout = 30000

export const { upgradeWebSocket, websocket } =
  createBunWebSocket<ServerWebSocket>()

const upgradeWs = () =>
  upgradeWebSocket(async (c: Context<{ Variables: RoomContext }>) => {
    const room = c.get('room')
    const doc = getYDoc(room.id)

    // let pingInterval: NodeJS.Timeout
    // let pongReceived = true

    return {
      onOpen(event, ws) {
        console.log('[OPEN]', room.id)
        ws.send(`Hello from server! ${room.id}`)

        ws.raw!.binaryType = 'arraybuffer'

        doc.conns.set(ws, new Set())

        // pingInterval = setInterval(() => {
        //   if (!pongReceived) {
        //     if (doc.conns.has(ws)) {
        //       closeConn(doc, ws.raw!)
        //     }
        //     clearInterval(pingInterval)
        //   } else if (doc.conns.has(ws)) {
        //     pongReceived = false
        //     try {
        //       ws.raw!.ping()
        //     } catch (e) {
        //       closeConn(doc, ws.raw!)
        //       clearInterval(pingInterval)
        //     }
        //   }
        // }, pingTimeout)
      },
      onMessage(event, ws) {
        messageListener(ws.raw!, doc, new Uint8Array(event.data as ArrayBuffer))
      },
      onClose: (event, ws) => {
        closeConn(doc, ws.raw!)
        // clearInterval(pingInterval)
        console.log('[CLOSED]', room.id)
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

    // HERE
    // I need to set the room that was fetched from the db through the context, so it is accesible in the websocket upgrade

    return next()
  })
  .get('/ws', upgradeWs())

export type AppType = typeof app
