import { getFlags } from '@/lib/posthog'
import { getQueryClient, queries } from '@/lib/queries'
import { getHeaders } from '@/lib/utils'
import { TooltipProvider } from '@avelin/ui/tooltip'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { cookies, headers, headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
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
  const headerStore = await headers()

  const sessionId = cookieStore.get('avelin_session_id')?.value

  // if (!sessionId) {
  //   console.log('providers layout - redirecting to login')
  //   return redirect('/login')
  // }
  //
  let posthogBootstrapData = undefined

  if (sessionId) {
    const headers = getHeaders(await nextHeaders())

    try {
      const auth = await queryClient.fetchQuery(queries.auth.check(headers))

      // if (auth && headerStore.get('X-Avelin-Path') === '/login') {
      //   return redirect('/dashboard')
      // }

      if (auth) {
        const flags = await getFlags(auth.user.id)

        posthogBootstrapData = {
          distinctID: auth.user.id,
          featureFlags: flags,
        }
      }
    } catch (error) {
      console.log('error', error)
      return redirect('/login')
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ThemeProvider>
        <AuthProvider>
          <PostHogProvider bootstrap={posthogBootstrapData}>
            <ZeroRootProvider>
              <PostHogPageView />
              <CommandMenuProvider>
                <CodeRoomProvider>
                  <TooltipProvider>{children}</TooltipProvider>
                </CodeRoomProvider>
              </CommandMenuProvider>
            </ZeroRootProvider>
          </PostHogProvider>
        </AuthProvider>
      </ThemeProvider>
    </HydrationBoundary>
  )
}
