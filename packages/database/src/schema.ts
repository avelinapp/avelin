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
