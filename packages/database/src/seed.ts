import { newId, newRoomSlug } from '@avelin/id'
import { config } from 'dotenv'
import { eq, like } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/neon-http'
import { rooms, users } from './schema.js'

config({ path: '.env' })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const db = drizzle(process.env.DATABASE_URL)

// Your user ID to ensure you're on all rooms
const YOUR_USER_ID = 'user_019326bb1acb7662b27ac8f8a8cae486'

// Famous tech figures for test users
const TEST_USERS = [
  { username: 'shadcn', name: 'shadcn' },
  { username: 'rauchg', name: 'Guillermo Rauch' },
  { username: 't3dotgg', name: 'Theo Browne' },
  { username: 'leerob', name: 'Lee Robinson' },
  { username: 'kentcdodds', name: 'Kent C. Dodds' },
  { username: 'wesbos', name: 'Wes Bos' },
  { username: 'sindresorhus', name: 'Sindre Sorhus' },
  { username: 'addyosmani', name: 'Addy Osmani' },
  { username: 'stolinski', name: 'Scott Tolinski' },
  { username: 'ryanflorence', name: 'Ryan Florence' },
  { username: 'mjackson', name: 'Michael Jackson' },
  { username: 'timneutkens', name: 'Tim Neutkens' },
  { username: 'skve', name: 'Luke Shiels' },
  { username: 'adamwathan', name: 'Adam Wathan' },
  { username: 'emilwidlund', name: 'Emil Widlund' },
  { username: 'aboodman', name: 'Aaron Boodman' },
  { username: 'raunofreiberg', name: 'Rauno Freiberg' },
  { username: 'jaredpalmer', name: 'Jared Palmer' },
  { username: 'pqoqubbw', name: 'dmytro' },
  { username: 'sebmarkbage', name: 'Sebastian Markbåge' },
  { username: 'sophiebits', name: 'Sophie Alpert' },
  { username: 'acdlite', name: 'Andrew Clark' },
  { username: 'gaearon', name: 'Dan Abramov' },
  { username: 'BrendanEich', name: 'Brendan Eich' },
  { username: 'dhh', name: 'DHH' },
  { username: 'paulg', name: 'Paul Graham' },
  { username: 'getify', name: 'Kyle Simpson' },
  { username: 'rem', name: 'Remy Sharp' },
  { username: 'chriscoyier', name: 'Chris Coyier' },
  { username: 'samselikoff', name: 'Sam Selikoff' },
  { username: 'artman', name: 'Tuomas Artman' },
  { username: 'pacocoursey', name: 'Paco Coursey' },
  { username: 'pontusab', name: 'Pontus Abrahamsson' },
  { username: 'ryanburgess', name: 'Ryan Burgess' },
  { username: 'brianleroux', name: 'Brian LeRoux' },
  { username: 'jlengstorf', name: 'Jason Lengstorf' },
  { username: 'swyx', name: 'Shawn Wang' },
  { username: 'cassidoo', name: 'Cassidy Williams' },
  { username: 'pilcrowonpaper', name: 'Pilcrow' },
  { username: 'mgechev', name: 'Minko Gechev' },
  { username: 'youyuxi', name: 'Evan You' },
  { username: 'sebmck', name: 'Sebastian McKenzie' },
  { username: 'slicknet', name: 'Nicholas C. Zakas' },
]

// Programming languages from constants.ts
const LANGUAGES = [
  'bat',
  'cpp',
  'css',
  'dockerfile',
  'go',
  'graphql',
  'html',
  'java',
  'javascript',
  'json',
  'lua',
  'markdown',
  'objective-c',
  'pascal',
  'perl',
  'php',
  'plaintext',
  'powershell',
  'python',
  'r',
  'ruby',
  'rust',
  'scheme',
  'scss',
  'shell',
  'sql',
  'typescript',
  'tsx',
  'xml',
  'yaml',
]

// Room title templates
const ROOM_TITLES = [
  'Quick Snippet',
  'Code Playground',
  'API Implementation',
  'Data Processing Script',
  'Web Server',
  'Authentication Module',
  'Database Query',
  'React Component',
  'Utility Functions',
  'Algorithm Practice',
  'Design Patterns',
  'Configuration File',
  'Build Script',
  'Test Suite',
  'CLI Tool',
  'REST API',
  'GraphQL Schema',
  'Deployment Config',
  'Docker Setup',
  'CI/CD Pipeline',
  'State Management',
  'Form Validation',
  'Data Visualization',
  'File Parser',
  'String Manipulation',
  'Array Operations',
  'Object Utilities',
  'Date Helpers',
  'Math Functions',
  'Network Request',
  'Error Handling',
  'Logging System',
  'Cache Implementation',
  'Rate Limiter',
  'Message Queue',
  'Event Emitter',
  'Middleware',
  'Router Config',
  'ORM Models',
  'Migration Script',
]

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)] as T
}

