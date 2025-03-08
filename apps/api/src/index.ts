import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import type * as UndiciTypes from 'undici-types'
import { env } from './env'
import { auth } from './routes/auth'
import { rooms } from './routes/rooms'
import { waitlist } from './routes/waitlist'

export const app = new Elysia()
  /* Global middleware */
  .use(
    cors({
      origin: [env.APP_URL],
      credentials: true,
    }),
  )
  /* Health check */
  .get('/', ({ redirect }) => redirect('/health'))
  .get('/health', () => ({ message: 'Avelin API is running.' }))
  /* Main route handlers */
  .use(auth)
  .use(rooms)
  .use(waitlist)
  /* Start server */
  .listen(env.API_PORT, ({ hostname, port }) => {
    console.log(`🦊 Elysia is running at ${hostname}:${port}`)
  })
