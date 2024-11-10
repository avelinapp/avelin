import type { Metadata } from 'next'
import { jetbrainsMono } from '@/lib/fonts'
import './globals.css'
import '@/lib/fonts/fonts.css'
import '@avelin/ui/globals.css'
import Providers from '@/providers'
import { Toaster } from '@avelin/ui/sonner'
import QueryClientProvider from '@/providers/query-client-provider'

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
    <html lang='en'>
      <body
        className={`${jetbrainsMono.variable} font-sans antialiased bg-color-background h-screen w-screen`}
      >
        <QueryClientProvider>
          <Providers>
            {children}
            <Toaster richColors />
          </Providers>
        </QueryClientProvider>
      </body>
    </html>
  )
}
