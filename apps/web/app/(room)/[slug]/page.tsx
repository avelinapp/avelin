'use client'

import { useEffect } from 'react'
import { useCodeRoom } from '@/providers/code-room-provider'
import { useRoom } from '@/hooks/use-room'
import { EditorToolbar } from '@/components/editor/editor-toolbar'
import dynamic from 'next/dynamic'
import { useAuth } from '@/providers/auth-provider'
import { LoadingRoom } from './_components/loading-room'
const EditorTextArea = dynamic(
  () => import('@/components/editor/editor-text-area'),
  { ssr: false },
)

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
      user,
      session,
    })

    return () => destroy()
  }, [initialize, destroy, room.data, isAuthPending, user, session])

  if (room.isPending || room.isError)
    return (
      <LoadingRoom
        isPending={room.isPending}
        error={room.error}
      />
    )

  return (
    <div className='flex flex-col h-full w-full'>
      <EditorToolbar />
      <EditorTextArea className='flex-1' />
    </div>
  )
}
