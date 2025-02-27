import { relations } from 'drizzle-orm'
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { boolean } from 'drizzle-orm/pg-core'
import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import { bytea } from './db.js'
import { timestamps } from './helpers/columns.js'

export const users = pgTable('users', {
  id: text().primaryKey(),
  email: text().notNull().unique(),
  name: text().notNull(),
  picture: text(),
  isAnonymous: boolean().default(false),
  /* When an anonymous user was transitioned to a real user. */
  retiredAt: timestamp({ withTimezone: true, mode: 'date' }),
  /* User ID for the real user account initiated from this anonymous user. */
  linkedUserId: text().references((): AnyPgColumn => users.id, {
    onDelete: 'cascade',
  }),
  ...timestamps,
})

export const usersRelations = relations(users, ({ one, many }) => ({
  oauthAccounts: many(oauthAccounts),
  linkedUser: one(users, {
    fields: [users.linkedUserId],
    references: [users.id],
  }),
  sessions: many(sessions),
  createdRooms: many(rooms),
  joinedRooms: many(roomParticipants),
}))

export const oauthAccounts = pgTable(
  'oauth_accounts',
  {
    providerId: text().notNull(),
    providerUserId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.providerId, table.providerUserId] }),
  ],
)

export const oauthAccountsRelations = relations(oauthAccounts, ({ one }) => ({
  user: one(users, {
    fields: [oauthAccounts.userId],
    references: [users.id],
  }),
}))

export const sessions = pgTable('sessions', {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp({
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  ...timestamps,
})

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const rooms = pgTable('rooms', {
  id: text().primaryKey(),
  slug: text().unique(),
  ydoc: bytea(),
  title: text(),
  editorLanguage: text().default('plaintext'),
  /* System user should be creator only for migrations and legacy data. */
  /* All rooms should be assigned a creator which is a real user. */
  creatorId: text().references(() => users.id, { onDelete: 'cascade' }),
  ...timestamps,
})

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  creator: one(users, {
    fields: [rooms.creatorId],
    references: [users.id],
  }),
  roomParticipants: many(roomParticipants),
}))

export const roomParticipants = pgTable(
  'room_participants',
  {
    roomId: text()
      .notNull()
      .references(() => rooms.id, { onDelete: 'cascade' }),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    /* This is either the last join date (if the user is still in the room) or the last leave date (if the user left the room). */
    lastAccessedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    isConnected: boolean().notNull().default(false),
    connectedAt: timestamp({ withTimezone: true }),
    disconnectedAt: timestamp({ withTimezone: true }),
    /* The number of active sessions that this user has in the room. */
    connectionCount: integer().notNull().default(0),
    /* createdAt holds to the initial join date. */
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.roomId, table.userId] })],
)

export const roomParticipantsRelations = relations(
  roomParticipants,
  ({ one }) => ({
    user: one(users, {
      fields: [roomParticipants.userId],
      references: [users.id],
    }),
    room: one(rooms, {
      fields: [roomParticipants.roomId],
      references: [rooms.id],
    }),
  }),
)

export const waitlistStatusEnum = pgEnum('waitlist_entry_status', [
  'waitlist_joined',
  'invite_sent',
  'invite_accepted',
])

export const waitlistEntries = pgTable('waitlist_entries', {
  /* Prefixed with wl_ for clarity. */
  id: text().primaryKey(),
  /* User ID is set when the user accepts their invitation and joins the pre-launch. */
  userId: text().references(() => users.id, { onDelete: 'no action' }),
  /* Email is set when the user joins the waitlist. */
  email: text().notNull().unique(),
  /* The position of the user in the waitlist. */
  position: integer().generatedByDefaultAsIdentity({ startWith: 1 }),
  /* The status of the user in the waitlist. */
  status: waitlistStatusEnum().notNull().default('waitlist_joined'),
  /* The date the user was joined the waitlist. */
  joinedAt: timestamp({ withTimezone: true, mode: 'date' }).defaultNow(),
  /* The date when the user was invited to join the pre-launch. */
  invitedAt: timestamp({ withTimezone: true, mode: 'date' }),
  /* The date when the user accepted their invitation and joined the pre-launch. */
  acceptedAt: timestamp({ withTimezone: true, mode: 'date' }),
  ...timestamps,
})

export const waitlistEntriesRelations = relations(
  waitlistEntries,
  ({ one }) => ({
    user: one(users, {
      fields: [waitlistEntries.userId],
      references: [users.id],
    }),
  }),
)
