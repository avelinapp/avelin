import { type AuthJWT, type ZeroSchema, schema } from '@avelin/zero'
import { Zero } from '@rocicorp/zero'
import { api } from './api'
import { env } from './env'

let client: Zero<ZeroSchema> | undefined

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
      userID: payload?.sub ?? 'anon',
      schema: schema,
      server: env.NEXT_PUBLIC_ZERO_URL,
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
  }

  return client
}
