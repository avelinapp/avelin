import PostHogClient from '@/lib/posthog'
import { validateSession } from '@avelin/auth'
import { db } from '@avelin/database'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Dashboard | Avelin',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const sessionId = cookies().get('avelin_session_id')?.value

  if (!sessionId) {
    return <>Unauthenticated</>
  }

  const auth = await validateSession(sessionId, { db: db })

  if (!auth) {
    return <>Unauthenticated</>
  }

  const posthog = PostHogClient()
  const flags = await posthog.getAllFlags(sessionId)

  console.log('PostHog flags:', flags)

  return <>{children}</>
}
