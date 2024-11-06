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
      <Tooltip>
        <TooltipTrigger asChild>
          {!isOnline ? (
            <Badge
              variant='secondary'
              className={cn(
                'inline-flex items-center gap-0.5',
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
        <TooltipContent align='end'>
          You are currently not connected to the network.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
