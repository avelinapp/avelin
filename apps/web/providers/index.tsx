import { authClient } from '@/lib/auth'
import { getFlags } from '@/lib/posthog'
import { authCookies } from '@avelin/auth'
import { TooltipProvider } from '@avelin/ui/tooltip'
import { cookies, headers } from 'next/headers'
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
  const start = performance.now()

  const cookieStore = await cookies()
  const sessionId = cookieStore.get(authCookies.sessionToken.name)?.value
  let auth = undefined
  let posthogBootstrapData = undefined

  if (sessionId) {
    const { data, error } = await authClient.getSession({
      fetchOptions: {
        headers: await headers(),
      },
    })

    auth = error ? undefined : data

    if (auth) {
      const flags = await getFlags(auth.user.id)
      posthogBootstrapData = {
        distinctID: auth.user.id,
        featureFlags: flags,
      }
    }
  }

  const end = performance.now()

  console.log('took', end - start, 'ms')

  return (
    <ThemeProvider>
      <AuthProvider bootstrap={auth ?? undefined}>
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
  )
}
