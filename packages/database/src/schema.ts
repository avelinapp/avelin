import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'
import { bytea } from './db'

export const users = pgTable('users', {
  id: text().primaryKey(),
  email: text().notNull().unique(),
  name: text().notNull(),
  picture: text(),
})

export const oauthAccounts = pgTable(
  'oauth_accounts',
  {
    providerId: text().notNull(),
    providerUserId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
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
})

export const rooms = pgTable('rooms', {
  id: text().primaryKey(),
  slug: text().unique(),
  ydoc: bytea(),
  title: text(),
})

export const schema = {
  users,
  sessions,
  oauthAccounts,
  rooms,
}
