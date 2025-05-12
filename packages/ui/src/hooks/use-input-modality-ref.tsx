import { useEffect, useRef } from 'react'

export function useInputModalityRef() {
  const modalityRef = useRef<'keyboard' | 'pointer'>('pointer')

  useEffect(() => {
    const onKeyDown = () => {
      modalityRef.current = 'keyboard'
    }
    const onPointerDown = () => {
      modalityRef.current = 'pointer'
    }

    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('pointerdown', onPointerDown, true)

    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('pointerdown', onPointerDown, true)
    }
  }, [])

  return modalityRef
}
