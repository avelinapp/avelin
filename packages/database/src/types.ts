import type { InferInsertModel, InferSelectModel } from 'drizzle-orm/table'
import type { accounts, rooms, sessions, users } from './schema.js'

export type User = InferSelectModel<typeof users>
export type Session = InferSelectModel<typeof sessions>
export type CreateSession = InferInsertModel<typeof sessions>
export type Auth = { user: User; session: Session }
export type Account = InferSelectModel<typeof accounts>
export type Room = InferSelectModel<typeof rooms>

export type { NeonDatabase } from 'drizzle-orm/neon-serverless'
