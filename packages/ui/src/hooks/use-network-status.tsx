import { useCallback, useEffect, useMemo, useState } from 'react'

export const useNetworkStatus = () => {
  // Determine if we're running on the client
  const isClient =
    typeof window !== 'undefined' && typeof navigator !== 'undefined'

  // Initialize state based on the environment
  const [isOnline, setOnline] = useState<boolean>(
    isClient ? navigator.onLine : true, // Default to true on the server
  )

  // Function to update network status
  const updateNetworkStatus = useCallback(() => {
    if (isClient) {
      setOnline(navigator.onLine)
    }
  }, [isClient])

  // Update network status on initial mount
  useEffect(() => {
    updateNetworkStatus()
  }, [updateNetworkStatus]) // Empty dependency array ensures this runs once on mount

  // Add event listeners for network status changes
  useEffect(() => {
    if (!isClient) {
      return // Exit early if not on the client
    }

    window.addEventListener('load', updateNetworkStatus)
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('load', updateNetworkStatus)
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
    }
  }, [isClient, updateNetworkStatus]) // Depend on isClient to ensure correctness

  return { isOnline }
}
