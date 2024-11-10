import AuthProvider from './auth-provider'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient, queries } from '@/lib/queries'

export default async function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery(queries.auth.check())

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuthProvider>{children}</AuthProvider>
    </HydrationBoundary>
  )
}
