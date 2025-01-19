import { validateSession } from '@avelin/auth'
import { db } from '@avelin/database'
import Elysia from 'elysia'

export const authMiddleware = new Elysia().derive(
  { as: 'scoped' },
  async ({ cookie: { avelin_session_id }, error }) => {
    // TODO: CSRF CHECK
    // https://gist.github.com/Blankeos/38167c13bea013ef54065832a7cd32da

    if (!avelin_session_id) {
      return error(401, {
        error: 'Session cookie not found',
      })
    }

    const sessionId = avelin_session_id.value

    console.log('[authMiddleware] Reading session cookie:', sessionId)

    if (!sessionId) {
      return error(401, {
        error: 'Session cookie empty',
      })
    }

    const auth = await validateSession(sessionId, { db })

    if (!auth) {
      // Invalid session
      // Create blank session cookie
      avelin_session_id.set({
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0),
        sameSite: 'lax',
      })

      return error(401, {
        error: 'Invalid session ID',
      })
    }

    console.log('[authMiddleware] Session is valid')

    return { user: auth.user, session: auth.session }
  },
)
