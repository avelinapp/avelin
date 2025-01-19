import { InferSelectModel } from 'drizzle-orm/table'
import { users, sessions, oauthAccounts, rooms } from './schema'

export type User = InferSelectModel<typeof users>
export type Session = InferSelectModel<typeof sessions>
export type Auth = { user: User; session: Session }
export type OAuthAccount = InferSelectModel<typeof oauthAccounts>
export type Room = InferSelectModel<typeof rooms>

export type { NeonDatabase } from 'drizzle-orm/neon-serverless'
