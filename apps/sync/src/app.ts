import { Hono } from 'hono'
import { createBunWebSocket } from 'hono/bun'
import type { ServerWebSocket } from 'bun'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

export const { upgradeWebSocket, websocket } =
  createBunWebSocket<ServerWebSocket>()

export const app = new Hono()
  .use('*', cors())
  .use(logger())
  .get(
    '/ws',
    upgradeWebSocket((c) => {
      const roomSlug = c.req.query('roomSlug')

      return {
        onOpen(event, ws) {
          console.log('[OPEN]', roomSlug)
          ws.send(`Hello from server! ${roomSlug}`)
        },
        onClose: () => {
          console.log('[CLOSED]', roomSlug)
        },
      }
    }),
  )

export type AppType = typeof app
