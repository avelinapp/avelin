import { createSelectSchema } from 'drizzle-zod'
import { schema } from './schema'
import z from 'zod'

export const userSchema = createSelectSchema(schema.users, {
  createdAt: (schema) => schema.createdAt.pipe(z.coerce.date()),
  updatedAt: (schema) => schema.updatedAt.pipe(z.coerce.date()),
  deletedAt: (schema) => schema.deletedAt.pipe(z.coerce.date()),
  retiredAt: (schema) => schema.retiredAt.pipe(z.coerce.date()),
})

export const sessionSchema = createSelectSchema(schema.sessions, {
  expiresAt: (schema) => schema.expiresAt.pipe(z.coerce.date()),
})

export const roomSchema = createSelectSchema(schema.rooms, {
  createdAt: (schema) => schema.createdAt.pipe(z.coerce.date()),
  updatedAt: (schema) => schema.updatedAt.pipe(z.coerce.date()),
  deletedAt: (schema) => schema.deletedAt.pipe(z.coerce.date()),
  ydoc: (schema) => z.instanceof(Buffer<ArrayBufferLike>).nullable(),
})

export const roomParticipantSchema = createSelectSchema(
  schema.roomParticipants,
  {
    createdAt: (schema) => schema.createdAt.pipe(z.coerce.date()),
    updatedAt: (schema) => schema.updatedAt.pipe(z.coerce.date()),
    deletedAt: (schema) => schema.deletedAt.pipe(z.coerce.date()),
  },
)
