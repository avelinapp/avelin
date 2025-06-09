'use client'

import { env } from '@/lib/env'
import { useView } from '@/providers/view-provider'
import { LoaderIcon, LogoAvelin } from '@avelin/icons'
import { BunLogo, NodeJSLogo } from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import { usePathname, useRouter } from 'next/navigation'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useEffect, useState } from 'react'
// @ts-ignore
import { tinykeys } from 'tinykeys'
import { FPSMeter } from './fps'
import ZeroCache from './zero-cache'

export default function AvelinDevToolsToolbar() {
  const FF_devtools = useFeatureFlagEnabled('avelin-devtools')

  const pathname = usePathname()
  const loadZeroClient = !pathname.startsWith('/s/')

  const [show, setShow] = useState(FF_devtools)

  const { setIsSimulation } = useView()

  function simulateFullReload() {
    console.log('Simulating full reload...')
    setIsSimulation(true)
    setTimeout(() => {
      console.log('hello')
      setIsSimulation(false)
    }, 3000)
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+Shift+D': () => {
        setShow(!show)
      },
    })
    return () => {
      unsubscribe()
    }
  }, [show])

  if (!FF_devtools) return null

  console.log('Loading Avelin developer tools...')

  return (
    <div
      className={cn(
        'h-9 dark:bg-black bg-white hidden sm:flex items-center px-4 border-t border-color-border-subtle text-sm py-0',
        !show && 'hidden',
      )}
    >
      <div className="flex items-center gap-6 h-full">
        <LogoAvelin className="size-5" />
        <FPSMeter />
        <Button
          className="h-full py-0 flex bg-transparent rounded-none text-color-text-primary hover:bg-gray-3 items-center gap-2 font-medium"
          tooltip={{
            content:
              env.NEXT_PUBLIC_RUNTIME === 'bun'
                ? `Running Bun v${env.NEXT_PUBLIC_BUN_VERSION}`
                : `Running Node.js v${env.NEXT_PUBLIC_NODE_VERSION}`,
          }}
        >
          {env.NEXT_PUBLIC_RUNTIME === 'bun' ? (
            <BunLogo className="size-4" />
          ) : (
            <NodeJSLogo className="size-4" />
          )}
          <div className="flex items-center gap-1">
            <span className="text-color-text-quaternary">
              v
              {env.NEXT_PUBLIC_RUNTIME === 'bun'
                ? env.NEXT_PUBLIC_BUN_VERSION
                : env.NEXT_PUBLIC_NODE_VERSION}
            </span>
          </div>
        </Button>
        <div className="flex items-center gap-0 *:px-3 h-full"></div>
        <div className="flex items-center ml-2 h-full">
          <span className="mx-2 font-medium text-color-text-primary !tracking-normal">
            Actions
          </span>
          <Button
            className={cn(
              'h-full py-0 w-fit bg-transparent hover:bg-gray-3 rounded-none hover:text-color-text-primary text-color-text-quaternary px-3',
            )}
            onClick={simulateFullReload}
          >
            <LoaderIcon className="size-4 text-white" strokeWidth={2.25} />
            <span>Loading fallback</span>
          </Button>
          {loadZeroClient && <ZeroCache />}
        </div>
      </div>
    </div>
  )
}
