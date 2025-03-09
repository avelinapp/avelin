'use client'

import dynamic from 'next/dynamic'
import { memo } from 'react'
const ZeroProvider = dynamic(() => import('./zero-provider'), { ssr: false })

export const ZeroRootProvider = memo(__ZeroRootProvider)

function __ZeroRootProvider({
  jwt,
  children,
}: { jwt: string | undefined; children: React.ReactNode }) {
  return <ZeroProvider jwt={jwt}>{children}</ZeroProvider>
}

export default ZeroRootProvider
