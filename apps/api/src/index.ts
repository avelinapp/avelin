import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { authMiddleware } from './middleware/auth'

const PORT = process.env.API_PORT || 4000

const app = new Elysia()
  .use(swagger())
  .use(
    cors({
      origin: [process.env.APP_URL!],
      credentials: true,
    }),
  )
  .guard({}, (app) =>
    app.use(authMiddleware).get('/auth-test', async (ctx) => {
      console.log('ctx.user', ctx.user)
      console.log('ctx.session', ctx.session)
    }),
  )
  .get('/health', () => ({ message: 'Avelin API is running.' }))
  .get('/', () => 'Hello Elysia')
  .listen(PORT, ({ hostname, port }) => {
    console.log(`🦊 Elysia is running at ${hostname}:${port}`)
  })
