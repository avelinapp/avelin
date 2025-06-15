import Toolbar from '@/app/(app)/dashboard/_components/toolbar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 flex flex-col gap-8">
      <Toolbar />
      <div className="mx-auto h-full max-w-screen-lg w-full flex flex-col">
        {children}
      </div>
    </div>
  )
}
