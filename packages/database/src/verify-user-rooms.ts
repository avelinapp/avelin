import { config } from 'dotenv'
import { eq, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/neon-http'
import { roomParticipants, rooms } from './schema'

config({ path: '.env' })

const db = drizzle(process.env.DATABASE_URL!)
const YOUR_USER_ID = 'user_019326bb1acb7662b27ac8f8a8cae486'

async function verify() {
  console.log('🔍 Verifying your participation in rooms...\n')

  // Count total rooms
  const totalRoomsResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(rooms)

  const totalRooms = Number(totalRoomsResult[0].count)

  // Count rooms you created
  const createdRoomsResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(rooms)
    .where(eq(rooms.creatorId, YOUR_USER_ID))

  const createdRooms = Number(createdRoomsResult[0].count)

  // Count rooms you're a participant in
  const participantRoomsResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(roomParticipants)
    .where(eq(roomParticipants.userId, YOUR_USER_ID))

  const participantRooms = Number(participantRoomsResult[0].count)

  console.log(`Total rooms in database: ${totalRooms}`)
  console.log(`Rooms you created: ${createdRooms}`)
  console.log(`Rooms you're a participant in: ${participantRooms}`)
  console.log('')

  if (participantRooms === totalRooms) {
    console.log('✅ Success! You are a participant in ALL rooms.')
  } else {
    console.log(
      `⚠️ Warning: You are only in ${participantRooms} out of ${totalRooms} rooms.`,
    )
  }

  process.exit(0)
}

verify()
