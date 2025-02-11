import path from 'node:path'
import { config } from 'dotenv'
// import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'

config({ path: '.env' }) // or .env.local

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

console.log('DATABASE_URL:', process.env.DATABASE_URL)

const db = drizzle(process.env.DATABASE_URL)

// Check migrations which have been already applied
// Grabs rows from the "drizzle" schema in the "__drizzle_migrations" table
// db.execute(sql`SELECT * FROM drizzle.__drizzle_migrations`).then((value) => {
//   console.log(value.rows)
// })

console.log('Running migrations...')

migrate(db, { migrationsFolder: path.join(__dirname, '../migrations') })
  .then(() => {
    console.log('Migrations finished!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Migrations failed.')
    console.log(err)
    process.exit(1)
  })
