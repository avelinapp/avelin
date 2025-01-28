'use client'

import { useFeatureFlagEnabled } from 'posthog-js/react'

export default function Page() {
  const FF_dashboard = useFeatureFlagEnabled('dashboard')

  return (
    <div>
      <h1>Dashboard</h1>
      {FF_dashboard && <h2>Feature flag enabled</h2>}
    </div>
  )
}
