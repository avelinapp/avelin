'use client'

import posthog from 'posthog-js'
import { usePathname, useSearchParams } from 'next/navigation'
import { usePostHog } from 'posthog-js/react'
import { PostHogProvider as PostHogProviderPrimitive } from 'posthog-js/react'
import { useAuth } from './auth-provider'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { isPending, isAuthenticated, user, session } = useAuth()

  if (!isPending && isAuthenticated) {
    posthog.identify(user.id, {
      session_id: session.id,
      email: user.email,
      name: user.name,
    })
  }

  useEffect(() => {
    console.log('Initializing PostHog...')
    console.log(
      'PostHog key:',
      process.env.NEXT_PUBLIC_POSTHOG_KEY ?? 'UNDEFINED',
    )

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: '/ingest',
      person_profiles: 'identified_only',
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      autocapture: false, // Disable automatic event capture, as we capture manually
    })

    posthog.onFeatureFlags(() => {
      if (posthog.isFeatureEnabled('posthog-client-debug')) {
        // posthog.debug(true)
        // console.log('PostHog client debugging enabled.')
      }
    })
  }, [])

  return (
    <PostHogProviderPrimitive client={posthog}>
      {children}
    </PostHogProviderPrimitive>
  )
}

export function PostHogPageView(): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()
  useEffect(() => {
    // Track pageviews
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams, posthog])

  return null
}
