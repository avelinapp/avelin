'use client'

import { useRoom } from '@/hooks/use-room'
import { useZero } from '@/lib/zero'
import { useAuth } from '@/providers/auth-provider'
import { useCodeRoom } from '@/providers/code-room-provider'
import { useView } from '@/providers/view-provider'
import { useQuery } from '@rocicorp/zero/react'
import { AnimatePresence } from 'motion/react'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { use, useEffect, useMemo } from 'react'
import CodeRoom from './_components/code-room'
import { LoadingRoom } from './_components/loading-room'

type Params = Promise<{ slug: string }>

export default function Page({ params }: { params: Params }) {
  const FF_zero = useFeatureFlagEnabled('zero')

  const { slug } = use(params)

  return FF_zero ? <Page.Zero slug={slug} /> : <Page.Network slug={slug} />
}

Page.Network = ({ slug }: { slug: string }) => {
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
    <AnimatePresence mode="wait">
      {room.isPending || room.isError ? (
        <LoadingRoom
          key="room-loading"
          isPending={room.isPending}
          error={room.error}
        />
      ) : (
        <CodeRoom key="room-loaded" />
      )}
    </AnimatePresence>
  )
}

Page.Zero = ({ slug }: { slug: string }) => {
  const { initialize, destroy } = useCodeRoom()
  const z = useZero()
  const q = z.query.rooms.where('slug', 'IS', slug)
  const [rooms, { type: status }] = useQuery(q)
  const room = useMemo(() => rooms[0], [rooms])
  const { isPending: isAuthPending, user, session } = useAuth()
  const { ready, setReady } = useView()

  useEffect(() => {
    if (!ready && (!!room || status === 'complete')) {
      setReady(true)
    }
  }, [status, room, ready, setReady])

  useEffect(() => {
    if (status === 'unknown' || isAuthPending) return

    initialize({
      // @ts-ignore
      room: room,
      user: user,
      session: session,
    })

    return () => destroy()
  }, [initialize, destroy, status, isAuthPending, user, session])

  return <CodeRoom />
}
