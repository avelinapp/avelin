'use client'

import { useCodeRoom } from '@/providers/code-room-provider'
import { useNetworkStatus } from '@avelin/ui/hooks'

export function NetworkStatus() {
  const { networkProvider: provider } = useCodeRoom()
  const { isOnline } = useNetworkStatus()

  if (!provider) return null

  if (!isOnline) {
    return <div>Offline</div>
  }

  if (provider.status !== 'connected') {
    return <div className='text-green-500'>Sync offline</div>
  }

  return <div className='text-green-500'>Online</div>
}
