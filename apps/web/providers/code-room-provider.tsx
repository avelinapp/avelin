'use client'

import { createContext, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { HocuspocusProvider, WebSocketStatus } from '@hocuspocus/provider'
import type { Room, User, Session } from '@avelin/database'
import {
  AwarenessChange,
  AwarenessList,
  USER_IDLE_TIMEOUT,
  UserAwareness,
  UserInfo,
} from '@/lib/sync'
import { Language, languages } from '@/lib/constants'
import { toast } from '@avelin/ui/sonner'
import { assignOption, baseColors, generateUniqueName } from '@/lib/rooms'

const CodeRoomContext = createContext<StoreApi<CodeRoomStore> | null>(null)

export interface CodeRoomProviderProps {
  children: React.ReactNode
}

export type CodeRoomState = {
  ydoc: Y.Doc
  networkProvider?: HocuspocusProvider
  networkProviderStatus?: WebSocketStatus
  persistenceProvider?: IndexeddbPersistence
  room?: Room
  clientId?: number
  users: Map<number, UserInfo>
  activeUsers: Map<number, number>
  isInitialSyncConnect: boolean
  isInitialAwarenessUpdate: boolean
  editorLanguage?: Language['value']
  // eslint-disable-next-line
  editorObserver?: (event: Y.YMapEvent<any>) => void
  usersObserver?: (data: AwarenessChange) => void
}

export type CodeRoomActions = {
  initialize: ({
    room,
    user,
    session,
  }: {
    room: Room
    user?: User
    session?: Session
  }) => void
  destroy: () => void
  setIsInitialAwarenessUpdate: (isInitialLoad: boolean) => void
  setUsers: (users: Map<number, UserInfo>) => void
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
    networkProviderStatus: undefined,
    persistenceProvider: undefined,
    room: undefined,
    clientId: undefined,
    users: new Map<number, UserInfo>(),
    activeUsers: new Map<number, number>(),
    editorLanguage: undefined,
    usersObserver: undefined,
    isInitialSyncConnect: false,
    isInitialAwarenessUpdate: true,
    setIsInitialAwarenessUpdate: (value) => {
      set({ isInitialAwarenessUpdate: value })
    },
    initialize: ({ room, user, session }) => {
      if (!room) throw new Error('Cannot initialize code room without a room')

      set({ room })

      const { ydoc, networkProvider, persistenceProvider } = get()

      function setupEditorLanguageObserver() {
        const editorMap = ydoc.getMap('editor')
        if (!editorMap.has('language')) {
          editorMap.set('language', 'plaintext') // Set your default language here
        }

        // Set the initial editorLanguage state from Yjs
        set({
          editorLanguage: editorMap.get('language') as Language['value'],
        })

        // Define the observer function
        // eslint-disable-next-line
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
          }
        }

        // Add the observer to the 'editor' map
        editorMap.observe(observer)

        // Store the observer for later cleanup
        set({ editorObserver: observer })
      }

      function initializeLocalUserInfo(networkProvider: HocuspocusProvider) {
        const awareness = networkProvider.awareness!

        const currentUserInfo = awareness.getLocalState() as UserAwareness

        if (!!currentUserInfo.user) {
          // Local user info already initialized
          // Do not overwrite with new user info
          return
        }

        const assignedColors = Array.from(awareness.getStates().values()).map(
          ({ user }) => user?.color,
        )

        const color = assignOption(Object.values(baseColors), assignedColors)

        const localUser: UserAwareness['user'] = {
          clientId: awareness.clientID,
          name: user?.name ?? generateUniqueName(),
          color: color,
          picture: user?.picture ?? undefined,
          lastActive: Date.now(),
        }

        awareness.setLocalStateField('user', localUser)

        set({ clientId: awareness.clientID })
      }

      function setupUsersObserver(networkProvider: HocuspocusProvider) {
        const awareness = networkProvider.awareness!

        const initialUsers = [...awareness.getStates()] as AwarenessList
        const initialUsersInfo = initialUsers
          // Initial awareness state can be provided without UserInfo defined
          // Makes sure we only include users with UserInfo
          .filter(
            ([, client]) => client !== undefined && client.user !== undefined,
          )
          .map(([clientId, client]) => {
            return [clientId, client.user!]
          }) as Array<[number, UserInfo]>

        set({
          users: new Map(initialUsersInfo),
        })

        const observer = ({ added, removed }: AwarenessChange) => {
          const { isInitialAwarenessUpdate } = get()

          const newAwareness = [...awareness.getStates()] as AwarenessList

          if (!isInitialAwarenessUpdate) {
            added.forEach((id) => {
              const userAwareness = newAwareness.find(
                ([clientId]) => clientId === id,
              )

              const [, client] = userAwareness!

              toast.info(`${client.user?.name} joined the room.`)
            })

            removed.forEach((id) => {
              const removedUser = get().users.get(id)

              if (!removedUser) return

              // WORKAROUND: Currently, there is an awareness-related bug where a remote user's
              // awareness to be removed, then immediately added again. This happens on some interval.
              //
              // This causes a join toast to be displayed, even though the user has not left the room.
              //
              // As a workaround, we wait a short time (50ms), then check if the user is still in the room.
              // If they are, we display the leave toast.
              setTimeout(() => {
                if (!awareness.getStates().has(id)) {
                  toast.info(`${removedUser.name} left the room.`)
                }
              }, 50)
            })
          }

          set({
            users: new Map(
              newAwareness.map(([clientId, client]) => [
                clientId,
                client.user!,
              ]),
            ),
          })

          if (isInitialAwarenessUpdate) {
            set({ isInitialAwarenessUpdate: false })
          }
        }

        awareness.on('change', observer)

        set({ usersObserver: observer })
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
            set({ networkProviderStatus: status })
          },
          onConnect: () => {
            set({ isInitialSyncConnect: false })
            initializeLocalUserInfo(ws)
            setupUsersObserver(ws)
          },
          onAwarenessChange: (data) => {
            console.log('Awareness change:', JSON.stringify(data, null, '\t'))
          },
          onAwarenessUpdate: (data) => {
            console.log('Awareness update:', JSON.stringify(data, null, '\t'))
          },
        })

        set({ networkProvider: ws, isInitialSyncConnect: true })
      } else {
        console.log('Network provider already initialized.')
      }
    },
    destroy: () => {
      const {
        ydoc,
        networkProvider,
        persistenceProvider,
        editorObserver,
        usersObserver,
      } = get()

      ydoc.destroy()
      networkProvider?.awareness?.destroy()
      networkProvider?.disconnect()
      networkProvider?.destroy()
      persistenceProvider?.destroy()

      if (editorObserver) {
        const editorMap = ydoc.getMap('editor')
        editorMap.unobserve(editorObserver)
      }

      if (usersObserver) {
        networkProvider?.awareness?.off('change', usersObserver)
      }

      set({
        ydoc: new Y.Doc(),
        networkProvider: undefined,
        persistenceProvider: undefined,
        room: undefined,
        clientId: undefined,
        users: new Map<number, UserInfo>(),
        activeUsers: undefined,
        editorLanguage: undefined,
        editorObserver: undefined,
        isInitialAwarenessUpdate: true,
      })
    },
    setUsers: (users) => {
      set({ users: new Map([...users]) })
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
