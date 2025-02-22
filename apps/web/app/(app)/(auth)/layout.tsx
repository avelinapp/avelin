export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="p-4 flex flex-col flex-1 h-full w-full bg-app-background">
      {children}
    </div>
  )
}
