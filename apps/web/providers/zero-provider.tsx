'use client'

import { getZeroClient } from '@/lib/zero'
import { ZeroProvider as ZeroProviderPrimitive } from '@rocicorp/zero/react'
import { useEffect } from 'react'

export default function ZeroProvider({
  jwt,
  setMounted,
  children,
}: {
  jwt?: string
  setMounted: (value: boolean) => void
  children: React.ReactNode
}) {
  useEffect(() => {
    setMounted(true)
  }, [setMounted])
  const z = getZeroClient({ jwt })

  return <ZeroProviderPrimitive zero={z}>{children}</ZeroProviderPrimitive>
}
