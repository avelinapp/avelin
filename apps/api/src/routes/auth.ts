import { Hono } from 'hono'
import {
  createSession,
  createUserViaGoogle,
  generateGoogleAuthorizationUrl,
  getUserByGoogleId,
  google,
  invalidateSession,
  validateSession,
} from '@avelin/auth'
import { getCookie, setCookie } from 'hono/cookie'
import { decodeIdToken, OAuth2Tokens } from 'arctic'
import superjson from 'superjson'

export const authApp = new Hono()
  .get('/google', async (c) => {
    const redirect = c.req.query('redirect') ?? '/'

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

    setCookie(c, 'post_login_redirect', redirect, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 10, // 10 minutes
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
    const redirectUrl = getCookie(c, 'post_login_redirect') ?? '/'

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
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        httpOnly: true,
        expires: session.expiresAt,
      })

      // Clear the redirect cookie after use
      setCookie(c, 'post_login_redirect', '', {
        path: '/',
        expires: new Date(0),
      })

      return c.redirect(process.env.APP_URL + redirectUrl)
    }

    // If the user doesn't exist, create their account
    const newUser = await createUserViaGoogle({
      ...claims,
      googleId: claims.sub,
    })

    const session = await createSession(newUser.id)

    setCookie(c, 'avelin_session_id', session.id, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
      expires: session.expiresAt,
    })

    // Clear the redirect cookie after use
    setCookie(c, 'post_login_redirect', '', {
      path: '/',
      expires: new Date(0),
    })

    return c.redirect(process.env.APP_URL + redirectUrl)
  })
  .get('/verify', async (c) => {
    const sessionId = getCookie(c, 'avelin_session_id')

    if (!sessionId) {
      return c.text(
        superjson.stringify({
          isAuthenticated: false,
          error: 'Session not defined in request',
          user: null,
          session: null,
        }),
        400,
      )
    }

    const auth = await validateSession(sessionId)

    if (!auth) {
      return c.text(
        superjson.stringify({
          isAuthenticated: false,
          error: 'Invalid session',
          user: null,
          session: null,
        }),
        404,
      )
    }

    return c.text(
      superjson.stringify({
        isAuthenticated: true,
        user: auth.user,
        session: auth.session,
      }),
      200,
    )
  })
  .post('/logout', async (c) => {
    const sessionId = getCookie(c, 'avelin_session_id')

    if (!sessionId) {
      return c.json({ error: 'Session not defined in request.' }, 400)
    }

    const session = await validateSession(sessionId)

    if (!session) {
      return c.json({ error: 'Session not found.' }, 400)
    }

    await invalidateSession(sessionId)
    setCookie(c, 'avelin_session_id', '', {
      path: '/',
      expires: new Date(0),
    })

    return c.json({ message: 'Logged out successfully.' }, 200)
  })
