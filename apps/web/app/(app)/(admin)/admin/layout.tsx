import { authCookies } from '@avelin/auth'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Toolbar from '@/app/(app)/dashboard/_components/toolbar'
import { authClient } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()

  const sessionId = cookieStore.get(authCookies.sessionToken.name)?.value

  if (!sessionId) {
    return redirect(`/login?redirect=${encodeURIComponent('/admin')}`)
  }

  const { data, error } = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })

  console.log('[DashboardLayout] active session:', data)

  if (!data || error || !data.user.isAdminUser) {
    return redirect('/dashboard)')
  }

  return (
    <div className="flex flex-col gap-8 px-4">
      <Toolbar />
      <div className="mx-auto h-full max-w-screen-2xl w-full flex flex-col">
        {children}
      </div>
    </div>
  )
}
