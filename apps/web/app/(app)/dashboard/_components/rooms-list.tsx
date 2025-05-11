'use client'

import { useRerender } from '@/hooks/use-rerender'
import { type Language, languages } from '@/lib/constants'
import { env } from '@/lib/env'
import { Room } from '@/lib/mutations.zero'
import { relativeTime } from '@/lib/utils'
import { useZero } from '@/lib/zero'
import { useView } from '@/providers/view-provider'
import {
  ActivityIcon,
  CircleDotIcon,
  CopyIcon,
  LayersIcon,
  LayoutGridIcon,
  LayoutListIcon,
  LinkIcon,
  PlusIcon,
  TrashIcon,
} from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import { useCopyToClipboard } from '@avelin/ui/hooks'
import { toast } from '@avelin/ui/sonner'
import { ToggleGroup, ToggleGroupItem } from '@avelin/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@avelin/ui/tooltip'
import type { Zero } from '@avelin/zero'
import { useQuery as useZeroQuery } from '@rocicorp/zero/react'
import { AnimatePresence, type Variants, motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useMemo } from 'react'
import EmptyRooms from './empty-rooms'
import { UsersListDisplay } from './user-avatar-list'

export default function RoomsList() {
  const router = useRouter()
  useRerender({ frequency: 1000 * 60 })
  const { ready, setReady } = useView()
  const [roomsDisplayType, setRoomsDisplayType] = useState<'list' | 'grid'>(
    'list',
  )
  const [roomsView, setRoomsView] = useState<'all' | 'active'>('all')

  const z = useZero()

  const q = z.query.rooms
    .where('deletedAt', 'IS', null)
    .related('roomParticipants', (q) => q.related('user'))
    .related('connections')

  let [rooms, { type: status }] = useZeroQuery(q, { ttl: '1d' })

  rooms = rooms
    .filter(
      (room) =>
        (room.creatorId === z.userID &&
          !room.roomParticipants.find((rp) => rp.userId === z.userID)) ||
        !!room.roomParticipants.find(
          (rp) => rp.userId === z.userID && rp.deletedAt === null,
        ),
    )
    .map((room) => ({
      ...room,
      lastAccessedAt:
        room.roomParticipants.find((rp) => rp.userId === z.userID)
          ?.lastAccessedAt ?? null,
    }))
    .sort((a, b) => {
      const x = a.lastAccessedAt ?? a.createdAt!
      const y = b.lastAccessedAt ?? b.createdAt!

      return y - x
    })

  if (roomsView === 'active') {
    rooms = rooms
      .filter((room) => room.connections.some((rp) => rp.isActive))
      .sort((a, b) => {
        const x = Math.max(...a.connections.map((rp) => rp.connectedAt!))
        const y = Math.max(...b.connections.map((rp) => rp.connectedAt!))

        return x - y
      })
  }

  const pageReady = rooms.length > 0 || status === 'complete'

  useEffect(() => {
    if (pageReady && !ready) {
      setReady(true)
    }
  }, [pageReady, setReady, ready])

  const dashboardIsEmpty = !rooms.length

  async function handleCreateRoom() {
    const room = await Room.create()

    if (!room) return

    router.push(`/rooms/${room.slug}`)
  }

  return (
    <div className="flex-1 flex flex-col gap-6 h-full select-none">
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-6">
          <h2 className="font-medium tracking-[-0.01575em]">Code Rooms</h2>
          <ToggleGroup
            className="*:h-8"
            size="sm"
            type="single"
            variant="secondary"
            value={roomsView}
            onValueChange={(v: 'all' | 'active') => {
              if (!v) return
              setRoomsView(v)
            }}
          >
            <ToggleGroupItem value="all">
              <LayersIcon />
              <span>All</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="active">
              <CircleDotIcon />
              <span>Active</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex items-center gap-2">
          <ToggleGroup
            value={roomsDisplayType}
            onValueChange={(v: 'list' | 'grid') => {
              if (!v) return
              setRoomsDisplayType(v)
            }}
            size="sm"
            type="single"
            variant="secondary"
            spacing="none"
          >
            <ToggleGroupItem value="list">
              <LayoutListIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" disabled>
              <LayoutGridIcon />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button
            size="sm"
            className={cn(dashboardIsEmpty && 'hidden')}
            onClick={handleCreateRoom}
            tooltip={{
              content: 'Create a new room',
              align: 'end',
              side: 'bottom',
            }}
          >
            <PlusIcon className="size-fit" />
            Create
          </Button>
        </div>
      </div>
      <div className="flex-1 h-full flex flex-col gap-1 overflow-hidden">
        {dashboardIsEmpty ? (
          <EmptyRooms handleCreateRoom={handleCreateRoom} />
        ) : roomsDisplayType === 'list' ? (
          // @ts-ignore
          <CodeRoomListView rooms={rooms} view={roomsView} />
        ) : null}
      </div>
    </div>
  )
}

