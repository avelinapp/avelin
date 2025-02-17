'use client'

import { LogoAvelin } from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import { useRouter } from 'next/navigation'
import posthog from 'posthog-js'
import { useFeatureFlagEnabled } from 'posthog-js/react'

export default function AvelinDevToolsToolbar() {
  const router = useRouter()

  const FF_devtools = useFeatureFlagEnabled('avelin-devtools')
  const FF_zero = useFeatureFlagEnabled('zero')

  function toggleZeroFeatureFlag() {
    posthog.featureFlags.overrideFeatureFlags({
      flags: {
        zero: !FF_zero,
      },
    })
    router.refresh()
  }

  if (!FF_devtools) return null

  console.log('Loading Avelin developer tools...')

  return (
    <div className="z-10 dark:bg-black bg-white h-9 flex items-center px-4 border border-color-border-subtle text-sm">
      <div className="flex items-center h-full gap-4">
        <LogoAvelin className="size-5" />
        <Button
          className={cn(
            'h-full w-fit bg-transparent hover:bg-gray-3 rounded-none hover:text-color-text-primary',
            FF_zero ? 'text-color-text-primary' : 'text-color-text-quaternary',
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
      </div>
    </div>
  )
}
