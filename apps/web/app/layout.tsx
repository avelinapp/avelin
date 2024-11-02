import type { Metadata } from 'next'
import { jetbrainsMono } from '@/lib/fonts'
import './globals.css'
import '@/lib/fonts/fonts.css'
import '@avelin/ui/globals.css'
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
    <html lang='en'>
      <body
        className={`${jetbrainsMono.variable} font-sans antialiased bg-color-background h-screen w-screen`}
      >
        <Providers>
          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  )
}
