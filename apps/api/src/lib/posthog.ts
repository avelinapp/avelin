import { PostHog } from 'posthog-node'
import { env } from '../env'

export const posthog = new PostHog(env.POSTHOG_KEY, {
  host: `${env.APP_URL}/ingest`,
})
