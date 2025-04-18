'use client'

import { useZero } from '@/lib/zero'
import { useAuth } from '@/providers/auth-provider'
import { useCodeRoomStore } from '@/providers/code-room-provider'
import { useView } from '@/providers/view-provider'
import { useQuery } from '@rocicorp/zero/react'
import { AnimatePresence } from 'motion/react'
import { use, useEffect, useMemo } from 'react'
import CodeRoom from './_components/code-room'
import { LoadingRoom } from './_components/code-room-loading'

type Params = Promise<{ slug: string }>

export default function Page({ params }: { params: Params }) {
  const { slug } = use(params)
  const [initialize, destroy] = useCodeRoomStore((state) => [
    state.initialize,
    state.destroy,
  ])
  const z = useZero()
  const q = z.query.rooms.where('slug', 'IS', slug).one()
  const [room, { type: status }] = useQuery(q)
  const { isPending: isAuthPending, user, session } = useAuth()
  const { ready, setReady } = useView()

  useEffect(() => {
    if (!ready && (!!room || status === 'complete')) {
      setReady(true)
    }
  }, [status, room, ready, setReady])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (status === 'unknown' || !room || isAuthPending) return

    initialize({
      room,
      user,
      session,
    })

    return () => destroy()
  }, [initialize, destroy, status, isAuthPending, user, session])

  const content = useMemo(
    () =>
      room ? (
        <CodeRoom key="room-loaded" />
      ) : (
        <LoadingRoom key="room-loading" />
      ),
    [room],
  )

  return <AnimatePresence mode="wait">{content}</AnimatePresence>
}
