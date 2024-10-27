import { Context, Hono } from 'hono'
import { createBunWebSocket } from 'hono/bun'
import type { ServerWebSocket } from 'bun'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { db, Room, schema } from '@avelin/database'
import { eq } from 'drizzle-orm'
import {
  closeConn,
  docs,
  getYDoc,
  MESSAGE_AWARENESS,
  MESSAGE_SYNC,
  messageListener,
  send,
} from './utils'
import {
  createEncoder,
  toUint8Array,
  writeVarUint,
  writeVarUint8Array,
} from 'lib0/encoding.js'
import { encodeAwarenessUpdate } from 'y-protocols/awareness.js'
import { writeSyncStep1 } from 'y-protocols/sync.js'

type RoomContext = { room: Room }

export const { upgradeWebSocket, websocket } =
  createBunWebSocket<ServerWebSocket>()

const upgradeWs = () =>
  upgradeWebSocket(async (c: Context<{ Variables: RoomContext }>) => {
    const room = c.get('room')
    const doc = getYDoc(room.id)

    console.log(
      'Docs:',
      Array.from(docs.values())
        .map((doc) => doc.name)
        .join(', '),
    )

    return {
      onOpen(event, ws) {
        console.log('[OPEN]', room.id)

        ws.raw!.binaryType = 'arraybuffer'

        doc.conns.set(ws.raw!, new Set())

        {
          // Send initial sync step 1
          const encoder = createEncoder()
          writeVarUint(encoder, MESSAGE_SYNC)
          writeSyncStep1(encoder, doc)
          send(doc, ws.raw!, toUint8Array(encoder))

          const awarenessStates = doc.awareness.getStates()
          if (awarenessStates.size > 0) {
            const encoder = createEncoder()
            writeVarUint(encoder, MESSAGE_AWARENESS)
            writeVarUint8Array(
              encoder,
              encodeAwarenessUpdate(
                doc.awareness,
                Array.from(awarenessStates.keys()),
              ),
            )

            send(doc, ws.raw!, toUint8Array(encoder))
          }
        }
      },
      onMessage(event, ws) {
        console.log(event)

        if (event.data === null) {
          return
        }

        const message = new Uint8Array(event.data as ArrayBuffer)

        messageListener(ws.raw!, doc, message)
      },
      onClose: (event, ws) => {
        closeConn(doc, ws.raw!)
        console.log('[CLOSED]', room.id)
        // if (heartbeatInterval) clearInterval(heartbeatInterval)
        // if (heartbeatTimeout) clearTimeout(heartbeatTimeout)
      },
      onError: (error) => {
        console.error('[ERROR]', room.id, error)
        // if (heartbeatInterval) clearInterval(heartbeatInterval)
        // if (heartbeatTimeout) clearTimeout(heartbeatTimeout)
      },
    }
  })

export const app = new Hono<{ Variables: RoomContext }>()
  .use('*', cors())
  .use(logger())
  .get('/ws/:roomId', async (c, next) => {
    // Perform auth and authorization checks
    console.log('Checking connection...')

    const roomId = c.req.param('roomId')

    if (!roomId) {
      return c.json({ error: 'Please provide a room ID.' }, 400)
    }

    const [room] = await db
      .select()
      .from(schema.rooms)
      .where(eq(schema.rooms.id, roomId))
      .limit(1)

    if (!room) {
      return c.json({ error: 'Room not found.' }, 404)
    }

    // await new Promise((resolve) => {
    //   setTimeout(resolve, 4000)
    // })

    c.set('room', room)

    return next()
  })
  .get('/ws/:roomId', upgradeWs())

export type AppType = typeof app
