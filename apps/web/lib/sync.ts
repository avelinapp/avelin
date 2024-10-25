import { createSyncClient } from '@avelin/sync/client'

if (!process.env.NEXT_PUBLIC_SYNC_URL) {
  throw new Error('SYNC_URL is not set')
}

export const sync = createSyncClient(process.env.NEXT_PUBLIC_SYNC_URL)
