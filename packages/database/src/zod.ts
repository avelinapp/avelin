import { createSelectSchema } from 'drizzle-zod'
import { schema } from './schema'
import z from 'zod'

export const userSchema = createSelectSchema(schema.users, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
  retiredAt: z.coerce.date().nullable(),
})

export const sessionSchema = createSelectSchema(schema.sessions, {
  expiresAt: (schema) => schema.expiresAt.pipe(z.coerce.date()),
})

export const roomSchema = createSelectSchema(schema.rooms, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
  ydoc: z.instanceof(Buffer<ArrayBufferLike>).nullable(),
})

export const roomParticipantSchema = createSelectSchema(
  schema.roomParticipants,
  {
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    deletedAt: z.coerce.date().nullable(),
  },
)
