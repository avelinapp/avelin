'use client'

import { sync } from '@/lib/sync'
import { use, useEffect, useRef, useState } from 'react'

type Params = Promise<{ slug: string }>

export default function Page({ params }: { params: Params }) {
  const { slug } = use(params)
  const [isReady, setIsReady] = useState(false)

  const syncWs = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (isReady) {
      syncWs.current?.send('Hello from client!')
    }
  }, [isReady])

  useEffect(() => {
    if (!slug) {
      return
    }

    const ws = sync.ws.$ws({
      query: { roomSlug: slug },
    })

    ws.onopen = () => {
      setIsReady(true)
      console.log('Avelin Sync - connection established.')
    }
    ws.onclose = () => {
      setIsReady(false)
      console.log('Avelin Sync - connection closed.')
    }
    ws.onmessage = (ev) => {
      console.log(`[SYNC] ${ev.data}`)
    }

    syncWs.current = ws

    return () => {
      ws.close()
    }
  }, [slug])
  return <div>Room</div>
}
