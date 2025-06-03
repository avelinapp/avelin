'use client'

import { getZeroClient } from '@/lib/zero'
import type { AuthData } from '@avelin/zero'
import { ZeroProvider as ZeroProviderPrimitive } from '@rocicorp/zero/react'
import { decodeJwt } from 'jose/jwt/decode'
import Cookies from 'js-cookie'
import { usePathname } from 'next/navigation'
import { useAuth } from './auth-provider'
import ViewProvider from './view-provider'

export default function ZeroProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname.startsWith('/s/')) {
    return <>{children}</>
  }

  const { refreshJwt } = useAuth()
  const jwt = Cookies.get('avelin.session_jwt')
  const payload = jwt ? (decodeJwt(jwt) as AuthData) : undefined

  const z = getZeroClient({ jwt, payload, refreshJwt })

  z.query.rooms
    .where('deletedAt', 'IS', null)
    .related('roomParticipants')
    .preload()

  return (
    <ViewProvider>
      <ZeroProviderPrimitive zero={z}>{children}</ZeroProviderPrimitive>
    </ViewProvider>
  )
}
