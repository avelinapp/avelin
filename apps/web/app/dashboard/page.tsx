'use client'

import { dashboardComingSoonToast } from '@/lib/toasts'
import { useRouter } from 'next/navigation'
import { PostHogFeature, useFeatureFlagEnabled } from 'posthog-js/react'
import { useEffect } from 'react'
import Dashboard_v0 from './_components/v0/dashboard'
import Dashboard_v1 from './_components/v1/dashboard'

export default function Page() {
  const router = useRouter()

  const userCanSeeDashboard = useFeatureFlagEnabled('dashboard')

  useEffect(() => {
    if (!userCanSeeDashboard) {
      dashboardComingSoonToast()
      router.push('/')
    }
  }, [userCanSeeDashboard, router])

  if (!userCanSeeDashboard) {
    return null
  }

  return (
    <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
      <PostHogFeature
        className="flex-1 flex flex-col h-full"
        flag="dashboard-ui-refresh"
        match={false}
      >
        <Dashboard_v0 />
      </PostHogFeature>
      <PostHogFeature
        className="flex-1 flex flex-col h-full"
        flag="dashboard-ui-refresh"
        match={true}
      >
        <Dashboard_v1 />
      </PostHogFeature>
    </div>
  )
}
