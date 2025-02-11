'use client'

import { env } from '@/lib/env'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { usePostHog } from 'posthog-js/react'
import { PostHogProvider as PostHogProviderPrimitive } from 'posthog-js/react'
import { useEffect } from 'react'
import { useAuth } from './auth-provider'

type PosthogBootstrapData = {
  distinctID: string
  featureFlags: Record<string, string | boolean>
}

interface Props {
  bootstrap?: PosthogBootstrapData
  children: React.ReactNode
}

export function PostHogProvider({ bootstrap, children }: Props) {
  const { isPending, isAuthenticated, user, session } = useAuth()

  if (!isPending && isAuthenticated) {
    posthog.identify(user.id, {
      session_id: session.id,
      email: user.email,
      name: user.name,
    })
  }

  if (typeof window !== 'undefined') {
    console.log('Initializing PostHog...')
    console.log('PostHog key:', env.NEXT_PUBLIC_POSTHOG_KEY)

    console.log('PostHog bootstrap:', bootstrap)

    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: '/ingest',
      person_profiles: 'identified_only',
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      autocapture: false, // Disable automatic event capture, as we capture manually
      bootstrap,
    })

    posthog.onFeatureFlags(() => {
      if (posthog.isFeatureEnabled('posthog-client-debug')) {
        posthog.debug(true)
        console.log('PostHog client debugging enabled.')
      }
    })
  }

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
        url = `${url}?${searchParams.toString()}`
      }
      posthog.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams, posthog])

  return null
}
