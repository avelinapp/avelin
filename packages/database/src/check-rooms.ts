import { config } from 'dotenv'
import { isNull, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/neon-http'
import { rooms, users } from './schema'

config({ path: '.env' })

const db = drizzle(process.env.DATABASE_URL!)

async function check() {
  console.log('🔍 Checking room distribution...\n')

  // Rooms created by test users
  const testUserRoomsResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(rooms)
    .innerJoin(users, sql`${rooms.creatorId} = ${users.id}`)
    .where(sql`${users.email} LIKE '%@example.com'`)

  // Rooms created by non-test users
  const nonTestUserRoomsResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(rooms)
    .leftJoin(users, sql`${rooms.creatorId} = ${users.id}`)
    .where(
      sql`${users.email} NOT LIKE '%@example.com' OR ${users.email} IS NULL`,
    )

  // Rooms with no creator
  const noCreatorRoomsResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(rooms)
    .where(isNull(rooms.creatorId))

  console.log(
    `Rooms created by test users (@example.com): ${testUserRoomsResult[0].count}`,
  )
  console.log(
    `Rooms created by real users (non-@example.com): ${nonTestUserRoomsResult[0].count}`,
  )
  console.log(`Rooms with no creator: ${noCreatorRoomsResult[0].count}`)

  process.exit(0)
}

check()
