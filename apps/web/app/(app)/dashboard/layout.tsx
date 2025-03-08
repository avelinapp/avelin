import { auth } from '@avelin/auth'
import type { Metadata } from 'next'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Toolbar from './_components/toolbar'

export const metadata: Metadata = {
  title: 'Dashboard | Avelin',
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()

  const sessionId = cookieStore.get('avelin.session_token')?.value

  if (!sessionId) {
    return redirect(`/login?redirect=${encodeURIComponent('/dashboard')}`)
  }

  const data = await auth.api.getSession({
    headers: await headers(),
  })

  if (!data || data.user.isAnonymous) {
    return redirect(`/login?redirect=${encodeURIComponent('/dashboard')}`)
  }

  return (
    <div className="flex-1 h-full w-full px-4 flex flex-col gap-8">
      <Toolbar />
      <div className="flex-1 h-full w-full max-w-screen-2xl mx-auto pt-4 flex flex-col gap-8">
        {children}
      </div>
    </div>
  )
}
