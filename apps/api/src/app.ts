import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { authApp } from './routes/auth'
import { roomApp } from './routes/rooms'

export const app = new Hono()
  .use('*', cors())
  .use(logger())
  .route('/auth', authApp)
  .route('/rooms', roomApp)

export type AppType = typeof app
