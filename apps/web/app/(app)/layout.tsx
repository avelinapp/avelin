import { berkeleyMono, innovatorGrotesk } from '@/lib/fonts'
import type { Metadata } from 'next'
import '../globals.css'
import '@avelin/ui/globals.css'
import CommandMenu from '@/components/command-menu/command-menu'
import AvelinDevToolsToolbar from '@/components/devtools/toolbar'
import OneDollarStatsScript from '@/components/misc/one-dollar-stats'
import { env } from '@/lib/env'
import Providers from '@/providers'
import { Toaster } from '@avelin/ui/sonner'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Avelin',
  description: 'Code together, right now.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerStore = await headers()
  const cookieStore = await cookies()

  const sessionId = cookieStore.get('avelin.session_token')?.value
  const pathname = headerStore.get('X-Avelin-Path') ?? '/'

  if (!sessionId && pathname !== '/login') {
    return redirect(`/login?redirect=${encodeURIComponent(pathname)}`)
  }

  return (
    <html lang="en" suppressHydrationWarning>
      {env.NODE_ENV === 'production' && <OneDollarStatsScript />}
      <body
        className={`${innovatorGrotesk.variable} ${berkeleyMono.variable} font-sans font-settings antialiased bg-color-background h-screen w-screen`}
      >
        <Providers>
          <div className="flex-1 h-full w-full overflow-hidden">{children}</div>
          <AvelinDevToolsToolbar />
          <Toaster richColors />
          <CommandMenu />
        </Providers>
      </body>
    </html>
  )
}
