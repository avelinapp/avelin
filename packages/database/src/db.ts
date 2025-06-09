import { drizzle } from 'drizzle-orm/neon-serverless'

export const db = drizzle(process.env.DATABASE_URL!)

// biome-ignore lint/suspicious/noExplicitAny: false
export const createDb = (ws: any) =>
  drizzle({
    connection: process.env.DATABASE_URL!,
    ws,
  })
