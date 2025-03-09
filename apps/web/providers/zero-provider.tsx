'use client'

import { getZeroClient } from '@/lib/zero'
import type { AuthData } from '@avelin/zero'
import { ZeroProvider as ZeroProviderPrimitive } from '@rocicorp/zero/react'
import { decodeJwt } from 'jose/jwt/decode'
import ViewProvider from './view-provider'

export default function ZeroProvider({
  jwt,
  children,
}: {
  jwt: string | undefined
  children: React.ReactNode
}) {
  const payload = jwt ? (decodeJwt(jwt) as AuthData) : undefined
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
