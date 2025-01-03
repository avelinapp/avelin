import AuthProvider from './auth-provider'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient, queries } from '@/lib/queries'
import { headers } from 'next/headers'
import { CodeRoomProvider } from './code-room-provider'
import { PostHogPageView, PostHogProvider } from './posthog-provider'
import { TooltipProvider } from '@avelin/ui/tooltip'
import { ThemeProvider } from './theme-provider'
import { CommandMenuProvider } from './command-menu-provider'

export default async function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(queries.auth.check(headers()))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ThemeProvider>
        <AuthProvider>
          <PostHogProvider>
            <PostHogPageView />
            <CommandMenuProvider>
              <CodeRoomProvider>
                <TooltipProvider>{children}</TooltipProvider>
              </CodeRoomProvider>
            </CommandMenuProvider>
          </PostHogProvider>
        </AuthProvider>
      </ThemeProvider>
    </HydrationBoundary>
  )
}
