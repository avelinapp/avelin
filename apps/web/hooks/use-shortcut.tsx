'use client'

import { useKeyPress } from '@avelin/ui/hooks'
import { useCommandMenu } from '@/providers/command-menu-provider'

export const useShortcut = (
  keys: string[],
  callback: () => void,
  node = null,
) => {
  const { isOpen } = useCommandMenu()
  return useKeyPress(
    keys,
    () => {
      if (!isOpen) {
        callback()
      }
    },
    node,
  )
}
