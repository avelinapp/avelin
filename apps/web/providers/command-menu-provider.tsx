'use client'

import { createContext, useContext } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'

export type CommandMenuState = {
  isOpen: boolean
}

export type CommandMenuActions = {
  open: () => void
  close: () => void
  toggle: () => boolean
}

export type CommandMenuStore = CommandMenuState & CommandMenuActions

export const createCommandMenuStore = () =>
  createStore<CommandMenuStore>((set, get) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => {
      const { isOpen } = get()
      set({ isOpen: !isOpen })
      return !isOpen
    },
  }))

export const CommandMenuContext =
  createContext<StoreApi<CommandMenuStore> | null>(null)

export const CommandMenuProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const store = createCommandMenuStore()

  return (
    <CommandMenuContext.Provider value={store}>
      {children}
    </CommandMenuContext.Provider>
  )
}

export const useCommandMenu = () => {
  const store = useContext(CommandMenuContext)

  if (!store) {
    throw new Error('useCommandMenu must be used within a CommandMenuProvider')
  }

  return useStore(store)
}
