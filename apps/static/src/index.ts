import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()
  .use('*', logger())
  .use(
    '*',
    cors({
      origin: ['http://localhost:3000', 'https://avelin.app'],
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['POST', 'GET', 'OPTIONS'],
      exposeHeaders: ['Content-Length'],
      maxAge: 600,
      credentials: true,
    }),
  )
  .options('*', (c) => {
    return c.text('', 204)
  })
  .use(
    '/assets/fonts/*',
    serveStatic({
      root: './',
      onFound: (_path, c) => {
        c.header('Cache-Control', `public, immutable, max-age=31536000`)
      },
    }),
  )

export default {
  port: 4200,
  fetch: app.fetch,
}
