'use client'

import { use, useEffect } from 'react'
import { useCodeRoom } from '@/providers/code-room-provider'
import { useRoom } from '@/hooks/use-room'
import LazySuspense from '@avelin/ui/suspense'

type Params = Promise<{ slug: string }>

export default function Page({ params }: { params: Params }) {
  const { slug } = use(params)
  const { initialize, destroy } = useCodeRoom()
  const { data: room, isPending, isError } = useRoom(slug)

  useEffect(() => {
    if (!room) return

    initialize({
      room,
    })

    return () => destroy()
  }, [initialize, destroy, room])

  if (isPending || isError) return <div />

  return (
    <div className='flex flex-col border border-red-500 h-full w-full'>
      <LazySuspense
        component={() => import('@/components/editor/editor-text-area')}
        delay={500}
        containerProps={{
          className: 'flex-1',
        }}
      />
    </div>
  )
}
