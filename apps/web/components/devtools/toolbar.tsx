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
    <div className="z-10 bg-black h-9 flex items-center px-4 border border-color-border-subtle text-sm">
      <div className="flex items-center h-full gap-4">
        <LogoAvelin className="size-5" />
        <Button
          className="h-full w-fit bg-transparent hover:bg-gray-2 rounded-none text-color-text-primary"
          onClick={toggleZeroFeatureFlag}
        >
          <div
            className={cn(
              'rounded-full size-1.5',
              FF_zero ? 'bg-green-10' : 'bg-gray-11',
            )}
          />
          Zero
        </Button>
      </div>
    </div>
  )
}
