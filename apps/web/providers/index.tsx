import { authClient } from '@/lib/auth'
import { getFlags } from '@/lib/posthog'
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
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('avelin.session_token')?.value
  let authData = undefined
  let posthogBootstrapData = undefined
  let jwt = undefined
  let onSuccessResolve: (value?: unknown) => void
  const onSuccessPromise = new Promise((resolve) => {
    onSuccessResolve = resolve
  })

  if (sessionId) {
    const { data, error } = await authClient.getSession({
      query: {
        disableCookieCache: true,
      },
      fetchOptions: {
        headers: await headers(),
        onSuccess: (ctx) => {
          jwt = ctx.response.headers.get('set-auth-jwt')
          onSuccessResolve()
        },
      },
    })

    if (!error) {
      await onSuccessPromise
    }

    authData = error ? undefined : data

    if (authData) {
      const user = authData.user
      const flags = await getFlags(user.id)
      posthogBootstrapData = {
        distinctID: user.id,
        featureFlags: flags,
      }
    }
  }

  return (
    <ThemeProvider>
      <AuthProvider bootstrap={authData ?? undefined}>
        <PostHogProvider bootstrap={posthogBootstrapData}>
          <ZeroRootProvider jwt={jwt}>
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
