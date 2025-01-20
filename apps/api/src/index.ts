import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { auth } from './routes/auth'
import { rooms } from './routes/rooms'

const PORT = process.env.API_PORT || 4000

export const app = new Elysia()
  .use(
    swagger({
      path: '/docs',
    }),
  )
  .use(
    cors({
      origin: [process.env.APP_URL!],
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
