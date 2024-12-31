import { db, eq, schema } from '@avelin/database'
import { Hono } from 'hono'
import { createHmac, timingSafeEqual } from 'node:crypto'

const secret = process.env.HOCUSPOCUS_WEBHOOK_SECRET as string

export const hocuspocusApp = new Hono().post('/', async (c) => {
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

  const bodyJson = await c.req.json()

  const roomId = bodyJson.payload.documentName as string
  const title =
    (bodyJson.payload.document.meta.title as string | undefined) ?? null

  await db
    .update(schema.rooms)
    .set({
      title,
    })
    .where(eq(schema.rooms.id, roomId))

  return c.json({}, 200)
})
