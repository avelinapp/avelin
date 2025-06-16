export * from './constants.js'
export * from './db.js'
export * from './drizzle.js'
export * from './types.js'
export * from './zod.js'

import * as drizzleSchema from './schema.js'

export const schema = {
  users: drizzleSchema.users,
  accounts: drizzleSchema.accounts,
  sessions: drizzleSchema.sessions,
  verifications: drizzleSchema.verifications,
  jwks: drizzleSchema.jwks,
  rooms: drizzleSchema.rooms,
  roomParticipants: drizzleSchema.roomParticipants,
  roomConnections: drizzleSchema.roomConnections,
  usersRelations: drizzleSchema.usersRelations,
  accountsRelations: drizzleSchema.accountsRelations,
  sessionsRelations: drizzleSchema.sessionsRelations,
  roomsRelations: drizzleSchema.roomsRelations,
  roomParticipantsRelations: drizzleSchema.roomParticipantsRelations,
  roomConnectionsRelations: drizzleSchema.roomConnectionsRelations,
  waitlistEntries: drizzleSchema.waitlistEntries,
  waitlistEntriesRelations: drizzleSchema.waitlistEntriesRelations,
}
