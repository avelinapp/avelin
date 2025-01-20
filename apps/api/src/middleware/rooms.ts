import { db, schema, eq, Room, getTableColumns } from '@avelin/database'
import Elysia from 'elysia'
import { omit } from 'remeda'

export const getRoomMiddleware = new Elysia().derive(
  { as: 'scoped' },
  async ({ params: { slug }, error }) => {
    const [room] = await db
      .select({
        ...omit(getTableColumns(schema.rooms), ['ydoc']),
      })
      .from(schema.rooms)
      // @ts-ignore
      .where(eq(schema.rooms.slug, slug))
      .limit(1)

    if (!room) {
      error(404, {
        error: 'Room not found',
      })
    }

    return { room: room as Omit<Room, 'ydoc'> }
  },
)
