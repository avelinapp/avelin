import { type AuthJWT, type ZeroSchema, schema } from '@avelin/zero'
import { Zero } from '@rocicorp/zero'
import { decodeJwt } from 'jose'
import { api } from './api'
import { env } from './env'

let client: Zero<ZeroSchema> | undefined

export function getZeroClient({ jwt }: { jwt?: string }) {
  if (!client) {
    console.log(
      typeof window !== 'undefined' ? '[CLIENT]' : '[SERVER]',
      'creating zero client',
    )

    const payload = jwt ? (decodeJwt(jwt) as AuthJWT) : undefined

    client = new Zero({
      // kvStore: 'mem',
      userID: payload?.sub ?? 'anon',
      schema: schema,
      server: env.NEXT_PUBLIC_ZERO_URL,
      auth: async (error?: 'invalid-token') => {
        if (error === 'invalid-token') {
          const res = await api.auth.token.refresh.get()

          if (!res.error) {
            return res.data.token
          }
        }
        return jwt
      },
    })
  }

  return client
}
