'use client'

import { languages } from '@/lib/constants'
import { toasts } from '@/lib/toasts'
import { useZero } from '@/lib/zero'
import { useAuth } from '@/providers/auth-provider'
import { useCodeRoomStore } from '@/providers/code-room-provider'
import { useView } from '@/providers/view-provider'
import { toast } from '@avelin/ui/sonner'
import { useQuery } from '@rocicorp/zero/react'
import { use, useEffect, useMemo } from 'react'
import CodeRoom from './_components/code-room'
import { LoadingRoom } from './_components/code-room-loading'

type Params = Promise<{ slug: string }>

export default function Page({ params }: { params: Params }) {
  const { slug } = use(params)
  const [initialize, destroy, setEditorLanguage] = useCodeRoomStore((state) => [
    state.initialize,
    state.destroy,
    state.setEditorLanguage,
  ])
  const z = useZero()
  const q = z.query.rooms.where('slug', 'IS', slug).one()
  const [room, { type: status }] = useQuery(q)
  const { isPending: isAuthPending, user, session } = useAuth()
  const { ready, setReady } = useView()

  useEffect(() => {
    const cleanup = q.materialize().addListener((data, result) => {
      if (result !== 'complete') return
      console.log(
        '**** [Room] Data changed:',
        JSON.stringify({ data, result }, null, '\t'),
      )

      if (!data?.editorLanguage) return
      const newLanguage = data.editorLanguage
      const languageDetails = languages.find((l) => l.value === newLanguage)
      toast.info(
        `Editor language set to ${languageDetails?.name ?? newLanguage}.`,
      )

      setEditorLanguage(data.editorLanguage, true)
    })

    return () => cleanup()
  }, [])

  useEffect(() => {
    if (!ready && (!!room || status === 'complete')) {
      setReady(true)
    }
  }, [status, room, ready, setReady])

  useEffect(() => {
    if (status === 'unknown' || !room || isAuthPending) return

    initialize({
      room,
      user,
      session,
    })

    return () => destroy()
  }, [initialize, destroy, status, isAuthPending, user, session])

  return room ? <CodeRoom /> : <LoadingRoom />
}
