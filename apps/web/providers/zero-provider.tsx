'use client'

import { getZeroClient } from '@/lib/zero'
import type { AuthJWT } from '@avelin/zero'
import { ZeroProvider as ZeroProviderPrimitive } from '@rocicorp/zero/react'
import { decodeJwt } from 'jose/jwt/decode'
import Cookies from 'js-cookie'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import ViewProvider from './view-provider'

export default function ZeroProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const FF_zero = useFeatureFlagEnabled('zero')

  if (!FF_zero) {
    return <div className="flex-1 flex flex-col h-full w-full">{children}</div>
  }

  const jwt = Cookies.get('avelin_jwt')
  const payload = jwt ? (decodeJwt(jwt) as AuthJWT) : undefined

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
