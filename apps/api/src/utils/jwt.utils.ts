import type { User } from '@avelin/database'
import type { AuthJWT } from '@avelin/zero'
import { SignJWT } from 'jose/jwt/sign'
import { env } from '../env'

export const createAuthJwt = async ({ user }: { user: User }) => {
  const payload = {
    sub: user.id,
    iat: Math.floor(Date.now() / 1000),
    name: user.name,
    picture: user.picture,
    email: user.email,
    isAnonymous: user.isAnonymous,
  } satisfies AuthJWT

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(env.AUTH_JWT_SECRET))

  return jwt
}
