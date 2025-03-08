export * from './db.js'
export * from './types.js'
export * from './drizzle.js'
export * from './constants.js'
export * from './zod.js'

import * as drizzleSchema from './schema.js'

export const schema = {
  users: drizzleSchema.users,
  accounts: drizzleSchema.accounts,
  sessions: drizzleSchema.sessions,
  rooms: drizzleSchema.rooms,
  roomParticipants: drizzleSchema.roomParticipants,
  usersRelations: drizzleSchema.usersRelations,
  accountsRelations: drizzleSchema.accountsRelations,
  sessionsRelations: drizzleSchema.sessionsRelations,
  roomsRelations: drizzleSchema.roomsRelations,
  roomParticipantsRelations: drizzleSchema.roomParticipantsRelations,
  waitlistEntries: drizzleSchema.waitlistEntries,
  waitlistEntriesRelations: drizzleSchema.waitlistEntriesRelations,
}
