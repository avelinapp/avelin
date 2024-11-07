'use client'

import { useCodeRoom } from '@/providers/code-room-provider'
import { useNetworkStatus } from '@avelin/ui/hooks'
import { Badge } from '@avelin/ui/badge'
import { ZapIcon } from '@avelin/icons'
import { cn } from '@avelin/ui/cn'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@avelin/ui/tooltip'

// eslint-disable-next-line
interface NetworkStatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function NetworkStatusBadge({ className }: NetworkStatusBadgeProps) {
  const { networkProvider: provider } = useCodeRoom()
  const { isOnline } = useNetworkStatus()

  if (!provider) return null

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger
          asChild
          className='font-mono tracking-tight'
        >
          {!isOnline ? (
            <Badge
              variant='secondary'
              className={cn(
                'inline-flex items-center gap-1',
                'animate-in fade-in-5 zoom-in-95 ease-out',
                className,
              )}
            >
              <ZapIcon className='size-3 shrink-0' />
              Offline
            </Badge>
          ) : provider.status !== 'connected' ? (
            <Badge
              variant='secondary'
              className={cn(
                'inline-flex items-center gap-0.5',
                'animate-in fade-in-5 zoom-in-95 ease-out',
                className,
              )}
            >
              <ZapIcon className='size-3 shrink-0' />
              Sync offline
            </Badge>
          ) : null}
        </TooltipTrigger>
        <TooltipContent
          align='end'
          collisionPadding={8}
          className='text-xs space-y-1 max-w-[250px] py-4'
        >
          <p className='font-semibold'>You are offline.</p>
          <p>
            Your changes will be saved locally until you establish a network
            connection.
          </p>
          <p>
            {
              "When you're back online, your work will be merged with the latest changes."
            }
          </p>
          <p>Please reconnect your network and try again.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
