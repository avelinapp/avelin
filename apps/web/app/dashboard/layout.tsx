'use client'

import { getFlags } from '@/lib/posthog'
import { dashboardComingSoonToast } from '@/lib/toasts'
import { validateSession } from '@avelin/auth/cached'
import { db } from '@avelin/database'
import type { Metadata } from 'next'
// import { cookies } from 'next/headers'
import { redirect, useRouter } from 'next/navigation'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useEffect } from 'react'
import Toolbar from './_components/toolbar'

// export const metadata: Metadata = {
//   title: 'Dashboard | Avelin',
// }

const dashboardRedirectUrl = `/login?redirect=${encodeURIComponent('/dashboard')}`

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // const sessionId = (await cookies()).get('avelin_session_id')?.value
  //
  // if (!sessionId) {
  //   return redirect(dashboardRedirectUrl)
  // }
  //
  // const auth = await validateSession(sessionId, { db })
  //
  // if (!auth || auth.user.isAnonymous) {
  //   return redirect(dashboardRedirectUrl)
  // }
  //
  // const flags = await getFlags(auth.user.id)
  //
  // if (!flags.dashboard) {
  //   return redirect('/')
  // }

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
    <div className="flex-1 h-full w-full max-w-screen-lg mx-auto p-4 flex flex-col gap-8">
      <Toolbar />
      {children}
    </div>
  )
}
