'use client'

import { env } from '@/lib/env'
import { useView } from '@/providers/view-provider'
import { LoaderIcon, LogoAvelin } from '@avelin/icons'
import { BunLogo, NodeJSLogo } from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import posthog from 'posthog-js'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { FPSMeter } from './fps'

export default function AvelinDevToolsToolbar() {
  const router = useRouter()

  const FF_devtools = useFeatureFlagEnabled('avelin-devtools')
  const FF_zero = useFeatureFlagEnabled('zero')
  const FF_dashboard = useFeatureFlagEnabled('dashboard')
  const FF_dashboard_ui_refresh = useFeatureFlagEnabled('dashboard-ui-refresh')

  const { setIsSimulation } = useView()

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

  function toggleDashboardUiRefreshFeatureFlag() {
    posthog.featureFlags.overrideFeatureFlags({
      flags: {
        ...posthog.featureFlags.getFlagVariants(),
        'dashboard-ui-refresh': !FF_dashboard_ui_refresh,
      },
    })
    router.refresh()
  }

  function simulateFullReload() {
    console.log('Simulating full reload...')
    setIsSimulation(true)
    setTimeout(() => {
      console.log('hello')
      setIsSimulation(false)
    }, 3000)
  }

  function toggleRuntime() {
    const RUNTIME = env.NEXT_PUBLIC_RUNTIME

    if (RUNTIME === 'bun') {
      Cookies.remove('runtime')
    } else {
      // TODO: SET OPTIONS
      Cookies.set('runtime', 'bun')
    }

    location.reload()
  }

  if (!FF_devtools) return null

  console.log('Loading Avelin developer tools...')

  return (
    <div className="z-10 dark:bg-black bg-white h-9 flex items-center px-4 border-t border-color-border-subtle text-sm">
      <div className="flex items-center h-full gap-6">
        <LogoAvelin className="size-5" />
        <FPSMeter />
        <Button
          className="flex bg-transparent rounded-none text-color-text-primary hover:bg-gray-3 items-center gap-2 font-medium"
          onClick={toggleRuntime}
          tooltip={{
            content:
              env.NEXT_PUBLIC_RUNTIME === 'bun'
                ? 'Connect to Node.js-based runtime'
                : 'Connect to Bun-based runtime',
          }}
        >
          {env.NEXT_PUBLIC_RUNTIME === 'bun' ? (
            <BunLogo className="size-4" />
          ) : (
            <NodeJSLogo className="size-4" />
          )}
          <div className="flex items-center gap-1">
            {env.NEXT_PUBLIC_RUNTIME === 'bun' ? 'Bun' : 'Node.js'}
            <span className="text-color-text-quaternary">
              v
              {env.NEXT_PUBLIC_RUNTIME === 'bun'
                ? env.NEXT_PUBLIC_BUN_VERSION
                : env.NEXT_PUBLIC_NODE_VERSION}
            </span>
          </div>
        </Button>
        <div className="flex items-center gap-0 *:px-3">
          <Button
            className={cn(
              'h-full w-fit bg-transparent hover:bg-gray-3 rounded-none hover:text-color-text-primary',
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
              'h-full w-fit bg-transparent hover:bg-gray-3 rounded-none hover:text-color-text-primary',
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
            <span>Dashboard</span>
          </Button>
          <Button
            className={cn(
              'h-full w-fit bg-transparent hover:bg-gray-3 rounded-none hover:text-color-text-primary',
              FF_dashboard_ui_refresh
                ? 'text-color-text-primary'
                : 'text-color-text-quaternary',
            )}
            onClick={toggleDashboardUiRefreshFeatureFlag}
          >
            <div
              className={cn(
                'rounded-full size-1.5',
                FF_dashboard_ui_refresh ? 'bg-green-10' : 'bg-red-10',
              )}
            />
            <span>Dashboard - UI refresh</span>
          </Button>
        </div>
        <div className="flex items-center ml-2">
          <span className="mx-2 font-medium text-color-text-primary !tracking-normal">
            Triggers
          </span>
          <Button
            className={cn(
              'h-full w-fit bg-transparent hover:bg-gray-3 rounded-none hover:text-color-text-primary text-color-text-quaternary px-3',
            )}
            onClick={simulateFullReload}
          >
            <LoaderIcon className="size-4 text-white" strokeWidth={2.25} />
            <span>Loading fallback</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