const CodeRoomListView = ({
  view,
  rooms,
}: {
  view: 'active' | 'all'
  rooms: Array<
    Zero.Schema.Room &
      Pick<Zero.Schema.RoomParticipant, 'lastAccessedAt'> & {
        roomParticipants: Array<
          Zero.Schema.RoomParticipant & { user: Zero.Schema.User }
        >
      } & { connections: Array<Zero.Schema.RoomConnection> }
  >
}) => {
  const z = useZero()

  async function preloadRoom(id: string) {
    const { cleanup, complete } = z.query.rooms
      .where('id', id)
      .related('roomParticipants')
      .preload({ ttl: '1d' })

    await complete

    console.log('Preloaded room', id)
  }

  return (
    <div className="overflow-y-scroll overflow-x-hidden">
      <div className="grid grid-cols-[max-content_max-content_max-content_max-content_minmax(0,_1fr)] gap-y-1">
        {rooms.map((room) => (
          <CodeRoomListItem
            key={room.id}
            room={room}
            view={view}
            preload={preloadRoom}
          />
        ))}
      </div>
    </div>
  )
}

const CodeRoomListItem = ({
  view,
  room,
  preload,
}: {
  view: 'active' | 'all' | 'hidden'
  room: Zero.Schema.Room &
    Pick<Zero.Schema.RoomParticipant, 'lastAccessedAt'> & {
      roomParticipants: Array<
        Zero.Schema.RoomParticipant & { user: Zero.Schema.User }
      >
      connections: Array<Zero.Schema.RoomConnection>
    }
  preload: (id: string) => Promise<void>
}) => {
  const router = useRouter()
  const z = useZero()

  const language = languages.find(
    (l) => l.value === (room.editorLanguage as Language['value']),
  )!

  const LanguageIcon = language.logo

  // let data = room.roomParticipants.filter((rp) => !rp.user.isAnonymous)
  let data = room.roomParticipants

  const isRoomCreator = room.creatorId === z.userID

  if (view === 'active') {
    data = data.filter((rp) =>
      room.connections.some(
        (conn) => conn.userId === rp.userId && conn.isActive,
      ),
    )
  }

  const users = data.map((rp) => rp.user)

  // Find the room creator
  const [creator] = useZeroQuery(
    z.query.users.where('id', room.creatorId ?? '').one(),
  )

  // If the creator is not in the list of room participants, add them
  if (
    creator &&
    creator.id !== 'user_system' &&
    !users.find((u) => u.id === creator.id)
  ) {
    users.push(creator)
  }

  const isRoomActive = room.connections.some(
    (conn) => conn.userId !== z.userID && conn.isActive,
  )

  async function handleDeleteRoom() {
    await Room.delete({ id: room.id })
  }

  const [, copy] = useCopyToClipboard()

  const roomUrl = useMemo(
    () => `${env.NEXT_PUBLIC_APP_URL}/${room.slug}`,
    [room.slug],
  )

  function handleCopy(notify?: boolean) {
    copy(roomUrl)

    if (notify) {
      toast('Room link copied to your clipboard - share it!', {
        description: roomUrl,
        action: (
          <Button
            size="xs"
            variant="ghost"
            className="p-1.5 h-fit rounded-md ml-auto"
            onClick={() => handleCopy(false)}
          >
            <CopyIcon className="size-4 shrink-0" />
          </Button>
        ),
      })
    }
  }

  return (
    <div
      className="group/item rounded-md hover:bg-gray-3 px-4 h-12 grid grid-cols-subgrid col-span-5 items-center gap-x-4 w-full"
      onClick={() => router.push(`/rooms/${room.slug}`)}
      onMouseEnter={() => preload(room.id)}
    >
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            {LanguageIcon && <LanguageIcon className="size-5 shrink-0" />}
          </TooltipTrigger>
          <TooltipContent
            className="text-xs border-color-border-subtle"
            side="top"
          >
            {language.name}
          </TooltipContent>
        </Tooltip>
      </div>
      <span className="font-[450] tracking-[-0.01575em]">
        {room.title && room.title.length >= 1 ? room.title : 'Untitled room'}
      </span>
      <span className="text-color-text-quaternary ml-4">
        {relativeTime(room.lastAccessedAt ?? room.createdAt!)}
      </span>
      <div className="flex items-center gap-2">
        {view === 'all' && (
          <UsersListDisplay
            users={users}
            hideAnonymous="display"
            maxUsers={4}
          />
        )}
        {view === 'active' && (
          <UsersListDisplay users={users} hideAnonymous="none" maxUsers={4} />
        )}
        <AnimatePresence initial={false} custom={view === 'active'}>
          {view === 'all' && isRoomActive && (
            <div className="flex items-center gap-1.5 text-xs font-medium rounded-md bg-green-5 px-2 py-0.5">
              <ActivityIcon className="size-3" />
              Active
            </div>
          )}
        </AnimatePresence>
      </div>
      <div className="justify-self-end hidden group-hover/item:flex items-center gap-1 z-10">
        <Button
          size="xs"
          variant="outline"
          tooltip={{
            content: 'Copy URL',
          }}
          onClick={(e) => {
            e.stopPropagation()
            handleCopy(true)
          }}
        >
          <LinkIcon className="size-fit" />
        </Button>
        <Button
          size="xs"
          variant="destructive"
          tooltip={{
            content: 'Delete code room',
          }}
          disabled={!isRoomCreator}
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteRoom()
          }}
        >
          <TrashIcon className="size-4 shrink-0 dark:text-gray-12 text-primary-text" />
        </Button>
      </div>
    </div>
  )
}
