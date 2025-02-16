const { default: zeroConfig } = await import('../../zero-config.json')

import { config } from 'dotenv'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/neon-http'

config({ path: '.env' })

const db = drizzle(process.env.ZERO_UPSTREAM_DB!)

console.log('======= ENV ========')
console.log('ZERO_UPSTREAM_DB:', process.env.ZERO_UPSTREAM_DB)
console.log('====================\n')

console.log('======== ZERO CONFIG ========')
console.log('Schema version:', zeroConfig.zero.schemaVersion)
console.log('=============================\n')

const data = await db.execute(sql`SELECT * FROM zero."schemaVersions"`).then(
  (value) =>
    value.rows[0] as {
      minSupportedVersion: number
      maxSupportedVersion: number
      lock: boolean
    },
)

console.log('======== DATABASE ========')
console.log('Minimum supported version:', data.minSupportedVersion)
console.log('Maximum supported version:', data.maxSupportedVersion)
console.log('==========================\n')

if (data.maxSupportedVersion < zeroConfig.zero.schemaVersion) {
  console.log('Bumping maximum supported version...')
  await db.execute(
    sql`UPDATE zero."schemaVersions" SET "maxSupportedVersion" = ${zeroConfig.zero.schemaVersion}`,
  )
  const newData = (await db
    .execute(sql`SELECT * FROM zero."schemaVersions"`)
    .then((value) => value.rows[0])) as {
    minSupportedVersion: number
    maxSupportedVersion: number
    lock: boolean
  }

  console.log(
    'Maximum supported version bumped to:',
    newData.maxSupportedVersion,
  )
} else {
  console.log('Maximum supported version is up to date.')
}
