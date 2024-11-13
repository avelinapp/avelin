'use client'

import { useEffect } from 'react'
import { useCodeRoom } from '@/providers/code-room-provider'
import { useRoom } from '@/hooks/use-room'
import { EditorToolbar } from '@/components/editor/editor-toolbar'
import dynamic from 'next/dynamic'
import { useAuth } from '@/providers/auth-provider'
const EditorTextArea = dynamic(
  () => import('@/components/editor/editor-text-area'),
  { ssr: false },
)

type Params = { slug: string }

export default function Page({ params }: { params: Params }) {
  const { slug } = params
  const { initialize, destroy } = useCodeRoom()
  const { data: room } = useRoom(slug)
  const { isPending: isAuthPending, user, session } = useAuth()

  useEffect(() => {
    if (!room || isAuthPending) return

    initialize({
      room,
      user,
      session,
    })

    return () => destroy()
  }, [initialize, destroy, room, isAuthPending, user, session])

  return (
    <div className='flex flex-col h-full w-full'>
      <EditorToolbar />
      <EditorTextArea className='flex-1' />
    </div>
  )
}
