import { getFlags } from '@/lib/posthog'
import { auth } from '@avelin/auth'
import { TooltipProvider } from '@avelin/ui/tooltip'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
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

  const sessionId = cookieStore.get('avelin_session_id')?.value
  let posthogBootstrapData = undefined

  console.log('here')

  if (sessionId) {
    try {
      let user = undefined

      console.log('here2')

      const authData = await auth.api.getSession({
        headers: await headers(),
      })

      if (!authData) {
        const anonAuthData = await auth.api.signInAnonymous()
        console.log('anonAuthData', anonAuthData)

        if (!anonAuthData) {
          throw new Error('Anonymous authentication failed')
        }

        user = anonAuthData.user
      }

      if (authData) {
        user = authData.user
        const flags = await getFlags(user.id)

        posthogBootstrapData = {
          distinctID: user.id,
          featureFlags: flags,
        }
      }
    } catch (error) {
      console.log('error', error)
      return redirect('/login')
    }
  }

  return (
    <ThemeProvider>
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
    </ThemeProvider>
  )
}
