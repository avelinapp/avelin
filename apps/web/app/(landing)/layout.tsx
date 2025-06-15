import '../globals.css'
import OneDollarStatsScript from '@/components/misc/one-dollar-stats'
import { env } from '@/lib/env'
import { berkeleyMono, inter } from '@/lib/fonts'
import { authCookies } from '@avelin/auth'
import { Toaster } from '@avelin/ui/sonner'
import type { Metadata, Viewport } from 'next'
import { cookies, headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const title = 'Avelin'
const description = 'The collaborative brainstorming tool for code.'
const ogImageUrl = 'https://static.avelin.app/og-v2.jpg'

export const metadata: Metadata = {
  title: {
    default: `${title}`,
    template: '%s — Avelin',
  },
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  description,
  keywords: [
    'Collaborate',
    'Brainstorm',
    'GitHub Gist',
    'Google Docs',
    'React',
    'shadcn/ui',
    'Next.js',
    'Tailwind CSS',
    'TypeScript',
    'Radix UI',
  ],
  authors: [
    {
      name: 'Kian Bazza',
      url: 'https://bazza.dev',
    },
  ],
  creator: 'Kian Bazza',
  openGraph: {
    title: 'Avelin',
    images: [
      {
        url: ogImageUrl,
      },
    ],
  },
  twitter: {
    title: 'Avelin',
    card: 'summary_large_image',
    images: [
      {
        url: ogImageUrl,
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${env.NEXT_PUBLIC_APP_URL}/site.webmanifest`,
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
  const headersStore = await headers()

  const sessionId = cookiesStore.get(authCookies.sessionToken.name)?.value
  const pathname = headersStore.get('X-Avelin-Path')

  if (sessionId && pathname !== '/home') {
    return redirect('/dashboard')
  }

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      {env.NODE_ENV === 'production' && <OneDollarStatsScript />}
      <body
        className={`${berkeleyMono.variable} ${inter.variable} font-sans antialiased h-dvh sm:h-screen w-screen flex flex-col`}
        style={{
          background:
            'radial-gradient(circle, rgba(10,10,10,1) 20%, rgba(5,5,5,1) 40%, rgba(0,0,0,1) 60%)',
        }}
      >
        {children}
        <div className="bg-secondary-hover hidden" />
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
