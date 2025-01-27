import Elysia, { t } from 'elysia'
import { authMiddleware } from '../middleware/auth'
import { db, eq, and, type User, type Room, schema } from '@avelin/database'
import { newId, newRoomSlug } from '@avelin/id'
import { getRoomMiddleware } from '../middleware/rooms'
import { validateSession } from '@avelin/auth'
import { createHmac, timingSafeEqual } from 'crypto'
import { readableStreamToArrayBuffer } from 'bun'
import { env } from '../env'

export const rooms = new Elysia({ prefix: '/rooms' })
  .guard({}, (app) =>
    app
      .use(authMiddleware)
      .guard(
        {
          params: t.Object({
            slug: t.String(),
          }),
        },
        (app) => app.use(getRoomMiddleware).get('/:slug', ({ room }) => room),
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
      }),
  )
  .guard({}, (app) =>
    app
      .onParse(async ({ request, headers }) => {
        if (headers['content-type'] === 'application/json; charset=utf-8') {
          const arrayBuffer = await readableStreamToArrayBuffer(
            request.body as any,
          )
          const rawBody = Buffer.from(arrayBuffer)
          return rawBody
        }
      })
      .post('/sync/webhook', async (c) => {
        /* Verify the request signature */
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

            await db.transaction(async (tx) => {
              const [rp] = await tx
                .select()
                .from(schema.roomParticipants)
                .where(
                  and(
                    eq(schema.roomParticipants.roomId, roomId),
                    eq(schema.roomParticipants.userId, user.id),
                  ),
                )

              if (!rp) {
                await tx.insert(schema.roomParticipants).values({
                  id: newId('roomParticipant'),
                  roomId: roomId,
                  userId: user.id,
                })
              } else {
                await tx
                  .update(schema.roomParticipants)
                  .set({
                    lastAccessedAt: new Date(),
                  })
                  .where(
                    and(
                      eq(schema.roomParticipants.roomId, roomId),
                      eq(schema.roomParticipants.userId, user.id),
                    ),
                  )
              }
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
