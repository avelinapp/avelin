'use client'

import dynamic from 'next/dynamic'
const ZeroProvider = dynamic(() => import('./zero-provider'), { ssr: false })

export default function ZeroRootProvider({
  children,
}: { children: React.ReactNode }) {
  return <ZeroProvider>{children}</ZeroProvider>
}
