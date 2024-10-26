'use client'

import { createContext, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'
import type { Room } from '@avelin/database'

const CodeRoomContext = createContext<StoreApi<CodeRoomStore> | null>(null)

export interface CodeRoomProviderProps {
  children: React.ReactNode
}

export type CodeRoomState = {
  ydoc: Y.Doc
  networkProvider?: WebsocketProvider
  persistenceProvider?: IndexeddbPersistence
  room?: Room
}

export type CodeRoomActions = {
  initialize: (room: Room) => void
  destroy: () => void
}

export type CodeRoomStore = CodeRoomState & CodeRoomActions

export const createCodeRoomStore = () =>
  createStore<CodeRoomStore>((set, get) => ({
    ydoc: new Y.Doc(),
    networkProvider: undefined,
    persistenceProvider: undefined,
    room: undefined,
    initialize: (room) => {
      if (!room) throw new Error('Cannot initialize code room without a room')

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
        const ws = new WebsocketProvider(
          `ws://localhost:4100/ws`,
          room.id,
          ydoc,
        )

        ws.on('open', () => {
          console.log('Avelin Sync - connection established.')
        })

        ws.on('close', () => {
          console.log('Avelin Sync - connection closed.')
        })

        ws.on('message', (event: MessageEvent) => {
          try {
            const message = JSON.parse(event.data)
            if (message.type === 'ping') {
              // Respond with a pong message
              ws.ws!.send(JSON.stringify({ type: 'pong' }))
              console.log('[SYNC] Responded to heartbeat check.')
            } else {
              // Handle other message types
              console.log(`[SYNC] ${event.data}`)
            }
          } catch (error) {
            if (error instanceof SyntaxError) {
              return
            }
            if (error instanceof Error) {
              console.error(error)
            }
          }
        })
      } else {
        console.log('Network provider already initialized.')
      }
    },
    destroy: () => {
      const { ydoc, networkProvider, persistenceProvider } = get()

      ydoc.destroy()
      networkProvider?.destroy()
      persistenceProvider?.destroy()

      console.log('Destroyed Yjs document.')
      console.log('Tore down WebRTC provider.')
      console.log('Tore down IndexedDB provider.')

      set({
        ydoc: new Y.Doc(),
        networkProvider: undefined,
        persistenceProvider: undefined,
      })
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
