'use client'

import { useZero } from '@/lib/zero'
import { useAuth } from '@/providers/auth-provider'
import { useCodeRoom } from '@/providers/code-room-provider'
import { useView } from '@/providers/view-provider'
import { useQuery } from '@rocicorp/zero/react'
import { use, useEffect, useMemo } from 'react'
import CodeRoom from './_components/code-room'

type Params = Promise<{ slug: string }>

export default function Page({ params }: { params: Params }) {
  const { slug } = use(params)
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
