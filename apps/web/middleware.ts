import { authCookies, type Session, type User } from '@avelin/auth'
import { betterFetch } from '@better-fetch/fetch'
import { decodeJwt } from 'jose'
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { env } from './lib/env'
import { inArray } from './lib/utils'

export async function middleware(request: NextRequest) {
  console.time('middleware')

  const pathname = request.nextUrl.pathname

  // Set current path in header
  const response = NextResponse.next()
  response.headers.set('X-Avelin-Path', pathname)

  console.log('\n------', pathname, '------')

  if (inArray(pathname, ['/', '/home', '/login'])) {
    console.timeEnd('middleware')
    return response
  }

  // Get session token from cookie
  let sessionToken = request.cookies.get(authCookies.sessionToken.name)?.value
  if (sessionToken?.includes('.')) {
    sessionToken = sessionToken.split('.')[0]
  }
  let sessionJwt = request.cookies.get('avelin.session_jwt')?.value
  if (sessionJwt === 'undefined') sessionJwt = undefined

  console.log('Session token:', sessionToken)
  console.log('Session JWT:', sessionJwt)

  // If session token and JWT are present, continue
  if (sessionToken && sessionJwt) {
    console.log('session token and JWT present, continuing')
    console.timeEnd('middleware')
    return response
  }

  // If session token is present but JWT is missing, set it and continue
  if (sessionToken && !sessionJwt) {
    console.log('session token present but JWT missing, setting JWT')
    const { data: jwt, error } = await betterFetch<{ token: string }>(
      `${env.NEXT_PUBLIC_API_URL}/auth/token`,
      {
        method: 'GET',
        auth: {
          type: 'Bearer',
          token: sessionToken,
        },
      },
    )

    if (error || !jwt) {
      console.log('failed to create/set JWT, returning to /login')
      console.error('error:', error)

      response.cookies.delete(authCookies.sessionToken.name)
      response.cookies.delete(authCookies.sessionData.name)
      response.cookies.delete('avelin.session_jwt')

      console.timeEnd('middleware')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const jwtExpiration = decodeJwt(jwt.token).exp ?? 0
    const jwtExpirationDate = new Date(jwtExpiration * 1000)

    response.cookies.set('avelin.session_jwt', jwt.token, {
      path: '/',
      httpOnly: false,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: `.${env.NEXT_PUBLIC_BASE_DOMAIN}`,
      expires: jwtExpirationDate,
    })

    console.timeEnd('middleware')
    return response
  }

  // User is not authenticated

  // Create anonymous session if user is not on landing page or login
  if (!inArray(pathname, ['/', '/login']) && !sessionToken) {
    console.log('no session, creating anonymous session')

    const { data: session, error: sessionError } = await betterFetch<{
      token: Session['token']
      user: User
    }>(`${env.NEXT_PUBLIC_API_URL}/auth/sign-in/anonymous`, {
      method: 'POST',
      onResponse: (ctx) => {
        const cookiesToSet = new ResponseCookies(ctx.response.headers).getAll()

        for (const cookie of cookiesToSet) {
          response.cookies.set(cookie)
        }
      },
    })

    if (sessionError || !session) {
      console.error('Failed to create anonymous session')
      console.error('Error:', sessionError)
      console.timeEnd('middleware')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const { data: jwt, error } = await betterFetch<{ token: string }>(
      `${env.NEXT_PUBLIC_API_URL}/auth/token`,
      {
        method: 'GET',
        auth: {
          type: 'Bearer',
          token: session.token,
        },
      },
    )

    if (error || !jwt) {
      console.log('Failed to create/set JWT, returning to /login')
      console.error('Error:', error)

      response.cookies.delete(authCookies.sessionToken.name)
      response.cookies.delete(authCookies.sessionData.name)
      response.cookies.delete('avelin.session_jwt')

      console.timeEnd('middleware')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    console.log('JWT payload:', decodeJwt(jwt.token))

    const jwtExpiration = decodeJwt(jwt.token).exp ?? 0
    const jwtExpirationDate = new Date(jwtExpiration * 1000)

    response.cookies.set('avelin.session_jwt', jwt.token, {
      path: '/',
      httpOnly: false,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: `.${env.NEXT_PUBLIC_BASE_DOMAIN}`,
      expires: jwtExpirationDate,
    })
  }

  console.timeEnd('middleware')
  console.log('-------------------\n')

  return response
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|ingest).*)',
}
