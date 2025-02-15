import { getFlags } from '@/lib/posthog'
import { getQueryClient, queries } from '@/lib/queries'
import { getHeaders } from '@/lib/utils'
import { TooltipProvider } from '@avelin/ui/tooltip'
import type { AuthJWT } from '@avelin/zero'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { decodeJwt } from 'jose'
import { cookies, headers as nextHeaders } from 'next/headers'
import AuthProvider from './auth-provider'
import { CodeRoomProvider } from './code-room-provider'
import { CommandMenuProvider } from './command-menu-provider'
import { PostHogPageView, PostHogProvider } from './posthog-provider'
import { ThemeProvider } from './theme-provider'
import ZeroRootProvider from './zero-root-provider'

export default async function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = getQueryClient()

  const cookieStore = await cookies()

  const sessionId = cookieStore.get('avelin_session_id')?.value
  const jwt = cookieStore.get('avelin_jwt')?.value
  const payload = jwt ? (decodeJwt(jwt) as AuthJWT) : undefined

  let posthogBootstrapData = undefined

  if (sessionId) {
    const headers = getHeaders(await nextHeaders())
    const auth = await queryClient.fetchQuery(queries.auth.check(headers))

    if (auth) {
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
        <ZeroRootProvider payload={payload} jwt={jwt}>
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
        </ZeroRootProvider>
      </ThemeProvider>
    </HydrationBoundary>
  )
}
