import { useState, useEffect } from 'react'

export function useBreakpoint() {
  // Helper function to get current breakpoint
  const getBreakpoint = (width: number) => {
    if (width < 640) return 'xs' // Consider below 'sm' as 'xs'
    if (width >= 640 && width < 768) return 'sm'
    if (width >= 768 && width < 1024) return 'md'
    if (width >= 1024 && width < 1280) return 'lg'
    if (width >= 1280 && width < 1536) return 'xl'
    return '2xl'
  }

  // State to store the current breakpoint
  const [breakpoint, setBreakpoint] = useState(getBreakpoint(0))

  useEffect(() => {
    setBreakpoint(getBreakpoint(window.innerWidth))

    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth))
    }

    // Set up event listener for window resize
    window.addEventListener('resize', handleResize)

    // Clean up event listener
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}
