import { Context, Hono } from 'hono'
import { createBunWebSocket } from 'hono/bun'
import type { ServerWebSocket } from 'bun'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { db, Room, schema } from '@avelin/database'
import { eq } from 'drizzle-orm'
import {
  closeConn,
  getYDoc,
  MESSAGE_AWARENESS,
  MESSAGE_PING,
  MESSAGE_PONG,
  MESSAGE_SYNC,
  messageListener,
  send,
  WS_READY_STATE_OPEN,
} from './utils'
import {
  createEncoder,
  toUint8Array,
  writeVarUint,
  writeVarUint8Array,
} from 'lib0/encoding.js'
import { encodeAwarenessUpdate } from 'y-protocols/awareness.js'
import { writeSyncStep1 } from 'y-protocols/sync.js'
import { createDecoder, readVarUint } from 'lib0/decoding.js'

type RoomContext = { room: Room }

const HEARTBEAT_INTERVAL = 30000 // 30 seconds between pings
const HEARTBEAT_TIMEOUT = 10000 // 10 seconds to wait for pong

export const { upgradeWebSocket, websocket } =
  createBunWebSocket<ServerWebSocket>()

const upgradeWs = () =>
  upgradeWebSocket(async (c: Context<{ Variables: RoomContext }>) => {
    const room = c.get('room')
    const doc = getYDoc(room.id)

    let heartbeatInterval: ReturnType<typeof setInterval>
    let heartbeatTimeout: ReturnType<typeof setTimeout> | undefined

    const sendPing = (ws: ServerWebSocket) => {
      if (ws.readyState === WS_READY_STATE_OPEN) {
        const encoder = createEncoder()
        writeVarUint(encoder, MESSAGE_PING)
        const message = toUint8Array(encoder)
        ws.send(message)
        console.log('[PING] Sent to client in', room.id)

        heartbeatTimeout = setTimeout(() => {
          console.log('[CLOSED] Heartbeat timeout', room.id)
          closeConn(doc, ws)
          // ws.close(1002, 'Heartbeat timeout') // 1002: Protocol error
        }, HEARTBEAT_TIMEOUT)
      }
    }

    // Function to clear the pong timeout
    const clearPongTimeout = () => {
      if (heartbeatTimeout) {
        clearTimeout(heartbeatTimeout)
        heartbeatTimeout = undefined
      }
    }

    return {
      onOpen(event, ws) {
        console.log('[OPEN]', room.id)

        ws.raw!.binaryType = 'arraybuffer'

        doc.conns.set(ws.raw!, new Set())

        sendPing(ws.raw!)

        heartbeatInterval = setInterval(() => {
          sendPing(ws.raw!)
        }, HEARTBEAT_INTERVAL)

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
        const data = event.data

        console.log('[MESSAGE] Received from client in', room.id)

        // Handle binary data
        if (data instanceof ArrayBuffer) {
          const message = new Uint8Array(data)
          const decoder = createDecoder(message)
          const messageType = readVarUint(decoder)

          if (messageType === MESSAGE_PONG) {
            // Received pong, clear the timeout
            clearPongTimeout()
            console.log('[PONG] Received from client in', room.id)
            return
          }

          // Handle Yjs messages
          messageListener(ws.raw!, doc, message)
        } else {
          console.warn('Received data of unknown type:', data)
        }
      },
      onClose: (event, ws) => {
        closeConn(doc, ws.raw!)
        console.log('[CLOSED]', room.id)
        if (heartbeatInterval) clearInterval(heartbeatInterval)
        if (heartbeatTimeout) clearTimeout(heartbeatTimeout)
      },
      onError: (error) => {
        console.error('[ERROR]', room.id, error)
        if (heartbeatInterval) clearInterval(heartbeatInterval)
        if (heartbeatTimeout) clearTimeout(heartbeatTimeout)
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
