import AuthProvider from './auth-provider'
import QueryClientProvider from './query-client-provider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}
