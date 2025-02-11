import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { Elysia } from 'elysia'
import { env } from './env'
import { auth } from './routes/auth'
import { rooms } from './routes/rooms'

const PORT = env.API_PORT || 4000

export const app = new Elysia()
  .use(
    swagger({
      path: '/docs',
    }),
  )
  .use(
    cors({
      origin: [env.APP_URL!],
      credentials: true,
    }),
  )
  .get('/', ({ redirect }) => redirect('/docs'))
  .get('/health', () => ({ message: 'Avelin API is running.' }))
  .use(auth)
  .use(rooms)
  .listen(PORT, ({ hostname, port }) => {
    console.log(`🦊 Elysia is running at ${hostname}:${port}`)
  })
