'use client'

import { getZeroClient } from '@/lib/zero'
import type { AuthJWT } from '@avelin/zero'
import { ZeroProvider as ZeroProviderPrimitive } from '@rocicorp/zero/react'
import { useEffect } from 'react'

export default function ZeroProvider({
  jwt,
  payload,
  setMounted,
  children,
}: {
  jwt?: string
  payload?: AuthJWT
  setMounted: (value: boolean) => void
  children: React.ReactNode
}) {
  useEffect(() => {
    setMounted(true)
  }, [setMounted])
  const z = getZeroClient({ jwt, payload })

  return <ZeroProviderPrimitive zero={z}>{children}</ZeroProviderPrimitive>
}
