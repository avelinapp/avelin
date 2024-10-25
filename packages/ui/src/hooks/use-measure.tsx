import { useState, useEffect } from 'react'

export function useMeasure() {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(window.innerWidth)

    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    // Set up event listener for window resize
    window.addEventListener('resize', handleResize)

    // Clean up event listener
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return [width]
}
