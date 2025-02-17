'use client'

import { readyAtom } from '@/lib/atoms'
import { useAtom } from 'jotai'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function ViewProvider({
  children,
}: { children: React.ReactNode }) {
  const [ready, setReady] = useAtom(readyAtom, {})
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/') {
      setReady(true)
    }
  }, [pathname, setReady])

  useEffect(() => {
    console.log('[VIEW PROVIDER] ready', ready)
  }, [ready])

  return (
    <div
      className="flex-1 flex flex-col h-full w-full"
      style={{ visibility: ready ? 'visible' : 'hidden' }}
    >
      {children}
    </div>
  )
}
