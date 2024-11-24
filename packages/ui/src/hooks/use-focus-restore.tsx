import { useEffect, useRef } from 'react'

export function useFocusRestore(isActive: boolean) {
  const previousFocusedElement = useRef<Element | null>(null)

  useEffect(() => {
    if (isActive) {
      previousFocusedElement.current = document.activeElement
    } else if (previousFocusedElement.current) {
      const el = previousFocusedElement.current as HTMLElement
      el.focus()
    }
  }, [isActive])

  return previousFocusedElement
}
