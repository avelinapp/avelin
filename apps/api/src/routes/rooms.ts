import { createHmac, timingSafeEqual } from 'node:crypto'
import { auth, authCookies } from '@avelin/auth'
import { type User, and, db, eq, schema, sql } from '@avelin/database'
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
      const serverId = payload.requestParameters.serverName as string

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
          console.log('connect event webhook')
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

          const sessionCookie = cookies.find(
            (c) => c.key === authCookies.sessionToken.name,
          )

          if (!sessionCookie) {
            console.log('Session cookie not found')
            return c.error(401, {
              error: '[connect webhook] Session cookie not found',
            })
          }

          const data = await auth.api.getSession({
            headers: payload.requestHeaders,
          })

          if (!data) {
            console.log('Invalid session ID', sessionCookie.value)
            return c.error(401, {
              error: `[connect webhook] invalid session token: ${sessionCookie.value}`,
            })
          }

          const { user } = data

          try {
            await db
              .insert(schema.roomParticipants)
              .values({
                roomId: roomId,
                userId: user.id,
                isConnected: true,
                connectedAt: new Date(),
                connectionCount: 1,
              })
              .onConflictDoUpdate({
                target: [
                  schema.roomParticipants.roomId,
                  schema.roomParticipants.userId,
                ],
                set: {
                  connectionCount: sql`${schema.roomParticipants.connectionCount} + 1`,
                  isConnected: true,
                  connectedAt: new Date(),
                  lastAccessedAt: new Date(),
                },
              })
          } catch (err) {
            console.error(
              'Error on case CONNECT for sync webhook. Attempted to insert/update room_participants table',
            )
            console.error(err)
          }

          return {
            serverId,
          }
        }

        /*
         * Handle disconnection events.
         * We use this to update the `room_participants` table.
         */
        case 'disconnect': {
          const user = payload.context.user as User

          try {
            await db
              .update(schema.roomParticipants)
              .set({
                /* We won't set `isConnected` to false, because we don't know if the user has other sessions. */
                /* A database trigger will set `isConnected` to false if `connectionCount` is less than or equal to 0. */
                /* We will set `connectionCount` to the current value minus 1. */
                connectionCount: sql`${schema.roomParticipants.connectionCount} - 1`,
                disconnectedAt: new Date(),
                lastAccessedAt: new Date(),
              })
              .where(
                and(
                  eq(schema.roomParticipants.roomId, roomId),
                  eq(schema.roomParticipants.userId, user.id),
                ),
              )
          } catch (err) {
            console.error(
              'Error on case DISCONNECT for sync webhook. Attempted to update room_participants table',
            )
            console.error(err)
          }

          return {
            serverId,
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
