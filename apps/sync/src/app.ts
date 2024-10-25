import { Hono } from 'hono'
import { createBunWebSocket } from 'hono/bun'
import type { ServerWebSocket } from 'bun'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

export const { upgradeWebSocket, websocket } =
  createBunWebSocket<ServerWebSocket>()

const upgradeWs = () =>
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
  })

export const app = new Hono()
  .use('*', cors())
  .use(logger())
  .get('/ws', async (c, next) => {
    // Perform auth and authorization checks
    console.log('Checking connection...')

    await new Promise((resolve) => {
      setTimeout(resolve, 4000)
    })

    return next()
  })
  .get('/ws', upgradeWs())

export type AppType = typeof app
