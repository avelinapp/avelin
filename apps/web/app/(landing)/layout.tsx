import OneDollarStatsScript from '@/components/misc/one-dollar-stats'
import { env } from '@/lib/env'
import { berkeleyMono, innovatorGrotesk } from '@/lib/fonts'
import type { Metadata } from 'next'
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
  const cookiesStore = await cookies()

  const sessionId = cookiesStore.get('avelin_session_id')?.value

  console.log('landing layout')

  if (sessionId) {
    return redirect('/login')
  }

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      {env.NODE_ENV === 'production' && <OneDollarStatsScript />}
      <body
        className={`${innovatorGrotesk.variable} ${berkeleyMono.variable} font-sans font-settings antialiased h-screen w-screen`}
        style={{
          background:
            'radial-gradient(circle, rgba(10,10,10,1) 20%, rgba(5,5,5,1) 40%, rgba(0,0,0,1) 60%)',
        }}
      >
        {children}
      </body>
    </html>
  )
}
