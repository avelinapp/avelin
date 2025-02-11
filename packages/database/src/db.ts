import { drizzle } from 'drizzle-orm/neon-serverless'
import { customType } from 'drizzle-orm/pg-core'

export const db = drizzle(process.env.DATABASE_URL!)

// biome-ignore lint/suspicious/noExplicitAny: false
export const createDb = (ws: any) =>
  drizzle({
    connection: process.env.DATABASE_URL!,
    ws,
  })

export const bytea = customType<{ data: Buffer; default: false }>({
  dataType() {
    return 'bytea'
  },
})
