'use client'

import { getZeroClient } from '@/lib/zero'
import type { AuthData } from '@avelin/zero'
import { ZeroProvider as ZeroProviderPrimitive } from '@rocicorp/zero/react'
import { decodeJwt } from 'jose/jwt/decode'
import Cookies from 'js-cookie'
import ViewProvider from './view-provider'

export default function ZeroProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const jwt = Cookies.get('avelin.session_jwt')
  const payload = jwt ? (decodeJwt(jwt) as AuthData) : undefined

  console.log('[ZeroProvider] JWT payload:', payload)

  const z = getZeroClient({ jwt, payload })

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
