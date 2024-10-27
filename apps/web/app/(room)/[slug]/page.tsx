'use client'

import { use, useEffect } from 'react'
import { useCodeRoom } from '@/providers/code-room-provider'
import { useRoom } from '@/hooks/use-room'
import LazySuspense from '@avelin/ui/suspense'
import { useAuth } from '@/providers/auth-provider'

type Params = Promise<{ slug: string }>

export default function Page({ params }: { params: Params }) {
  const { slug } = use(params)
  const { session } = useAuth()
  const { initialize, destroy } = useCodeRoom()
  const { data: room, isPending, isError } = useRoom(slug)

  useEffect(() => {
    if (!room || !session) return

    initialize({
      room,
      session,
    })

    return () => destroy()
  }, [initialize, destroy, room, session])

  if (isPending || isError) return <div />

  return (
    <div>
      <LazySuspense
        component={() => import('@/components/editor/editor')}
        delay={500}
      />
    </div>
  )
}
