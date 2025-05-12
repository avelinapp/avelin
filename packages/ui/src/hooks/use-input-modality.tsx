import { useEffect, useState } from 'react'

export type Modality = 'keyboard' | 'pointer'

export function useInputModality(): Modality {
  const [modality, setModality] = useState<Modality>('pointer')

  useEffect(() => {
    const onKeyDown = () => setModality('keyboard')
    const onPointerDown = () => setModality('pointer')

    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('pointerdown', onPointerDown, true)

    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('pointerdown', onPointerDown, true)
    }
  }, [])

  return modality
}
