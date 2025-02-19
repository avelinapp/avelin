import { type AuthJWT, type ZeroSchema, schema } from '@avelin/zero'
import { Zero } from '@rocicorp/zero'
import { createUseZero } from '@rocicorp/zero/react'
import type { Metadata } from 'next'
import { api } from './api'
import { env } from './env'

export const useZero = createUseZero<ZeroSchema>()

let client: Zero<ZeroSchema> | undefined

export const metadata: Metadata = {
  title: 'Zero | Avelin',
}

export function getZeroClient({
  jwt,
  payload,
}: { jwt?: string; payload?: AuthJWT }) {
  if (!client) {
    console.log(
      typeof window !== 'undefined' ? '[CLIENT]' : '[SERVER]',
      'creating zero client',
    )

    client = new Zero({
      logLevel: 'debug',
      userID: payload?.sub ?? 'anon',
      schema: schema,
      server: env.NEXT_PUBLIC_ZERO_URL,
      kvStore: 'idb',
      auth: async (error?: 'invalid-token') => {
        if (!jwt || error === 'invalid-token') {
          console.log('invalid token, refreshing...')
          const res = await api.auth.token.refresh.get()

          if (!res.error) {
            console.log('refreshed token')
            console.log('res.data.token', res.data.token)
            return res.data.token
          }
        }

        return jwt
      },
    })

    client.query.rooms
      .where('deletedAt', 'IS', null)
      .related('roomParticipants')
      .preload()
  }

  return client
}

export const now = () => Date.now()
