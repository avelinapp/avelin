import { app, websocket } from './app'
import { showRoutes } from 'hono/dev'

showRoutes(app, {
  verbose: true,
})

export default {
  port: 4100,
  fetch: app.fetch,
  websocket: websocket,
}
