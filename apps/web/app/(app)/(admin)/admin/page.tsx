'use client'

import { WaitlistEntriesTable } from '@/app/(app)/(admin)/admin/_/waitlist-entries-table'
import { useZero } from '@/lib/zero'
import { useView } from '@/providers/view-provider'
import { useQuery } from '@rocicorp/zero/react'
import { useEffect } from 'react'

export default function Page() {
  const { setReady } = useView()

  const z = useZero()
  const q = z.query.waitlistEntries
  const [waitlistEntries, { type: status }] = useQuery(q, { ttl: '1d' })

  useEffect(() => {
    if (waitlistEntries.length > 0 || status === 'complete') {
      setReady(true)
    }
  }, [setReady, waitlistEntries, status])

  return (
    <div className="flex flex-col flex-1 gap-12 pt-8">
      <h1 className="text-4xl font-[550]">Admin Dashboard</h1>
      <div className="flex-1 h-full w-full">
        <WaitlistEntriesTable data={waitlistEntries} />
      </div>
    </div>
  )
}
