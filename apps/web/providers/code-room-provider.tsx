'use client'

import { createContext, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { HocuspocusProvider } from '@hocuspocus/provider'
import type { Room, Session } from '@avelin/database'
import { USER_IDLE_TIMEOUT } from '@/lib/sync'
import { Language, languages } from '@/lib/constants'
import { toast } from '@avelin/ui/sonner'

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
  editorLanguage?: Language['value']
  editorObserver?: (event: Y.YMapEvent<any>) => void
}

export type CodeRoomActions = {
  initialize: ({ room, session }: { room: Room; session?: Session }) => void
  destroy: () => void
  setUserActive: (userId: number) => void
  setUserInactive: (userId: number) => void
  cleanIdleUsers: () => void
  setEditorLanguage: (language: Language['value']) => void
}

export type CodeRoomStore = CodeRoomState & CodeRoomActions

export const createCodeRoomStore = () =>
  createStore<CodeRoomStore>((set, get) => ({
    ydoc: new Y.Doc(),
    networkProvider: undefined,
    persistenceProvider: undefined,
    room: undefined,
    activeUsers: new Map<number, number>(),
    editorLanguage: undefined,
    initialize: ({ room, session }) => {
      if (!room) throw new Error('Cannot initialize code room without a room')

      set({ room })

      const { ydoc, networkProvider, persistenceProvider } = get()

      function setupEditorLanguageObserver() {
        const editorMap = ydoc.getMap('editor')
        if (!editorMap.has('language')) {
          console.log('Editor language not set, setting to plaintext.')
          editorMap.set('language', 'plaintext') // Set your default language here
        }

        // Set the initial editorLanguage state from Yjs
        set({
          editorLanguage: editorMap.get('language') as Language['value'],
        })

        // Define the observer function
        const observer = (event: Y.YMapEvent<any>) => {
          if (event.keysChanged.has('language')) {
            const newLanguage = editorMap.get('language') as Language['value']
            const languageDetails = languages.find(
              (l) => l.value === newLanguage,
            )
            set({ editorLanguage: newLanguage })
            toast.info(
              `Editor language set to ${languageDetails?.name ?? newLanguage}.`,
            )
            console.log(
              'Editor language update received from ydoc and applied to:',
              newLanguage,
            )
          }
        }

        // Add the observer to the 'editor' map
        editorMap.observe(observer)

        // Store the observer for later cleanup
        set({ editorObserver: observer })
      }

      if (!persistenceProvider) {
        const idbProvider = new IndexeddbPersistence(room.id, ydoc)

        idbProvider.on('synced', (idbPersistence: IndexeddbPersistence) => {
          console.log(
            `Content restored for ${idbPersistence.name} from IndexedDB.`,
          )

          // We only want to set up observers once there is content restored from the local store
          setupEditorLanguageObserver()
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
      const { ydoc, networkProvider, persistenceProvider, editorObserver } =
        get()

      ydoc.destroy()
      networkProvider?.awareness?.destroy()
      networkProvider?.disconnect()
      networkProvider?.destroy()
      persistenceProvider?.destroy()

      if (editorObserver) {
        const editorMap = ydoc.getMap('editor')
        editorMap.unobserve(editorObserver)
      }

      set({
        ydoc: new Y.Doc(),
        networkProvider: undefined,
        persistenceProvider: undefined,
        room: undefined,
        activeUsers: undefined,
        editorLanguage: undefined,
        editorObserver: undefined,
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
    setEditorLanguage: (language) => {
      const { ydoc } = get()

      ydoc.getMap('editor').set('language', language)

      console.log('Editor language set by you to:', language)
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
