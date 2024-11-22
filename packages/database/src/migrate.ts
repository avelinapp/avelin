import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import path from 'path'

config({ path: '.env' }) // or .env.local

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const db = drizzle(process.env.DATABASE_URL)

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
