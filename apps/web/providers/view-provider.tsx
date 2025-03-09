'use client'

import { inArray } from '@/lib/utils'
import { LogoAvelin } from '@avelin/icons'
import { AnimatePresence, motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { create, useStore } from 'zustand'

type ViewState = {
  ready: boolean
  isSimulation: boolean
}

type ViewActions = {
  setReady: (value: boolean) => void
  setIsSimulation: (value: boolean) => void
}

type ViewStore = ViewState & ViewActions

export const viewStore = create<ViewStore>((set) => ({
  ready: false,
  isSimulation: false,
  setReady: (value) => set({ ready: value }),
  setIsSimulation: (value) => set({ isSimulation: value }),
}))

export const useView = () => useStore(viewStore, (state) => state)

type Timing =
  | { start: undefined; end: undefined }
  | { start: number; end: undefined }
  | { start: number; end: number }

export default function ViewProvider({
  children,
}: { children: React.ReactNode }) {
  const { ready, setReady, isSimulation } = useView()
  const [showFallback, setShowFallback] = useState(false)
  const [timing, setTiming] = useState<Timing>({
    start: undefined,
    end: undefined,
  })
  const pathname = usePathname()

  useEffect(() => {
    setTiming((prev) => ({ ...prev, start: performance.now() }))
  }, [])

  useEffect(() => {
    if (ready && timing.end === undefined) {
      const end = performance.now()
      // @ts-ignore
      setTiming((prev) => ({ ...prev, end }))

      console.log('[VIEW PROVIDER] took', end - timing.start!, 'ms')
    }
  }, [ready, timing.end])

  useEffect(() => {
    if (
      pathname.startsWith('/rooms/') ||
      inArray(pathname, ['/', '/login', '/signup'])
    ) {
      setReady(true)
    }
  }, [pathname, setReady])

  useEffect(() => {
    let interval: Timer
    if (!ready || isSimulation) {
      interval = setTimeout(() => {
        if (!ready || isSimulation) {
          console.log('[VIEW PROVIDER] Fallback')
          setShowFallback(true)
        }
      }, 100)
    }

    if (ready && !isSimulation && showFallback) {
      console.log('[VIEW PROVIDER] Removing fallback', ready)
      setShowFallback(false)
    }

    return () => {
      clearTimeout(interval)
    }
  }, [ready, isSimulation])

  useEffect(() => {
    console.log('[VIEW PROVIDER] ready', ready)
  }, [ready])

  return (
    <AnimatePresence mode="wait" initial={false}>
      {showFallback && (
        <motion.div
          key="loading"
          className="fixed top-0 left-0 h-screen w-screen flex flex-col items-center justify-center z-50 gap-4"
          initial={{ opacity: 0, filter: 'blur(2px)', scale: 0.95 }}
          animate={{
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1,
            // This delay is to prevent flashing the loading screen when the room loads quickly
            // Ideally, loading states should be avoided for fast operations.
            transition: { delay: 0.5 },
          }}
          exit={{ opacity: 0, filter: 'blur(2px)', scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <LogoAvelin className="size-16 animate-pulse" />
          <span className="!tracking-normal font-medium">
            Loading your workspace...
          </span>
        </motion.div>
      )}
      <motion.div
        key="loaded"
        className="flex-1 flex flex-col h-full w-full"
        initial={{ opacity: 0, filter: 'blur(2px)', scale: 0.98 }}
        animate={{
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1,
          // This delay is to prevent flashing the loading screen when the room loads quickly
          // Ideally, loading states should be avoided for fast operations.
          transition: { delay: 0.1, duration: 0.3 },
        }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
        style={{ visibility: ready && !isSimulation ? 'visible' : 'hidden' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
