'use client'

import { useView } from '@/providers/view-provider'
import { useEffect } from 'react'

export default function Page() {
  const { setReady } = useView()

  useEffect(() => {
    setReady(true)
  }, [setReady])

  return (
    <div>
      <h1 className="text-4xl font-[550]">Admin Dashboard</h1>
    </div>
  )
}
