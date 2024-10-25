import type { Metadata } from 'next'
import { innovatorGrotesk, jetbrainsMono } from '@/lib/fonts'
import './globals.css'
import '@avelin/ui/globals.css'

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
        className={`${innovatorGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased bg-color-background`}
      >
        {children}
      </body>
    </html>
  )
}
