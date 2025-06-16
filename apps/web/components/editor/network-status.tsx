'use client'

import { ZapIcon } from '@avelin/icons'
import { Badge } from '@avelin/ui/badge'
import { cn } from '@avelin/ui/cn'
import { useNetworkStatus } from '@avelin/ui/hooks'
import { Tooltip, TooltipContent, TooltipTrigger } from '@avelin/ui/tooltip'
import { WebSocketStatus } from '@hocuspocus/provider'
import { useCallback, useEffect, useState } from 'react'
import { useCodeRoomStore } from '@/providers/code-room-provider'

interface NetworkStatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function NetworkStatusBadge({ className }: NetworkStatusBadgeProps) {
  const [provider, syncStatus, isInitialSyncConnect] = useCodeRoomStore(
    (state) => [
      state.networkProvider,
      state.networkProviderStatus,
      state.isInitialSyncConnect,
    ],
  )
  const { isOnline } = useNetworkStatus()
  const [show, setShow] = useState(false)

  const handleReconnect = useCallback(() => {
    console.log('Handling reconnect...')
    if (!!provider && provider.status !== WebSocketStatus.Connected) {
      console.log('Reconnecting...')
      provider.connect()
    }
  }, [provider])

  useEffect(() => {
    if (!provider) {
      setShow(false)
      return
    }

    if (isInitialSyncConnect) {
      const timer = setTimeout(() => {
        if (syncStatus !== WebSocketStatus.Connected || !isOnline) {
          setShow(true)
        }
      }, 3000)

      return () => clearTimeout(timer)
    }
    setShow(true)
  }, [provider, syncStatus, isInitialSyncConnect, isOnline])

  const shouldRender =
    !isOnline || (show && provider?.status !== WebSocketStatus.Connected)

  if (!provider) return null

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild className="font-mono tracking-tight">
        {!shouldRender ? null : !isOnline ? (
          <Badge
            variant="secondary"
            className={cn(
              'inline-flex items-center gap-1',
              'animate-in fade-in-5 zoom-in-95 ease-out',
              className,
            )}
          >
            <ZapIcon className="size-3 shrink-0" />
            Offline
          </Badge>
        ) : provider.status !== 'connected' ? (
          <Badge
            variant="secondary"
            className={cn(
              'inline-flex items-center gap-1 bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/25',
              'animate-in fade-in-5 zoom-in-95 ease-out',
              className,
            )}
          >
            <ZapIcon className="size-3 shrink-0 text-orange-500" />
            Offline
          </Badge>
        ) : null}
      </TooltipTrigger>
      <TooltipContent
        align="end"
        collisionPadding={8}
        className="text-xs space-y-1 max-w-[250px] py-4"
      >
        {!isOnline ? (
          <p className="font-semibold">You are offline.</p>
        ) : (
          <p className="font-semibold">You are not connected to Avelin Sync.</p>
        )}
        {isOnline && (
          <p>
            You may need to adjust your firewall to allow Avelin Sync to connect
            you with our services.
          </p>
        )}
        <p>Your changes will be saved locally until you re-connect.</p>
        <p>
          {
            "When you're back online, your work will be merged with the latest changes."
          }
        </p>
        {isOnline && (
          <p
            className="mt-1 font-semibold hover:underline"
            onClick={handleReconnect}
          >
            Click here to reconnect.
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  )
}
