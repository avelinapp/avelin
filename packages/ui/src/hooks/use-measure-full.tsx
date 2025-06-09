import { useEffect, useRef, useState } from 'react'

export function useMeasureFull() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        const { offsetWidth, offsetHeight } = ref.current
        setDimensions({ width: offsetWidth, height: offsetHeight })
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)

    if (ref.current) {
      resizeObserver.observe(ref.current)
      handleResize() // Set initial dimensions
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return [ref, dimensions]
}
