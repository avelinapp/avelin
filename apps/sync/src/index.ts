import { Logger } from '@hocuspocus/extension-logger'
import { Hocuspocus } from '@hocuspocus/server'
import dotenv from 'dotenv'
import express from 'express'
import expressWebsockets from 'express-ws'

dotenv.config()

const port = process.env.API_PORT || 4100

const server = new Hocuspocus({
  port: 4100,
  extensions: [new Logger()],
})

const { app } = expressWebsockets(express())

app.ws('/', (websocket, request) => {
  server.handleConnection(websocket, request)
})

app.listen(port, () => {
  console.log(`Avelin Sync listening on port ${port}`)
})
