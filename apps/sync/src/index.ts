import { validateJwt } from '@avelin/auth/jwt'
import { type NeonDatabase, createDb, eq, schema } from '@avelin/database'
import { generate, newRoomSlug } from '@avelin/id'
import { Database } from '@hocuspocus/extension-database'
import { Logger } from '@hocuspocus/extension-logger'
import { Events, Webhook } from '@hocuspocus/extension-webhook'
import { Hocuspocus } from '@hocuspocus/server'
import cookieParser from 'cookie-parser'
import express from 'express'
import expressWebsockets from 'express-ws'
import ws from 'ws'
import { Doc } from 'yjs'
import { env } from './env.js'
import { cleanupActiveConnections, devBootstrap } from './lifecycle.js'

const SERVER_ID =
  env.NODE_ENV !== 'production'
    ? `avelin-sync-dev-${generate(6)}`
    : `avelin-sync-${generate(6)}`
const PORT = 4100

const db = createDb(ws)

await devBootstrap(SERVER_ID, db)

const server = new Hocuspocus({
  name: SERVER_ID,
  // async onConnect(data) {
  //   console.log('[onConnect] Request parameters:', data.requestParameters)
  // },
  async onAuthenticate(ctx) {
    try {
      return await validateJwt(ctx.token, `${env.API_URL}/auth/jwks`)
    } catch (err) {
      throw new Error(
        `[ERROR] Authentication failed. Invalid session with ID ${ctx.token}. Reason: ${err}`,
      )
    }
  },
  extensions: [
    new Webhook({
      url: `${env.API_URL}/rooms/sync/webhook`,
      secret: env.HOCUSPOCUS_WEBHOOK_SECRET,
      transformer: {
        // TODO: Complete implementation
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        toYdoc(document: any, fieldName: string): Doc {
          // convert the given document (from your api) to a ydoc using the provided fieldName
          return new Doc()
        },
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        fromYdoc(document: Doc): any {
          // convert the ydoc to your representation
          const meta = document.getMap('meta').toJSON()
          const editor = document.getMap('editor').toJSON()
          return {
            meta,
            editorLanguage: editor.language as string,
          }
        },
      },
      events: [Events.onConnect, Events.onDisconnect],
    }),
    new Logger(),
    new Database({
      fetch: async ({ documentName }) => {
        console.log('fetching ydoc for:', documentName)
        return new Promise((resolve, reject) => {
          db.select({ ydoc: schema.rooms.ydoc })
            .from(schema.rooms)
            .where(eq(schema.rooms.id, documentName))
            .limit(1)
            .then(
              (result) => {
                resolve(result[0]?.ydoc ?? null)
              },
              (reason) => {
                reject(reason)
              },
            )
        })
      },
      store: async ({ documentName, state }) => {
        console.log('storing ydoc for:', documentName)
        return new Promise((resolve, reject) => {
          db.insert(schema.rooms)
            .values({
              id: documentName,
              staticSlug: newRoomSlug(),
            })
            .onConflictDoUpdate({
              target: schema.rooms.id,
              set: {
                ydoc: state,
              },
            })
            .returning()
            .then(
              () => {
                resolve()
              },
              (reason) => {
                reject(reason)
              },
            )
        })
      },
    }),
  ],
})

const { app } = expressWebsockets(express())
app.use(cookieParser())

app.ws('/', (websocket, request) => {
  const token = request.cookies['avelin.session_jwt'] as string | undefined
  // Add serverId query param to the request URL
  // We need this because the context is not sent to the onConnect webhook endpoint
  if (request.url.includes('?')) {
    request.url = `${request.url}&serverId=${server.configuration.name}&token=${token}`
  } else {
    request.url = `${request.url}?serverId=${server.configuration.name}&token=${token}`
  }

  server.handleConnection(websocket, request, {
    serverId: server.configuration.name,
  })
})

const http = app.listen(PORT, () => {
  console.log(
    `Avelin Sync (ID: ${server.configuration.name}) listening on port ${PORT}`,
  )
})

async function cleanup(
  serverId: string = SERVER_ID,
  dbInstance: NeonDatabase = db,
) {
  console.log('Shutting down...')
  try {
    for (const [, doc] of server.documents) {
      for (const [, conn] of doc.connections) {
        console.log(
          'Closing connection to document',
          doc.name,
          'with connection ID:',
          conn.connection.socketId,
        )
        conn.connection.close()
      }
    }
    console.log('Closed all connections')
    http.closeAllConnections()
    console.log('Closed all HTTP connections')
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log('Starting cleanup of active connections...')
    await cleanupActiveConnections(serverId, dbInstance)
    console.log('Cleaned up active connections.')
  } catch (err) {
    console.error('Error while shutting down:', err)
    process.exit(1)
  }
}

if (env.NODE_ENV === 'production') {
  process.on('SIGTERM', async () => {
    await cleanup(SERVER_ID, db)
  })
  process.on('SIGINT', async () => {
    await cleanup(SERVER_ID, db)
  })
}
