import type { Metadata } from 'next'
import Toolbar from './_components/toolbar'

export const metadata: Metadata = {
  title: 'Dashboard | Avelin',
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex-1 h-full w-full max-w-screen-lg mx-auto p-4 flex flex-col gap-8">
      <Toolbar />
      {children}
    </div>
  )
}
