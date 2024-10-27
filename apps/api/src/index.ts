import { app } from './app'
import { showRoutes } from 'hono/dev'

showRoutes(app, {
  verbose: true,
})

export default {
  port: process.env.API_PORT || 8080,
  fetch: app.fetch,
}
