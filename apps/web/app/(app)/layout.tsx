import { berkeleyMono } from '@/lib/fonts'
import type { Metadata } from 'next'
import '../globals.css'
import '@avelin/ui/globals.css'
import CommandMenu from '@/components/command-menu/command-menu'
import AvelinDevToolsToolbar from '@/components/devtools/toolbar'
import OneDollarStatsScript from '@/components/misc/one-dollar-stats'
import { env } from '@/lib/env'
import Providers from '@/providers'
import { Toaster } from '@avelin/ui/sonner'

export const metadata: Metadata = {
  title: 'Avelin',
  description: 'Code together, right now.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {env.NODE_ENV === 'production' && <OneDollarStatsScript />}
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body
        className={`${berkeleyMono.variable} font-sans font-settings antialiased bg-color-background h-screen w-screen`}
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
