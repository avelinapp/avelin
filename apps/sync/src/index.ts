import { schema, eq, createDb } from '@avelin/database'
import { Database } from '@hocuspocus/extension-database'
import { Logger } from '@hocuspocus/extension-logger'
import { Events, Webhook } from '@hocuspocus/extension-webhook'
import { Hocuspocus } from '@hocuspocus/server'
import dotenv from 'dotenv'
import express from 'express'
import expressWebsockets from 'express-ws'
import ws from 'ws'
import { Doc } from 'yjs'
import { validateSession } from '@avelin/auth'
import { newId } from '@avelin/id'

dotenv.config({ path: '.env' })

const port = process.env.API_PORT || 4100

const db = createDb(ws)

const server = new Hocuspocus({
  port: 4100,
  async onAuthenticate(data) {
    console.log('onAuthenticate')
    console.log('Session token:', data.token)

    const auth = await validateSession(data.token)

    if (!auth) {
      throw new Error(`Invalid session with ID ${data.token}`)
    }

    const { user, session } = auth

    // await db.insert(schema.roomParticipants).values({
    //   id: newId('roomParticipant'),
    //   userId: user.id,
    //   roomId: data.documentName,
    // })

    return { user, session }
  },
  extensions: [
    new Webhook({
      url: process.env.API_URL! + '/rooms/sync/webhook',
      secret: process.env.HOCUSPOCUS_WEBHOOK_SECRET!,
      transformer: {
        // TODO: Complete implementation
        toYdoc(document: any, fieldName: string): Doc {
          // convert the given document (from your api) to a ydoc using the provided fieldName
          return new Doc()
        },
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

app.listen(port, () => {
  console.log(`Avelin Sync listening on port ${port}`)
})
