import { PostHog } from 'posthog-node'
import { cache } from 'react'
import { env } from './env'

export const posthog = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
  host: `${env.NEXT_PUBLIC_APP_URL}/ingest`,
  flushAt: 1,
  flushInterval: 0,
})

export const getFlags = cache(async (userId: string) => {
  const flags = await posthog.getAllFlags(userId)
  await posthog.shutdown()
  return flags
})

export default posthog
