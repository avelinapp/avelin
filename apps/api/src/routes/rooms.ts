import { createHmac, timingSafeEqual } from 'node:crypto'
import { validateSession } from '@avelin/auth'
import {
  type Room,
  type User,
  and,
  db,
  desc,
  eq,
  getTableColumns,
  isNull,
  or,
  schema,
  sql,
} from '@avelin/database'
import { newId, newRoomSlug } from '@avelin/id'
import { readableStreamToArrayBuffer } from 'bun'
import Elysia, { t } from 'elysia'
import { omit } from 'remeda'
import { env } from '../env'
import { authMiddleware } from '../middleware/auth'
import { getRoomMiddleware } from '../middleware/rooms'

export const rooms = new Elysia({ prefix: '/rooms' })
  .guard({}, (app) =>
    app
      .use(authMiddleware)
      .guard(
        {
          params: t.Object({
            idOrSlug: t.String(),
          }),
        },
        (app) =>
          app
            .use(getRoomMiddleware)
            .get('/:idOrSlug', ({ room }) => room)
            .delete('/:idOrSlug', async ({ room, error, user }) => {
              if (
                room.creatorId !== 'user_system' &&
                room.creatorId !== user.id
              ) {
                return error(403, {
                  error: 'You are not authorized to delete this room.',
                })
              }

              const [deletedRoom] = await db
                .update(schema.rooms)
                .set({ deletedAt: sql`now()` })
                .where(eq(schema.rooms.id, room.id))
                .returning()

              if (!deletedRoom) {
                return error(404, {
                  error: 'Room not found.',
                })
              }

              return deletedRoom
            }),
      )
      .post('/create', async ({ user }) => {
        const newRoom = await db.transaction(async (tx) => {
          const [room] = await tx
            .insert(schema.rooms)
            .values({
              id: newId('room'),
              slug: newRoomSlug(),
              creatorId: user.id,
            })
            .returning({
              id: schema.rooms.id,
              slug: schema.rooms.slug,
            })

          return room
        })

        return newRoom as Required<Room>
      })
      .get('/', async ({ user, error }) => {
        try {
          const rooms = await db
            .select({
              ...omit(getTableColumns(schema.rooms), ['ydoc']),
              lastAccessedAt: schema.roomParticipants.lastAccessedAt,
              participantId: schema.roomParticipants.userId,
            })
            .from(schema.rooms)
            .leftJoin(
              schema.roomParticipants,
              eq(schema.rooms.id, schema.roomParticipants.roomId),
            )
            .where(
              and(
                or(
                  eq(schema.roomParticipants.userId, user.id),
                  // If the user is the creator, but has not joined the room, show it
                  // In the case where the user is the creator and has joined the room, the room will be included b/c of the previous condition.
                  and(
                    eq(schema.rooms.creatorId, user.id),
                    isNull(schema.roomParticipants.userId),
                  ),
                ),

                isNull(schema.rooms.deletedAt),
              ),
            )
            .orderBy(desc(schema.roomParticipants.lastAccessedAt))

          return rooms
        } catch (err) {
          return error(500, { error: (err as Error).message })
        }
      }),
  )
  .guard({}, (app) =>
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

            return {}
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
              (c) => c.key === 'avelin_session_id',
            )

            if (!sessionCookie) {
              console.log('Session cookie not found')
              return c.error(401)
            }

            const auth = await validateSession(sessionCookie.value, { db })

            if (!auth) {
              console.log('Invalid session ID', sessionCookie.value)
              return c.error(401)
            }

            const { user } = auth

            await db
              .insert(schema.roomParticipants)
              .values({
                roomId: roomId,
                userId: user.id,
                isConnected: true,
                connectedAt: new Date(),
              })
              .onConflictDoUpdate({
                target: [
                  schema.roomParticipants.roomId,
                  schema.roomParticipants.userId,
                ],
                set: {
                  lastAccessedAt: new Date(),
                  isConnected: true,
                  connectedAt: new Date(),
                },
              })

            return {}
          }

          /*
           * Handle disconnection events.
           * We use this to update the `room_participants` table.
           */
          case 'disconnect': {
            const user = payload.context.user as User

            await db
              .update(schema.roomParticipants)
              .set({
                lastAccessedAt: new Date(),
                isConnected: false,
                disconnectedAt: new Date(),
              })
              .where(
                and(
                  eq(schema.roomParticipants.roomId, roomId),
                  eq(schema.roomParticipants.userId, user.id),
                ),
              )

            return {}
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
