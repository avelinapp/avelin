'use client'

import { useEffect } from 'react'
import { useCodeRoom } from '@/providers/code-room-provider'
import { useRoom } from '@/hooks/use-room'
import { useAuth } from '@/providers/auth-provider'
import { LoadingRoom } from './_components/loading-room'
import CodeRoom from './_components/code-room'
import { AnimatePresence } from 'motion/react'

type Params = { slug: string }

export default function Page({ params }: { params: Params }) {
  const { slug } = params
  const { initialize, destroy } = useCodeRoom()
  const room = useRoom(slug)
  const { isPending: isAuthPending, user, session } = useAuth()

  useEffect(() => {
    if (!room.data || isAuthPending) return

    initialize({
      room: room.data,
      user: user,
      session: session,
    })

    return () => destroy()
  }, [initialize, destroy, room.data, isAuthPending, user, session])

  return (
    <AnimatePresence mode='wait'>
      {room.isPending || room.isError ? (
        <LoadingRoom
          key='room-loading'
          isPending={room.isPending}
          error={room.error}
        />
      ) : (
        <CodeRoom key='room-loaded' />
      )}
    </AnimatePresence>
  )
}
