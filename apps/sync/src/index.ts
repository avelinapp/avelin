import { auth } from '@avelin/auth'
import { createAuthClient } from '@avelin/auth/client'
import { createDb, eq, schema } from '@avelin/database'
import { Database } from '@hocuspocus/extension-database'
import { Logger } from '@hocuspocus/extension-logger'
import { Events, Webhook } from '@hocuspocus/extension-webhook'
import { Hocuspocus } from '@hocuspocus/server'
import express from 'express'
import expressWebsockets from 'express-ws'
import ws from 'ws'
import { Doc } from 'yjs'
import { authClient } from './auth.js'
import { env } from './env.js'

const PORT = 4100

const db = createDb(ws)

const server = new Hocuspocus({
  port: PORT,
  async onAuthenticate(ctx) {
    try {
      console.log('[onAuthenticate] ctx', ctx.requestHeaders)
      const { data, error } = await authClient.getSession({
        fetchOptions: {
          auth: {
            type: 'Bearer',
            token: ctx.token,
          },
        },
      })

      if (error || !data) {
        throw new Error(`Invalid session with ID ${ctx.token}`)
      }

      const { user, session } = data

      return { user, session }
    } catch (err) {
      console.log('err', err)
    }

    return undefined
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
      events: [Events.onConnect, Events.onDisconnect, Events.onChange],
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

app.ws('/', (websocket, request) => {
  server.handleConnection(websocket, request)
})

app.listen(PORT, () => {
  console.log(`Avelin Sync listening on port ${PORT}`)
})
