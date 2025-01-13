import { validateSession } from '@avelin/auth'
import { db, eq, schema, User } from '@avelin/database'
import { newId } from '@avelin/id'
import { and } from 'drizzle-orm'
import { Hono } from 'hono'
import { createHmac, timingSafeEqual } from 'node:crypto'

const secret = process.env.HOCUSPOCUS_WEBHOOK_SECRET as string

export const hocuspocusApp = new Hono().post('/', async (c) => {
  /* Verify the request signature */
  const body = new Uint8Array(await c.req.arrayBuffer())

  const signature = Buffer.from(
    c.req.header('x-hocuspocus-signature-256') as string,
  )

  const hmac = createHmac('sha256', secret)
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
    return c.json(
      {
        error: 'Could not validate webhook signature - failed.',
      },
      400,
    )
  }

  const data = await c.req.json()

  const { event, payload } = data
  const roomId = payload.documentName as string

  switch (event) {
    /*
     * Handle changes to the document.
     * We use this for syncing the room title to the database.
     *
     * TODO: Sync editor language to the database as well.
     */
    case 'change': {
      const title = (payload.document.meta.title as string | undefined) ?? null

      await db
        .update(schema.rooms)
        .set({
          title,
        })
        .where(eq(schema.rooms.id, roomId))

      return c.json({}, 200)
    }

    /*
     * Handle connection events.
     * We use this to update the `room_participants` table.
     */
    case 'connect': {
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

      const sessionCookie = cookies.find((c) => c.key === 'avelin_session_id')

      if (!sessionCookie) {
        return c.json({}, 401)
      }

      const auth = await validateSession(sessionCookie.value)

      if (!auth) {
        return c.json({}, 401)
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

      return c.json({}, 200)
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

      return c.json({}, 200)
    }

    /*
     * Other events are not handled.
     */
    default: {
      return c.json({}, 500)
    }
  }
})
