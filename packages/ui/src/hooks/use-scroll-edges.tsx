import { useLayoutEffect, useMemo, useState } from 'react'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function useScrollEdges(ref: React.RefObject<any>) {
  const [edges, setEdges] = useState({
    top: true,
    bottom: true,
    left: true,
    right: true,
  })

  // Helper function to check scroll positions and update the state
  const checkScroll = () => {
    const container = ref.current
    if (!container) return

    const {
      scrollTop,
      scrollHeight,
      clientHeight,
      scrollLeft,
      scrollWidth,
      clientWidth,
    } = container

    // Check if the edges are touched
    const isTop = scrollTop === 0
    const isBottom = scrollHeight - scrollTop - clientHeight <= 1
    const isLeft = scrollLeft === 0
    const isRight = scrollWidth - scrollLeft === clientWidth

    setEdges({
      top: isTop,
      bottom: isBottom,
      left: isLeft,
      right: isRight,
    })
  }

  useLayoutEffect(() => {
    const container = ref.current

    if (container) {
      // Initial check to determine scroll positions
      checkScroll()

      // Attach scroll event listener for scroll updates
      container.addEventListener('scroll', checkScroll)

      // ResizeObserver to monitor changes in container size
      const resizeObserver = new ResizeObserver(() => {
        checkScroll() // Recalculate when container size changes
      })

      resizeObserver.observe(container)

      // Cleanup function
      return () => {
        container.removeEventListener('scroll', checkScroll)
        resizeObserver.disconnect()
      }
    }
  }, [ref]) // Only rerun this effect if the ref changes

  return useMemo(
    () => ({
      left: edges.left,
      right: edges.right,
      top: edges.top,
      bottom: edges.bottom,
    }),
    [edges.left, edges.right, edges.top, edges.bottom],
  )
}
