import { berkeleyMono, innovatorGrotesk } from '@/lib/fonts'
import type { Metadata } from 'next'
import './globals.css'
import '@avelin/ui/globals.css'
import CommandMenu from '@/components/command-menu/command-menu'
import AvelinDevToolsToolbar from '@/components/devtools/toolbar'
import Providers from '@/providers'
import QueryClientProvider from '@/providers/query-client-provider'
import { ScrollArea } from '@avelin/ui/scroll-area'
import { Toaster } from '@avelin/ui/sonner'

export const metadata: Metadata = {
  title: 'Avelin',
  description: 'Code together, right now.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${innovatorGrotesk.variable} ${berkeleyMono.variable} font-sans font-settings antialiased bg-color-background h-screen w-screen`}
      >
        <QueryClientProvider>
          <Providers>
            <div className="flex flex-col h-screen w-screen">
              <div className="flex-1 w-full h-full overflow-y-scroll overflow-x-hidden">
                {children}
              </div>
              <AvelinDevToolsToolbar />
            </div>
            <Toaster richColors />
            <CommandMenu />
          </Providers>
        </QueryClientProvider>
      </body>
    </html>
  )
}
