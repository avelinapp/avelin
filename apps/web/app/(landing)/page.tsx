import posthog from '@/lib/posthog'
import { Landing } from './_components/landing'

export interface WaitlistConfig {
  enabled: boolean
  stage: 'alpha'
  visibility: 'public' | 'private'
}

const missingConfig: WaitlistConfig = {
  enabled: false,
  stage: 'alpha',
  visibility: 'private',
}

export default async function Page() {
  const waitlistConfig = (await posthog.getFeatureFlagPayload(
    'waitlist',
    '_irrelevant',
  )) as WaitlistConfig | undefined

  console.log('waitlist config', waitlistConfig)

  return <Landing config={waitlistConfig ?? missingConfig} />
}
