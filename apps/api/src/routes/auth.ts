import {
  createSession,
  createUserViaGoogle,
  generateGoogleAuthorizationUrl,
  getUserByGoogleId,
  google,
  invalidateSession,
  validateSession,
} from '@avelin/auth'
import { db } from '@avelin/database'
import { type OAuth2Tokens, decodeIdToken } from 'arctic'
import Elysia, { t } from 'elysia'
import type { Response } from 'undici-types'
import { env } from '../env'
import { authMiddleware } from '../middleware/auth'
import { createAuthJwt, verifyAuthJwt } from '../utils/jwt.utils'

export const auth = new Elysia({ prefix: '/auth' })
  .guard({}, (app) =>
    app
      .get(
        '/verify',
        async ({ cookie: { avelin_session_id, avelin_jwt }, error }) => {
          const sessionId = avelin_session_id?.value

          if (!sessionId) {
            avelin_session_id?.remove()
            avelin_jwt?.remove()

            return error(401, {
              isAuthenticated: false,
              error: 'Session not defined in request',
              user: null,
              session: null,
            })
          }

          const auth = await validateSession(sessionId, { db })

          if (!auth) {
            avelin_session_id?.remove()
            avelin_jwt?.remove()

            return error(401, {
              isAuthenticated: false,
              error: 'Invalid session',
              user: null,
              session: null,
            })
          }

          const isValid =
            !!avelin_jwt?.value && (await verifyAuthJwt(avelin_jwt?.value))

          console.log('isValid', isValid)

          if (!isValid) {
            avelin_jwt?.set({
              value: await createAuthJwt({ user: auth.user }),
              path: '/',
              httpOnly: false,
              sameSite: 'lax',
              expires: auth.session.expiresAt,
              domain: `.${env.BASE_DOMAIN}`,
            })
            console.log('avelin_jwt', avelin_jwt?.value)
          }

          return {
            isAuthenticated: true,
            isAnonymous: auth.user.isAnonymous,
            user: auth.user,
            session: auth.session,
          }
        },
      )
      .post('/anonymous', async ({ error }) => {
        return error(500, {
          error: 'This route has been disabled.',
        })
      })
      .get(
        '/google',
        async ({
          query: { redirect: redirectPath },
          cookie: {
            google_oauth_state,
            google_code_verifier,
            post_login_redirect,
          },
          redirect,
          error,
        }) => {
          try {
            const { state, codeVerifier, url } =
              generateGoogleAuthorizationUrl()

            google_oauth_state?.set({
              value: state,
              path: '/',
              httpOnly: true,
              secure: env.NODE_ENV === 'production',
              maxAge: 60 * 10,
              sameSite: 'lax',
            })

            google_code_verifier?.set({
              value: codeVerifier,
              path: '/',
              httpOnly: true,
              secure: env.NODE_ENV === 'production',
              maxAge: 60 * 10,
              sameSite: 'lax',
            })

            post_login_redirect?.set({
              value: redirectPath ?? '/',
              path: '/',
              httpOnly: true,
              secure: env.NODE_ENV === 'production',
              maxAge: 60 * 10, // 10 minutes
              sameSite: 'lax',
            })

            return redirect(url.toString(), 302) as Response
          } catch (err) {
            error(500, {
              error: 'Failed to generate Google authorization URL.',
            })
          }
        },
        { query: t.Optional(t.Object({ redirect: t.String() })) },
      )
      .get(
        '/google/callback',
        async ({
          request,
          cookie: {
            google_oauth_state,
            google_code_verifier,
            post_login_redirect,
            avelin_session_id,
            avelin_jwt,
          },
          error,
          redirect,
        }) => {
          const url = new URL(request.url)
          const code = url.searchParams.get('code')
          const state = url.searchParams.get('state')
          const storedState = google_oauth_state?.value
          const codeVerifier = google_code_verifier?.value
          const redirectUrl = post_login_redirect?.value ?? '/'

          if (!code || !state || !storedState || !codeVerifier) {
            return error(400, {
              error: 'Please restart the process.',
            })
          }

          if (state !== storedState) {
            return error(400, {
              error: 'Invalid state - please restart the process.',
            })
          }

          let tokens: OAuth2Tokens

          try {
            tokens = await google.validateAuthorizationCode(code, codeVerifier)
          } catch {
            return error(400, {
              error: 'Invalid code.',
            })
          }

          const claims = decodeIdToken(tokens.idToken()) as {
            sub: string // Google User ID
            email: string
            name: string
            picture: string
            given_name: string
            family_name: string
          }

          // Check if an existing user exists with this Google account
          const existingUser = await getUserByGoogleId(claims.sub, { db })

          // If the user doesn't exist, do not create their account.
          // TODO: Allow invited users to create an account.
          if (!existingUser) {
            return error(401, {
              error:
                'User is not on the private launch waitlist and/or has not been invited.',
            })
          }

          const session = await createSession(existingUser.id, { db })
          avelin_session_id?.set({
            value: session.id,
            path: '/',
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: session.expiresAt,
            domain: `.${env.BASE_DOMAIN}`,
          })

          avelin_jwt?.set({
            value: await createAuthJwt({ user: existingUser }),
            path: '/',
            httpOnly: false,
            sameSite: 'lax',
            domain: `.${env.BASE_DOMAIN}`,
          })

          post_login_redirect?.set({
            value: '',
            path: '/',
            expires: new Date(0),
          })

          return redirect(env.APP_URL + redirectUrl)
        },
      ),
  )
  .guard({}, (app) =>
    app
      .use(authMiddleware)
      .get('/token/refresh', async ({ user, cookie: { avelin_jwt } }) => {
        const jwt = await createAuthJwt({ user })

        avelin_jwt?.set({
          value: jwt,
          path: '/',
          httpOnly: false,
          sameSite: 'lax',
          domain: `.${env.BASE_DOMAIN}`,
        })

        return { token: jwt }
      })
      .post(
        '/logout',
        async ({ session, cookie: { avelin_session_id, avelin_jwt } }) => {
          await invalidateSession(session.id, { db })

          avelin_session_id?.set({
            value: '',
            path: '/',
            expires: new Date(0),
            domain: `.${env.BASE_DOMAIN}`,
          })

          avelin_jwt?.set({
            value: '',
            path: '/',
            expires: new Date(0),
            domain: `.${env.BASE_DOMAIN}`,
          })

          return { message: 'Logged out successfully.' }
        },
      ),
  )
