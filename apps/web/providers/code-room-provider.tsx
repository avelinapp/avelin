'use client'

import { type Language, languages } from '@/lib/constants'
import { env } from '@/lib/env'
import { assignOption, baseColors, generateUniqueName } from '@/lib/rooms'
import {
  type AwarenessChange,
  type AwarenessList,
  USER_IDLE_TIMEOUT,
  type UserAwareness,
  type UserInfo,
} from '@/lib/sync'
import { client } from '@/lib/zero'
import type { Session, User } from '@avelin/auth'
import { toast } from '@avelin/ui/sonner'
import type { Zero } from '@avelin/zero'
import { HocuspocusProvider, type WebSocketStatus } from '@hocuspocus/provider'
import type { TypedView } from '@rocicorp/zero'
import { createContext, useContext, useState } from 'react'
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector'
import { IndexeddbPersistence } from 'y-indexeddb'
import { Awareness } from 'y-protocols/awareness'
import * as Y from 'yjs'
import { type StoreApi, createStore, useStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const CodeRoomContext = createContext<StoreApi<CodeRoomStore> | null>(null)

export interface CodeRoomProviderProps {
  children: React.ReactNode
}

export type CodeRoomState = {
  ydoc: Y.Doc
  awareness?: Awareness
  networkProvider?: HocuspocusProvider
  networkProviderStatus?: WebSocketStatus
  persistenceProvider?: IndexeddbPersistence
  room?: Zero.Schema.Room
  clientId?: number
  users: Map<number, UserInfo>
  activeUsers: Map<number, number>
  isInitialSyncConnect: boolean
  skipRoomAwarenessChangeEvent: boolean
  isInitialZeroQueryMaterialized: boolean
  didClientDeleteRoom: boolean
  roomTitle?: string
  editorLanguage?: Language['value']
  roomZeroView?: TypedView<Zero.Schema.Room | undefined>
  usersObserver?: (data: AwarenessChange) => void
}

export type CodeRoomActions = {
  initialize: ({
    room,
    user,
    session,
  }: {
    room: Zero.Schema.Room
    user?: User
    session?: Session
  }) => void
  destroy: () => void
  setUsers: (users: Map<number, UserInfo>) => void
  setUserActive: (userId: number) => void
  setUserInactive: (userId: number) => void
  cleanIdleUsers: () => void
  setEditorLanguage: (
    language: Language['value'],
    localOnly?: boolean,
  ) => Promise<void>
  setRoomTitle: (title: string, localOnly?: boolean) => Promise<void>
  toggleRoomDeleted: (value: boolean) => void
}

export type CodeRoomStore = CodeRoomState & CodeRoomActions

export const createCodeRoomStore = () =>
  createStore<CodeRoomStore>((set, get) => ({
    ydoc: new Y.Doc(),
    awareness: undefined,
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
    isInitialZeroQueryMaterialized: true,
    skipRoomAwarenessChangeEvent: true,
    didClientDeleteRoom: false,
    initialize: ({ room, user, session }) => {
      if (!room) throw new Error('Cannot initialize code room without a room')

      if (room.deletedAt !== null) return

      set({ room })
      set({
        editorLanguage: room.editorLanguage ?? undefined,
        roomTitle: room.title ?? undefined,
      })

      const { ydoc, networkProvider, persistenceProvider } = get()

      set({ awareness: new Awareness(ydoc) })

      function setupRoomObserver() {
        const z = client
        if (!z) return

        const q = z.query.rooms.where('id', room.id).one()
        const view = q.materialize()
        set({ roomZeroView: view })

        view.addListener((data, result) => {
          if (result !== 'complete') return
          if (!data) return
          if (get().isInitialZeroQueryMaterialized) {
            set({ isInitialZeroQueryMaterialized: false })
            return
          }

          if (get().editorLanguage !== data.editorLanguage) {
            const newLanguage = languages.find(
              (l) => l.value === data.editorLanguage,
            )

            if (newLanguage) {
              set({ editorLanguage: newLanguage.value })
              toast.info(`Editor language set to ${newLanguage.name}.`)
            }
          }

          if (get().roomTitle !== data.title) {
            set({ roomTitle: data.title ?? undefined })
          }

          if (data.deletedAt !== null) {
            get().destroy()
          }
        })
      }

      function initializeLocalUserInfo(awareness: Awareness) {
        const currentUserInfo = awareness.getLocalState() as UserAwareness

        if (currentUserInfo.user) {
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
          name: user && !user.isAnonymous ? user.name : generateUniqueName(),
          color: color,
          picture:
            user && !user.isAnonymous && !!user.image ? user.image : undefined,
          lastActive: Date.now(),
        }

        awareness.setLocalStateField('user', localUser)

        set({ clientId: awareness.clientID })
      }

      function setupUsersObserver(awareness: Awareness) {
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
          const { skipRoomAwarenessChangeEvent } = get()

          const newAwareness = [...awareness.getStates()] as AwarenessList

          if (!skipRoomAwarenessChangeEvent) {
            // biome-ignore lint/complexity/noForEach: <explanation>
            added.forEach((id) => {
              const userAwareness = newAwareness.find(
                ([clientId]) => clientId === id,
              )

              const [, client] = userAwareness!

              toast.info(`${client.user?.name} joined the room.`)
            })

            // biome-ignore lint/complexity/noForEach:
            removed.forEach((id) => {
              const removedUser = get().users.get(id)

              // Don't show leave toast for the user themselves
              // i.e. when user navigates from code room to dashboard
              if (!removedUser || id === get().clientId) return

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

          if (skipRoomAwarenessChangeEvent) {
            set({ skipRoomAwarenessChangeEvent: false })
          }
        }

        awareness.on('change', observer)

        set({ usersObserver: observer })
      }

      const { awareness } = get()

      setupRoomObserver()
      initializeLocalUserInfo(awareness!)
      setupUsersObserver(awareness!)

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
        console.log('[networkProvider] session', session)
        const ws = new HocuspocusProvider({
          url: env.NEXT_PUBLIC_SYNC_URL as string,
          name: room.id,
          document: ydoc,
          awareness: get().awareness,
          token: session?.token,
          preserveConnection: false,
          onStatus: ({ status }) => {
            console.log('Avelin Sync - connection status:', status)
            set({ networkProviderStatus: status })
          },
          onConnect: () => {
            set({ isInitialSyncConnect: false })

            setTimeout(() => {
              set({ skipRoomAwarenessChangeEvent: false })
            }, 50)
          },
          onSynced: () => {
            // Only setup editor language after network provider sync.
            //
            // Previously, this was done after local provider sync, which caused an issue in production
            // (or more realistic network scenarios with latency between local and network provider sync).
            // The issue resulted in new users joining a room to reset the room's editor language back
            // to the default since they had not yet synced with the network to receive the actual editor language.
          },
          onDisconnect: (data) => {
            console.log(
              `Avelin Sync - disconnected (code ${data.event.code} - reason: ${data.event.reason})`,
            )
          },
          onClose: (data) => {
            console.log(
              `Avelin Sync - closed (code ${data.event.code} - reason: ${data.event.reason})`,
            )
          },
          onDestroy: () => {
            console.log('Avelin Sync - destroyed')
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
        awareness,
        networkProvider,
        persistenceProvider,
        roomZeroView,
        usersObserver,
      } = get()

      if (roomZeroView) {
        roomZeroView.destroy()
      }

      if (usersObserver) {
        networkProvider?.awareness?.off('change', usersObserver)
      }

      awareness?.destroy()
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
        clientId: undefined,
        users: new Map<number, UserInfo>(),
        activeUsers: undefined,
        editorLanguage: undefined,
        roomZeroView: undefined,
        skipRoomAwarenessChangeEvent: true,
        awareness: undefined,
        usersObserver: undefined,
        isInitialSyncConnect: false,
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
    setEditorLanguage: async (language, localOnly = false) => {
      const z = client
      const room = get().room

      if (!z || !room) return

      let newLanguage: string | undefined = language

      if (!localOnly) {
        try {
          await z.mutate.rooms.update({
            id: room.id,
            editorLanguage: language,
          })

          const [newRoom] = await z.query.rooms.where('id', room.id).run()
          newLanguage = newRoom?.editorLanguage ?? undefined
        } catch (e) {
          console.error('Error setting editor language:', e)
        }
      }

      set({
        editorLanguage: newLanguage,
      })
    },
    setRoomTitle: async (title, localOnly = false) => {
      const z = client
      const room = get().room

      if (!z || !room) return

      let newTitle: string | undefined = title

      if (!localOnly) {
        try {
          await z.mutate.rooms.update({
            id: room.id,
            title,
          })

          const [newRoom] = await z.query.rooms.where('id', room.id).run()
          newTitle = newRoom?.title ?? ''
        } catch (e) {
          console.error('Error setting room title:', e)
        }
      }

      set({
        roomTitle: newTitle,
      })
    },
    toggleRoomDeleted: (value) => {
      set({ didClientDeleteRoom: value })
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

export function useCodeRoomStore<T>(selector: (state: CodeRoomStore) => T) {
  const store = useContext(CodeRoomContext)

  if (!store) {
    throw new Error('useCodeRoom must be used within a CodeRoomProvider')
  }
  return useStore(store, useShallow(selector))
}

export const useCodeRoom = () => {
  const store = useContext(CodeRoomContext)

  if (!store) {
    throw new Error('useCodeRoom must be used within a CodeRoomProvider')
  }

  return useStore(store)
}

function shallowEqualUsers(
  a: Omit<UserInfo, 'lastActive'>[],
  b: Omit<UserInfo, 'lastActive'>[],
): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const ua = a[i]!
    const ub = b[i]!
    if (
      ua.clientId !== ub.clientId ||
      ua.name !== ub.name ||
      ua.color !== ub.color ||
      ua.picture !== ub.picture
    ) {
      return false
    }
  }
  return true
}

export function useCustomUsersSelector() {
  const store = useContext(CodeRoomContext)
  if (!store) {
    throw new Error(
      'useCustomUsersSelector must be used within a CodeRoomProvider',
    )
  }

  return useSyncExternalStoreWithSelector(
    store.subscribe, // subscribe to store changes
    store.getState, // get the current state snapshot
    store.getState, // for server-side rendering, same as getState
    (state: CodeRoomStore) =>
      // Create a new array from the users map that omits the `lastActive` field.
      Array.from(state.users.values()).map(({ lastActive, ...user }) => user),
    shallowEqualUsers, // Custom equality function that ignores changes in `lastActive`
  )
}
