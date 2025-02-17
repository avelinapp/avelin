import { berkeleyMono, innovatorGrotesk } from '@/lib/fonts'
import type { Metadata } from 'next'
import './globals.css'
import '@avelin/ui/globals.css'
import CommandMenu from '@/components/command-menu/command-menu'
import AvelinDevToolsToolbar from '@/components/devtools/toolbar'
import Providers from '@/providers'
import QueryClientProvider from '@/providers/query-client-provider'
import { Toaster } from '@avelin/ui/sonner'
import { Provider as JotaiProvider } from 'jotai'

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
        <JotaiProvider>
          <QueryClientProvider>
            <Providers>
              <div className="flex flex-col h-full w-full">
                <div className="flex-1 flex flex-col w-full max-h-full overflow-y-scroll">
                  {children}
                </div>
                <AvelinDevToolsToolbar />
              </div>
              <Toaster richColors />
              <CommandMenu />
            </Providers>
          </QueryClientProvider>
        </JotaiProvider>
      </body>
    </html>
  )
}
