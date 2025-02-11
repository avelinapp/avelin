'use client'

import { useEffect, useState } from 'react'

interface DelayedFallbackProps {
  delay: number
  children: React.ReactNode
}

function DelayedFallback({ delay, children }: DelayedFallbackProps) {
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallback(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return showFallback ? children : null
}

export default DelayedFallback
