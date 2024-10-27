import { drizzle } from 'drizzle-orm/neon-serverless'
import { config } from 'dotenv'

config({ path: '.env' }) // or .env.local

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

export const db = drizzle(process.env.DATABASE_URL)
