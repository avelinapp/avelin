import { Auth } from '@avelin/database'
import AuthProvider from './auth-provider'
import QueryClientProvider from './query-client-provider'

export default function Providers({
  children,
  auth,
}: {
  children: React.ReactNode
  auth: Auth
}) {
  return (
    <QueryClientProvider>
      <AuthProvider initialAuth={auth}>{children}</AuthProvider>
    </QueryClientProvider>
  )
}
