import { createHmac, timingSafeEqual } from 'node:crypto'
import { auth, authCookies } from '@avelin/auth'
import { type AuthJWTPayload, validateJwt } from '@avelin/auth/jwt'
import { type User, and, db, eq, schema, sql } from '@avelin/database'
import { newId } from '@avelin/id'
import { readableStreamToArrayBuffer } from 'bun'
import Elysia from 'elysia'
import { env } from '../env'

export const rooms = new Elysia({ prefix: '/rooms' }).guard({}, (app) =>
  app
    .onParse(async ({ request, headers }) => {
      if (headers['content-type'] === 'application/json; charset=utf-8') {
        const arrayBuffer = await readableStreamToArrayBuffer(
          // biome-ignore lint/suspicious/noExplicitAny:
          request.body as any,
        )
        const rawBody = Buffer.from(arrayBuffer)
        return rawBody
      }
    })
    .post('/sync/webhook', async (c) => {
      /* Verify the request signature */
      // biome-ignore lint/suspicious/noExplicitAny:
      const body = new Uint8Array(c.body as any)

      const signature = Buffer.from(
        c.headers['x-hocuspocus-signature-256'] as string,
      )

      const hmac = createHmac('sha256', env.HOCUSPOCUS_WEBHOOK_SECRET)
      const digest = Buffer.from(`sha256=${hmac.update(body).digest('hex')}`)

      const digestArray = new Uint8Array(
        digest.buffer,
        digest.byteOffset,
        digest.byteLength,
      )
      const signatureArray = new Uint8Array(
        signature.buffer,
        signature.byteOffset,
        signature.byteLength,
      )

      if (
        !(
          signature.length !== digest.length ||
          timingSafeEqual(digestArray, signatureArray)
        )
      ) {
        c.error(400, {
          error: 'Could not validate webhook signature - failed.',
        })
      }

      // biome-ignore lint/suspicious/noExplicitAny:
      const data = c.body as any

      const { event, payload } = data
      const roomId = payload.documentName as string
      const serverId = payload.requestParameters.serverId as string
      console.log('[/sync/webhook] event:', event, 'serverId:', serverId)

      switch (event) {
        /*
         * Handle changes to the document.
         * We use this for syncing the room title to the database.
         */
        case 'change': {
          console.log('change event webhook')
          const title = payload.document.meta.title ?? ''
          const language = payload.document.editorLanguage ?? 'plaintext'

          console.log(payload)

          await db
            .update(schema.rooms)
            .set({
              title,
              editorLanguage: language,
            })
            .where(eq(schema.rooms.id, roomId))

          return {
            serverId,
          }
        }

        /*
         * Handle connection events.
         * We use this to update the `room_participants` table.
         */
        case 'connect': {
          console.log('[Sync] onConnect')
          const cookies = (payload.requestHeaders.cookie as string)
            .split('; ')
            .map((c) => {
              const [key, value] = c.split('=', 2)

              if (!key || !value) {
                return undefined
              }

              return {
                key,
                value,
              }
            })
            .filter((c) => c !== undefined)

          const sessionToken = cookies.find(
            (c) => c.key === 'avelin.session_jwt',
          )

          if (!sessionToken) {
            console.log('Session token not found')
            return c.error(401, {
              error: '[connect webhook] Session token cookie not found',
            })
          }

          // const data = await auth.api.getSession({
          //   headers: payload.requestHeaders,
          // })
          let auth: AuthJWTPayload

          try {
            auth = await validateJwt(sessionToken.value)
          } catch (error) {
            console.log('Invalid session JWT', error)
            return c.error(401, {
              error: `[connect webhook] invalid session jwt: ${error}`,
            })
          }

          const roomConnectionId = newId('roomConnection')

          console.log('auth:', auth)

          console.log(
            '[Sync] onConnect - user:',
            auth.id,
            'serverId:',
            serverId,
          )

          try {
            await db.transaction(async (tx) => {
              await tx
                .insert(schema.roomParticipants)
                .values({
                  roomId: roomId,
                  userId: auth.id,
                  lastAccessedAt: new Date(),
                })
                .onConflictDoUpdate({
                  target: [
                    schema.roomParticipants.roomId,
                    schema.roomParticipants.userId,
                  ],
                  set: {
                    lastAccessedAt: new Date(),
                  },
                })

              await tx.insert(schema.roomConnections).values({
                id: roomConnectionId,
                roomId,
                userId: auth.id,
                serverId,
              })
            })
          } catch (err) {
            console.error(
              'Error on case CONNECT for sync webhook. Attempted to insert room_participants & room_connections tables',
            )
            console.error(err)
          }

          return {
            serverId,
            roomConnectionId,
          }
        }

        /*
         * Handle disconnection events.
         * We use this to update the `room_participants` table.
         */
        case 'disconnect': {
          const auth = payload.context as AuthJWTPayload
          const roomConnectionId = payload.context.roomConnectionId as string

          console.log(
            '[Sync] onDisconnect - user:',
            auth.id,
            'roomConnectionId:',
            roomConnectionId,
          )

          try {
            await db.transaction(async (tx) => {
              await tx
                .update(schema.roomParticipants)
                .set({
                  lastAccessedAt: new Date(),
                })
                .where(
                  and(
                    eq(schema.roomParticipants.roomId, roomId),
                    eq(schema.roomParticipants.userId, auth.id),
                  ),
                )

              await db
                .update(schema.roomConnections)
                .set({
                  disconnectedAt: new Date(),
                  isActive: false,
                })
                .where(eq(schema.roomConnections.id, roomConnectionId))
            })
          } catch (err) {
            console.error(
              'Error on case DISCONNECT for sync webhook. Attempted to update room_connections table',
            )
            console.error(err)
          }

          return {
            serverId,
            roomConnectionId,
          }
        }

        /*
         * Other events are not handled.
         */
        default: {
          return {}
        }
      }
    }),
)
