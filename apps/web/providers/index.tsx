import AuthProvider from './auth-provider'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient, queries } from '@/lib/queries'
import { CodeRoomProvider } from './code-room-provider'
import { PostHogPageView, PostHogProvider } from './posthog-provider'
import { TooltipProvider } from '@avelin/ui/tooltip'
import { ThemeProvider } from './theme-provider'
import { CommandMenuProvider } from './command-menu-provider'
import { cookies, headers as nextHeaders } from 'next/headers'
import { getHeaders } from '@/lib/utils'
import { getFlags } from '@/lib/posthog'

export default async function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()

  const sessionId = cookies().get('avelin_session_id')?.value

  let posthogBootstrapData = undefined

  if (!!sessionId) {
    const headers = getHeaders(nextHeaders())
    const auth = await queryClient.fetchQuery(queries.auth.check(headers))

    if (!!auth) {
      const flags = await getFlags(auth.user.id)
      posthogBootstrapData = {
        distinctID: auth.user.id,
        featureFlags: flags,
      }
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ThemeProvider>
        <AuthProvider>
          <PostHogProvider bootstrap={posthogBootstrapData}>
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
