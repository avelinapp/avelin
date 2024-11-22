import AuthProvider from './auth-provider'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient, queries } from '@/lib/queries'
import { headers } from 'next/headers'
import { CodeRoomProvider } from './code-room-provider'
import { PostHogPageView, PostHogProvider } from './posthog-provider'

export default async function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(queries.auth.check(headers()))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuthProvider>
        <PostHogProvider>
          <PostHogPageView />
          <CodeRoomProvider>{children}</CodeRoomProvider>
        </PostHogProvider>
      </AuthProvider>
    </HydrationBoundary>
  )
}
