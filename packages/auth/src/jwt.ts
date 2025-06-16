import { createRemoteJWKSet, type JWTPayload, jwtVerify } from 'jose'
import type { User } from './index.js'

const API_URL = (process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL) as string

export type AuthJWTPayload = JWTPayload & User

export async function validateJwt(token: string, jwksUrl?: string) {
  try {
    const JWKS = createRemoteJWKSet(new URL(jwksUrl || `${API_URL}/auth/jwks`))
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: API_URL,
      audience: API_URL,
    })
    return payload as AuthJWTPayload
  } catch (error) {
    console.error('Token validation failed:', error)
    throw error
  }
}
