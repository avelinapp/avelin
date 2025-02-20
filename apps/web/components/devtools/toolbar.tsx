'use client'

import { LogoAvelin } from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import { useRouter } from 'next/navigation'
import posthog from 'posthog-js'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { FPSMeter } from './fps'

export default function AvelinDevToolsToolbar() {
  const router = useRouter()

  const FF_devtools = useFeatureFlagEnabled('avelin-devtools')
  const FF_zero = useFeatureFlagEnabled('zero')
  const FF_dashboard = useFeatureFlagEnabled('dashboard')

  function toggleZeroFeatureFlag() {
    posthog.featureFlags.overrideFeatureFlags({
      flags: {
        ...posthog.featureFlags.getFlagVariants(),
        zero: !FF_zero,
      },
    })
    router.refresh()
  }

  function toggleDashboardFeatureFlag() {
    posthog.featureFlags.overrideFeatureFlags({
      flags: {
        ...posthog.featureFlags.getFlagVariants(),
        dashboard: !FF_dashboard,
      },
    })
    router.refresh()
  }

  if (!FF_devtools) return null

  console.log('Loading Avelin developer tools...')

  return (
    <div className="z-10 dark:bg-black bg-white h-9 flex items-center px-4 border-t border-color-border-subtle text-sm">
      <div className="flex items-center h-full gap-4">
        <LogoAvelin className="size-5" />
        <FPSMeter />
        <div className="flex items-center gap-0">
          <Button
            className={cn(
              'h-full w-fit bg-transparent hover:bg-gray-3 rounded-none hover:text-color-text-primary px-2',
              FF_zero
                ? 'text-color-text-primary'
                : 'text-color-text-quaternary',
            )}
            onClick={toggleZeroFeatureFlag}
          >
            <div
              className={cn(
                'rounded-full size-1.5',
                FF_zero ? 'bg-green-10' : 'bg-red-10',
              )}
            />
            <span>Zero</span>
          </Button>
          <Button
            className={cn(
              'h-full w-fit bg-transparent hover:bg-gray-3 rounded-none hover:text-color-text-primary px-2',
              FF_dashboard
                ? 'text-color-text-primary'
                : 'text-color-text-quaternary',
            )}
            onClick={toggleDashboardFeatureFlag}
          >
            <div
              className={cn(
                'rounded-full size-1.5',
                FF_dashboard ? 'bg-green-10' : 'bg-red-10',
              )}
            />
            <span>Dashboard (v0)</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
