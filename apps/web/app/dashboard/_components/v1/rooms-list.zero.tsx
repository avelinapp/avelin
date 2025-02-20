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
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useMemo } from 'react'
import { EmptyDashboardIcon } from './empty-state-icon'
import { UsersListDisplay } from './user-avatar-list'

export default function RoomsListZero() {
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

  let [rooms, { type: status }] = useZeroQuery(q)

  rooms = rooms
    .filter(
      (room) =>
        (room.creatorId === z.userID &&
          !room.roomParticipants.find((rp) => rp.userId === z.userID)) ||
        !!room.roomParticipants.find((rp) => rp.userId === z.userID),
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
      .filter((room) => room.roomParticipants.some((rp) => rp.isConnected))
      .sort((a, b) => {
        const x = Math.max(...a.roomParticipants.map((rp) => rp.connectedAt!))
        const y = Math.max(...b.roomParticipants.map((rp) => rp.connectedAt!))

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
    <div className={cn('flex-1 flex flex-col gap-4 h-full select-none')}>
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-semibold">Code Rooms</h2>
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
            <ToggleGroupItem value="all" className="group">
              <LayersIcon className="group-hover:text-color-text-primary" />
              All
            </ToggleGroupItem>
            <ToggleGroupItem className="group" value="active">
              <CircleDotIcon className="group-hover:text-color-text-primary" />
              Active
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
            <ToggleGroupItem
              className="disabled:blur-[1px]"
              value="grid"
              disabled
            >
              <LayoutGridIcon />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button
            size="sm"
            className={cn(dashboardIsEmpty && 'hidden')}
            onClick={handleCreateRoom}
          >
            <PlusIcon className="size-fit" />
            Create
          </Button>
        </div>
      </div>
      <div className="flex-1 h-full flex flex-col gap-1  ">
        {dashboardIsEmpty ? (
          <div className="flex items-center gap-8 m-auto">
            <EmptyDashboardIcon className="size-32 stroke-gray-8 stroke-1" />
            <div className="space-y-4">
              <p className="font-medium">Create or join a code room</p>
              <div>
                <p>
                  Your code rooms will be available to you from this dashboard.
                </p>
                <p>You can get started by creating a code room.</p>
              </div>
              <Button onClick={handleCreateRoom}>Create room</Button>
            </div>
          </div>
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
      }
  >
}) => {
  return (
    <div className="grid grid-cols-[max-content_max-content_max-content_max-content_minmax(0,_1fr)] gap-y-1">
      {rooms.map((room) => (
        // @ts-ignore
        <CodeRoomListItem key={room.id} room={room} view={view} />
      ))}
    </div>
  )
}

const CodeRoomListItem = ({
  view,
  room,
}: {
  view: 'active' | 'all'
  room: Zero.Schema.Room &
    Pick<Zero.Schema.RoomParticipant, 'lastAccessedAt'> & {
      roomParticipants: Array<
        Zero.Schema.RoomParticipant & { user: Zero.Schema.User }
      >
    }
}) => {
  const router = useRouter()

  const language = languages.find(
    (l) => l.value === (room.editorLanguage as Language['value']),
  )!

  const LanguageIcon = language.logo!

  let data = room.roomParticipants.filter((rp) => !rp.user.isAnonymous)

  if (view === 'active') {
    data = data.filter((rp) => rp.isConnected)
  }

  const users = data.map((rp) => rp.user)

  const isRoomActive = data.some((rp) => rp.isConnected)

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
    >
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <LanguageIcon className="size-5 shrink-0" />
          </TooltipTrigger>
          <TooltipContent
            className="text-xs border-color-border-subtle"
            side="top"
          >
            {language.name}
          </TooltipContent>
        </Tooltip>
      </div>
      <span className="font-medium">
        {room.title && room.title.length >= 1 ? room.title : 'Untitled room'}
      </span>
      <span className="text-color-text-quaternary ml-4">
        {relativeTime(room.lastAccessedAt ?? room.createdAt!)}
      </span>
      <div className="flex items-center gap-2">
        <UsersListDisplay
          layoutId={`${room.id}-view-${view}`}
          users={users}
          maxUsers={4}
        />
        {view === 'all' && isRoomActive && (
          <div className="flex items-center gap-1.5 text-xs font-medium rounded-md bg-green-5 px-2 py-0.5">
            <ActivityIcon className="size-3" />
            Active
          </div>
        )}
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
