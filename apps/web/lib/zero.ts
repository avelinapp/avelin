import { type AuthData, type ZeroSchema, schema } from '@avelin/zero'
import { Zero } from '@rocicorp/zero'
import { createUseZero } from '@rocicorp/zero/react'
import type { Metadata } from 'next'
import { authClient } from './auth'
import { env } from './env'

export const useZero = createUseZero<ZeroSchema>()

export let client: Zero<ZeroSchema> | undefined

export const metadata: Metadata = {
  title: 'Zero | Avelin',
}

export function getZeroClient({
  jwt,
  payload,
}: { jwt?: string; payload?: AuthData }) {
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
        if (!jwt || error === 'invalid-token') {
          console.log('invalid token, refreshing...')
          const { data, error } = await authClient.getSession()

          if (error) {
            throw error
          }

          console.log('[Zero] session data:', data)

          const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/token`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${data.session.token}`,
            },
          })

          if (!res.ok) {
            throw new Error('Failed to refresh token')
          }

          const { jwt } = (await res.json()) as { jwt: string }

          return jwt
        }

        return jwt
      },
    })

    client.query.rooms
      .where('deletedAt', 'IS', null)
      .related('roomParticipants', (q) => q.related('user'))
      .preload()
  }

  return client
}

export const now = () => Date.now()
