import { type JWTPayload, createRemoteJWKSet, jwtVerify } from 'jose'
import { type User, auth } from './index.js'

const APP_URL = (process.env.APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL) as string
const API_URL = (process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL) as string
const BASE_DOMAIN = (process.env.BASE_DOMAIN ||
  process.env.NEXT_PUBLIC_BASE_DOMAIN) as string

export type AuthJWTPayload = JWTPayload & User

export async function validateJwt(token: string) {
  try {
    const JWKS = createRemoteJWKSet(new URL(`${auth.options.baseURL}/jwks`))
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
