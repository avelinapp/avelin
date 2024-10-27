import { Hono } from 'hono'
import {
  createSession,
  createUserViaGoogle,
  generateGoogleAuthorizationUrl,
  getUserByGoogleId,
  google,
} from '@avelin/auth'
import { getCookie, setCookie } from 'hono/cookie'
import { decodeIdToken, OAuth2Tokens } from 'arctic'

export const authApp = new Hono()
  .get('/google', async (c) => {
    const { state, codeVerifier, url } = generateGoogleAuthorizationUrl()

    setCookie(c, 'google_oauth_state', state, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 10,
      sameSite: 'lax',
    })

    setCookie(c, 'google_code_verifier', codeVerifier, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 10,
      sameSite: 'lax',
    })

    return c.redirect(url.toString())
  })
  .get('/google/callback', async (c) => {
    const url = new URL(c.req.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const storedState = getCookie(c, 'google_oauth_state')
    const codeVerifier = getCookie(c, 'google_code_verifier')

    if (!code || !state || !storedState || !codeVerifier) {
      return c.json({ error: 'Please restart the process.' }, 400)
    }

    if (state !== storedState) {
      return c.json(
        { error: 'Invalid state - please restart the process.' },
        400,
      )
    }

    let tokens: OAuth2Tokens

    try {
      tokens = await google.validateAuthorizationCode(code, codeVerifier)
    } catch {
      return c.json({ error: 'Invalid code.' }, 400)
    }

    const claims = decodeIdToken(tokens.idToken()) as {
      sub: string // Google User ID
      email: string
      name: string
      picture: string
      given_name: string
      family_name: string
    }

    const existingUser = await getUserByGoogleId(claims.sub)

    // If the user already exists, log them in
    if (existingUser) {
      const session = await createSession(existingUser.id)
      setCookie(c, 'avelin_session_id', session.id, {
        expires: session.expiresAt,
      })

      return c.redirect(process.env.APP_URL ?? '/')
    }

    // If the user doesn't exist, create their account
    const newUser = await createUserViaGoogle({
      ...claims,
      googleId: claims.sub,
    })

    const session = await createSession(newUser.id)

    setCookie(c, 'avelin_session_id', session.id, {
      expires: session.expiresAt,
    })

    return c.redirect(process.env.APP_URL ?? '/')
  })
