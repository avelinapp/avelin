'use client'

import { useCommandMenu } from '@/providers/command-menu-provider'
import { useKeyPress } from '@avelin/ui/hooks'

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
