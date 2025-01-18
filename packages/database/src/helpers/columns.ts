import { timestamp } from 'drizzle-orm/pg-core'

export const timestamps = {
  updatedAt: timestamp({ withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp({ withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp({ withTimezone: true, mode: 'date' }),
}
