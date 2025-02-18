export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="light flex flex-col w-full h-full flex-1">{children}</div>
  )
}
