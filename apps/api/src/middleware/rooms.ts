import {
  type Room,
  db,
  eq,
  getTableColumns,
  or,
  schema,
} from '@avelin/database'
import Elysia from 'elysia'
import { omit } from 'remeda'

export const getRoomMiddleware = new Elysia().derive(
  { as: 'scoped' },
  async ({ params: { idOrSlug }, error }) => {
    const [room] = await db
      .select({
        ...omit(getTableColumns(schema.rooms), ['ydoc']),
      })
      .from(schema.rooms)
      // @ts-ignore
      .where(or(eq(schema.rooms.id, idOrSlug), eq(schema.rooms.slug, idOrSlug)))
      .limit(1)

    if (!room) {
      return error(404, {
        error: 'Room not found',
      })
    }

    return { room: room as Omit<Room, 'ydoc'> }
  },
)
