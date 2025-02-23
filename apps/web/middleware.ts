import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set('X-Avelin-Path', request.nextUrl.pathname)

  return response
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/:path*',
}
