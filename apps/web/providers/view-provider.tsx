'use client'

import { inArray } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { create, useStore } from 'zustand'

type ViewState = {
  ready: boolean
}

type ViewActions = {
  setReady: (value: boolean) => void
}

type ViewStore = ViewState & ViewActions

export const viewStore = create<ViewStore>((set) => ({
  ready: false,
  setReady: (value) => set({ ready: value }),
}))

export const useView = () => useStore(viewStore, (state) => state)

export default function ViewProvider({
  children,
}: { children: React.ReactNode }) {
  const { ready, setReady } = useView()
  const pathname = usePathname()

  useEffect(() => {
    if (
      pathname.startsWith('/rooms/') ||
      inArray(pathname, ['/', '/login', '/signup'])
    ) {
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
