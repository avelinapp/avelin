'use client'

import { createContext, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { HocuspocusProvider } from '@hocuspocus/provider'
import type { Room, Session } from '@avelin/database'
import { USER_IDLE_TIMEOUT } from '@/lib/sync'

const CodeRoomContext = createContext<StoreApi<CodeRoomStore> | null>(null)

export interface CodeRoomProviderProps {
  children: React.ReactNode
}

export type CodeRoomState = {
  ydoc: Y.Doc
  networkProvider?: HocuspocusProvider
  persistenceProvider?: IndexeddbPersistence
  room?: Room
  activeUsers: Map<number, number>
}

export type CodeRoomActions = {
  initialize: ({ room, session }: { room: Room; session?: Session }) => void
  destroy: () => void
  setUserActive: (userId: number) => void
  setUserInactive: (userId: number) => void
  cleanIdleUsers: () => void
}

export type CodeRoomStore = CodeRoomState & CodeRoomActions

export const createCodeRoomStore = () =>
  createStore<CodeRoomStore>((set, get) => ({
    ydoc: new Y.Doc(),
    networkProvider: undefined,
    persistenceProvider: undefined,
    room: undefined,
    activeUsers: new Map<number, number>(),
    initialize: ({ room, session }) => {
      if (!room) throw new Error('Cannot initialize code room without a room')

      set({ room })

      const { ydoc, networkProvider, persistenceProvider } = get()

      if (!persistenceProvider) {
        const idbProvider = new IndexeddbPersistence(room.id, ydoc)

        idbProvider.on('synced', (idbPersistence: IndexeddbPersistence) => {
          console.log(
            `Content restored for ${idbPersistence.name} from IndexedDB.`,
          )
        })

        set({ persistenceProvider: idbProvider })
      } else {
        console.log('Persistence provider already initialized.')
      }

      if (!networkProvider) {
        const ws = new HocuspocusProvider({
          url: process.env.NEXT_PUBLIC_SYNC_URL as string,
          name: room.id,
          document: ydoc,
          token: session?.id,
          onStatus: ({ status }) => {
            console.log('Avelin Sync - connection status:', status)
          },
        })

        set({ networkProvider: ws })
      } else {
        console.log('Network provider already initialized.')
      }
    },
    destroy: () => {
      const { ydoc, networkProvider, persistenceProvider } = get()

      ydoc.destroy()
      networkProvider?.awareness?.destroy()
      networkProvider?.disconnect()
      networkProvider?.destroy()
      persistenceProvider?.destroy()

      set({
        ydoc: new Y.Doc(),
        networkProvider: undefined,
        persistenceProvider: undefined,
        room: undefined,
        activeUsers: undefined,
      })
    },
    setUserActive: (userId) => {
      const { activeUsers } = get()
      activeUsers.set(userId, Date.now())
      set({ activeUsers: new Map([...activeUsers]) })
    },
    setUserInactive: (userId) => {
      const { activeUsers } = get()
      activeUsers.delete(userId)
      set({ activeUsers: new Map([...activeUsers]) })
    },
    cleanIdleUsers: () => {
      const { activeUsers } = get()

      const now = Date.now()
      const users = new Map<number, number>()

      activeUsers.forEach((userId, lastActive) => {
        if (now - lastActive <= USER_IDLE_TIMEOUT) {
          users.set(userId, lastActive)
        }
      })

      set({ activeUsers: users })
    },
  }))

export const CodeRoomProvider = ({ children }: CodeRoomProviderProps) => {
  const [store] = useState(() => createCodeRoomStore())

  return (
    <CodeRoomContext.Provider value={store}>
      {children}
    </CodeRoomContext.Provider>
  )
}

export const useCodeRoom = () => {
  const store = useContext(CodeRoomContext)

  if (!store) {
    throw new Error('useCodeRoom must be used within a CodeRoomProvider')
  }

  return useStore(store)
}
