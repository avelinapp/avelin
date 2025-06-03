import { newId } from '@avelin/id'
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
import { bytea } from './db.js'
import { timestamps } from './helpers/columns.js'

export const users = pgTable('users', {
  id: text()
    .primaryKey()
    .$defaultFn(() => newId('user')),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  name: text().notNull(),
  picture: text(),
  isAnonymous: boolean().default(false),
  /* When an anonymous user was transitioned to a real user. */
  retiredAt: timestamp({ withTimezone: true, mode: 'date' }),
  ...timestamps,
})

export const usersRelations = relations(users, ({ many }) => ({
  oauthAccounts: many(accounts),
  sessions: many(sessions),
  createdRooms: many(rooms),
  joinedRooms: many(roomParticipants),
  roomConnections: many(roomConnections),
}))

export const accounts = pgTable('accounts', {
  id: text()
    .primaryKey()
    .$defaultFn(() => newId('account')),
  providerId: text().notNull(),
  accountId: text().notNull(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp({ withTimezone: true, mode: 'date' }),
  refreshTokenExpiresAt: timestamp({ withTimezone: true, mode: 'date' }),
  scope: text(),
  password: text(),
  ...timestamps,
})

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const sessions = pgTable('sessions', {
  id: text()
    .primaryKey()
    .$defaultFn(() => newId('session')),
  token: text().notNull().unique(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  ipAddress: text(),
  userAgent: text(),
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

export const verifications = pgTable('verifications', {
  id: text()
    .primaryKey()
    .$defaultFn(() => newId('verification')),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
  ...timestamps,
})

export const jwks = pgTable('jwks', {
  id: text()
    .primaryKey()
    .$defaultFn(() => newId('jwk')),
  publicKey: text().notNull(),
  privateKey: text().notNull(),
  ...timestamps,
})

export const rooms = pgTable('rooms', {
  id: text()
    .primaryKey()
    .$defaultFn(() => newId('room')),
  slug: text().unique(),
  staticSlug: text().notNull().unique(),
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
  connections: many(roomConnections),
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
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.roomId, table.userId] })],
)

export const roomParticipantsRelations = relations(
  roomParticipants,
  ({ one, many }) => ({
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

export const roomConnections = pgTable('room_connections', {
  id: text()
    .primaryKey()
    .$defaultFn(() => newId('roomConnection')),
  roomId: text()
    .notNull()
    .references(() => rooms.id, { onDelete: 'cascade' }),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  serverId: text().notNull(),
  connectedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  disconnectedAt: timestamp({ withTimezone: true }),
  isActive: boolean().notNull().default(true),
  ...timestamps,
})

export const roomConnectionsRelations = relations(
  roomConnections,
  ({ one }) => ({
    user: one(users, {
      fields: [roomConnections.userId],
      references: [users.id],
    }),
    room: one(rooms, {
      fields: [roomConnections.roomId],
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
  id: text()
    .primaryKey()
    .$defaultFn(() => newId('waitlistEntry')),
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
