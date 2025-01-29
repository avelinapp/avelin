import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'
import { bytea } from './db'
import { boolean } from 'drizzle-orm/pg-core'
import { AnyPgColumn } from 'drizzle-orm/pg-core'
import { timestamps } from './helpers/columns'

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
  (table) => {
    return {
      pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
    }
  },
)

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
    /* createdAt holds to the initial join date. */
    ...timestamps,
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.roomId, table.userId] }),
    }
  },
)

export const schema = {
  users,
  sessions,
  oauthAccounts,
  rooms,
  roomParticipants,
}
