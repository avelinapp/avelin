'use client'

import { getZeroClient } from '@/lib/zero'
import type { AuthJWT } from '@avelin/zero'
import { ZeroProvider as ZeroProviderPrimitive } from '@rocicorp/zero/react'
import { decodeJwt } from 'jose/jwt/decode'
import Cookies from 'js-cookie'
import { useAuth } from './auth-provider'

export default function ZeroProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { isPending, isAuthenticated } = useAuth()

  if (isPending || !isAuthenticated) {
    return null
  }

  const jwt = Cookies.get('avelin_jwt')
  const payload = jwt ? (decodeJwt(jwt) as AuthJWT) : undefined

  const z = getZeroClient({ jwt, payload })

  return <ZeroProviderPrimitive zero={z}>{children}</ZeroProviderPrimitive>
}
