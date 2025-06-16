import { type AuthData, schema, type ZeroSchema } from '@avelin/zero'
import { Zero } from '@rocicorp/zero'
import { createUseZero } from '@rocicorp/zero/react'
import type { Metadata } from 'next'
import { env } from './env'

export const useZero = createUseZero<ZeroSchema>()

export let client: Zero<ZeroSchema> | undefined

export const metadata: Metadata = {
  title: 'Zero | Avelin',
}

export function getZeroClient({
  jwt,
  payload,
  refreshJwt,
}: {
  jwt?: string
  payload?: AuthData
  refreshJwt: () => Promise<string>
}) {
  if (!client) {
    console.log(
      typeof window !== 'undefined' ? '[CLIENT]' : '[SERVER]',
      'creating zero client',
    )

    console.log('[getZeroClient] jwt', jwt)
    console.log('[getZeroClient] payload', payload)

    client = new Zero({
      logLevel: 'debug',
      userID: payload?.sub ?? 'anon',
      schema: schema,
      server: env.NEXT_PUBLIC_ZERO_URL,
      kvStore: 'idb',
      auth: async (error?: 'invalid-token') => {
        // Refresh JWT if missing or invalid
        if (!jwt || error === 'invalid-token') {
          console.log('[Zero] Auth - invalid token, refreshing...')
          return await refreshJwt()
        }

        console.log('[Zero] Auth - using existing token:', jwt)

        return jwt
      },
    })

    client.query.rooms
      .where('deletedAt', 'IS', null)
      .related('roomParticipants', (q) => q.related('user'))
      .preload({ ttl: 'forever' })
  }

  return client
}

export function clearZeroClient() {
  client?.close()
  client = undefined
}

export const now = () => Date.now()
