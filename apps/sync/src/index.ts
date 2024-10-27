import { Logger } from '@hocuspocus/extension-logger'
import { Hocuspocus } from '@hocuspocus/server'

const server = new Hocuspocus({
  port: 4100,
  extensions: [new Logger()],
})

server.listen()