function generateRoomTitle(language: string): string {
  const template = randomElement(ROOM_TITLES)
  const languageName = language.charAt(0).toUpperCase() + language.slice(1)

  // Sometimes add language prefix, sometimes use generic title
  if (Math.random() > 0.3) {
    return `${languageName} ${template}`
  }
  return template
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  )
}

async function seed() {
  const roomCount = Number.parseInt(process.argv[2] || '1000', 10)
  console.log(`🌱 Starting database seed with ${roomCount} rooms...\n`)

  try {
    // Step 0: Cleanup - Remove all test users (with @example.com emails)
    console.log('🧹 Cleaning up existing test data...')

    const deletedUsers = await db
      .delete(users)
      .where(like(users.email, '%@example.com'))
      .returning()

    if (deletedUsers.length > 0) {
      console.log(
        `  ✓ Removed ${deletedUsers.length} test users (and their associated data via cascade)`,
      )
    } else {
      console.log('  ℹ No existing test users found')
    }
    console.log('')

    // Step 1: Verify your user account exists
    console.log('👤 Verifying your user account...')
    const [yourUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, YOUR_USER_ID))

    if (!yourUser) {
      console.error(`  ❌ User with ID ${YOUR_USER_ID} not found!`)
      console.error(
        '  Please update YOUR_USER_ID in the seed script with your actual user ID.',
      )
      process.exit(1)
    }

    console.log(`  ✓ Found your account: ${yourUser.name || yourUser.email}`)
    console.log('')

    // Step 2: Create test users
    console.log('👥 Creating test users...')
    const createdUsers = []

    for (const testUser of TEST_USERS) {
      const userId = newId('user')
      const [user] = await db
        .insert(users)
        .values({
          id: userId,
          name: testUser.name,
          email: `${testUser.username}@example.com`,
          picture: `https://github.com/${testUser.username}.png`,
          emailVerified: true,
          createdAt: randomDate(new Date('2024-01-01'), new Date()),
        })
        .onConflictDoNothing()
        .returning()

      if (user) {
        createdUsers.push(user)
        console.log(
          `  ✓ Created user: ${testUser.name} (@${testUser.username})`,
        )
      }
    }

    if (createdUsers.length === 0) {
      console.log('  ℹ No new users created (may already exist)')
      // Fetch existing users
      const existingUsers = await db
        .select()
        .from(users)
        .limit(TEST_USERS.length)
      createdUsers.push(...existingUsers)
    }

    console.log(`\n✓ ${createdUsers.length} users ready\n`)

    // Step 3: Generate rooms in batches
    console.log(`🏠 Generating ${roomCount} rooms...\n`)
    const batchSize = 100
    let totalCreated = 0
    const now = new Date()
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(now.getMonth() - 6)

    for (let i = 0; i < roomCount; i += batchSize) {
      const currentBatchSize = Math.min(batchSize, roomCount - i)
      const roomBatch = []

      for (let j = 0; j < currentBatchSize; j++) {
        const language = randomElement(LANGUAGES)
        // ALWAYS use your user as the creator so rooms show up in your dashboard
        // (Zero permissions prevent syncing roomParticipants, so we rely on creatorId)
        const creator = yourUser
        const createdAt = randomDate(sixMonthsAgo, now)
        const updatedAt = randomDate(createdAt, now)

        roomBatch.push({
          id: newId('room'),
          slug: newRoomSlug(),
          staticSlug: newRoomSlug(),
          title: generateRoomTitle(language),
          editorLanguage: language,
          creatorId: creator.id,
          createdAt,
          updatedAt,
        })
      }

      const insertedRooms = await db.insert(rooms).values(roomBatch).returning()

      // Step 4: DO NOT create roomParticipants entries
      // Zero has `insert: NOBODY_CAN` permission for roomParticipants (see packages/zero/src/schema.ts:225),
      // which means Zero won't sync participant rows created outside the Zero client.
      // The dashboard logic already handles showing rooms where you're the creator
      // even without a participant entry (see apps/web/app/(app)/dashboard/_components/room-list.tsx:46-47).
      //
      // When users open a room, Zero client-side code will create the participant entry if needed.

      totalCreated += insertedRooms.length
      const progress = Math.round((totalCreated / roomCount) * 100)
      console.log(
        `  ✓ Progress: ${totalCreated}/${roomCount} rooms (${progress}%)`,
      )
    }

    console.log('\n✅ Seeding completed successfully!')
    console.log('\nSummary:')
    console.log(`  - Users: ${createdUsers.length}`)
    console.log(`  - Rooms: ${totalCreated}`)
    console.log(`  - Languages: ${LANGUAGES.length} different types`)

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  }
}

seed()
