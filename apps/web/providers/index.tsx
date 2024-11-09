import { checkAuth } from '@/lib/actions'
import AuthProvider from './auth-provider'
import QueryClientProvider from './query-client-provider'

export default async function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = await checkAuth()

  return (
    <QueryClientProvider>
      <AuthProvider initialData={auth ?? undefined}>{children}</AuthProvider>
    </QueryClientProvider>
  )
}
