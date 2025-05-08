import fs from 'node:fs/promises'
import path from 'node:path'
import { type NeonDatabase, db, eq, schema } from '@avelin/database'
import { env } from './env.js'
import { fileExists } from './utils.js'

export async function cleanupActiveConnections(
  serverId: string,
  db: NeonDatabase,
) {
  await db
    .update(schema.roomConnections)
    .set({ disconnectedAt: new Date(), isActive: false })
    .where(eq(schema.roomConnections.serverId, serverId))
}
// This is used because hot reload ends up breaking the regular cleanup process
export async function devBootstrap(serverId: string, db: NeonDatabase) {
  if (env.NODE_ENV !== 'production') {
    // Check if the server ID file exists
    const exists = await fileExists('serverId.txt')
    if (exists) {
      // Read the server ID from the file
      const serverId = await fs.readFile(
        path.join(process.cwd(), 'serverId.txt'),
        'utf8',
      )
      await cleanupActiveConnections(serverId, db)
    }

    // Write the new server ID to the file, overwriting the previous one
    await fs.writeFile(
      path.join(process.cwd(), 'serverId.txt'),
      serverId,
      'utf8',
    )
  }
}
