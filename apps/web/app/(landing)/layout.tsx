import '@avelin/ui/globals.css'
import '../globals.css'
import OneDollarStatsScript from '@/components/misc/one-dollar-stats'
import { env } from '@/lib/env'
import { berkeleyMono, innovatorGrotesk } from '@/lib/fonts'
import { Toaster } from '@avelin/ui/sonner'
import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Avelin',
  description: 'Code together, right now.',
}

export const viewport: Viewport = {
  themeColor: '#000000',
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
        className={`${innovatorGrotesk.variable} ${berkeleyMono.variable} font-sans font-settings antialiased h-dvh sm:h-screen w-screen flex flex-col`}
        style={{
          background:
            'radial-gradient(circle, rgba(10,10,10,1) 20%, rgba(5,5,5,1) 40%, rgba(0,0,0,1) 60%)',
        }}
      >
        {children}
        <footer className="absolute bottom-0 w-full pb-4 flex flex-col items-center text-sm sm:text-base">
          <span className="!tracking-normal text-gray-8 font-medium">
            Crafted by{' '}
            <Link
              className="text-color-text-quaternary inline-flex items-center gap-1.5 hover:text-white transition-colors hover-expand-2"
              href="https://x.com/kianbazza"
            >
              Kian
            </Link>{' '}
            @ <span className="text-color-text-quaternary">Bazza Labs</span>.
          </span>
        </footer>
        <Toaster richColors theme="dark" />
      </body>
    </html>
  )
}
