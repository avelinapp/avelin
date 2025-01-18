import { drizzle } from 'drizzle-orm/neon-serverless'
import { config } from 'dotenv'
import { customType } from 'drizzle-orm/pg-core'

// config({ path: '.env' }) // or .env.local

// if (!process.env.DATABASE_URL) {
//   throw new Error('@avelin/database: DATABASE_URL is not set')
// }

export const db = drizzle(process.env.DATABASE_URL!)

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
