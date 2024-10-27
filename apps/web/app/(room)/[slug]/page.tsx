'use client'

import { use, useEffect } from 'react'
import { useCodeRoom } from '@/providers/code-room-provider'
import Editor from '@/components/editor'
import { useRoom } from '@/hooks/use-room'

type Params = Promise<{ slug: string }>

export default function Page({ params }: { params: Params }) {
  const { slug } = use(params)
  const { initialize, destroy } = useCodeRoom()
  const { data: room, error, isPending, isError } = useRoom(slug)

  useEffect(() => {
    if (!room) return

    initialize(room)

    return () => destroy()
  }, [initialize, destroy, room])

  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>

  return (
    <div>
      <Editor />
    </div>
  )
}
