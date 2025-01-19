import { NeonDatabase } from '@avelin/database'
import { generateCodeVerifier, generateState, Google } from 'arctic'

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.API_URL}/auth/google/callback`,
)

export function generateGoogleAuthorizationUrl({ db }: { db: NeonDatabase }) {
  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const url = google.createAuthorizationURL(state, codeVerifier, [
    'openid',
    'profile',
    'email',
  ])

  return { state, codeVerifier, url }
}
