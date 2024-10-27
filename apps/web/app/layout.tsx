import type { Metadata } from 'next'
import { jetbrainsMono } from '@/lib/fonts'
import './globals.css'
import '@/lib/fonts/fonts.css'
import '@avelin/ui/globals.css'
import Providers from '@/providers'
import { checkAuth } from '@/lib/actions'
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
  const auth = await checkAuth()

  if (!auth) {
    return redirect('/login')
  }

  return (
    <html lang='en'>
      <body
        className={`${jetbrainsMono.variable} font-sans antialiased bg-color-background`}
      >
        <Providers auth={auth}>{children}</Providers>
      </body>
    </html>
  )
}
