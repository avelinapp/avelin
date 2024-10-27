import { CodeRoomProvider } from '@/providers/code-room-provider'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CodeRoomProvider>{children}</CodeRoomProvider>
}
