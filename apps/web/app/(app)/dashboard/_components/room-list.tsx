'use client'

import { useRerender } from '@/hooks/use-rerender'
import { Room } from '@/lib/mutations.zero'
import { useZero } from '@/lib/zero'
import { useView } from '@/providers/view-provider'
import {
  CircleDotIcon,
  LayersIcon,
  LayoutGridIcon,
  LayoutListIcon,
  PlusIcon,
} from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import { ToggleGroup, ToggleGroupItem } from '@avelin/ui/toggle-group'
import type { Zero } from '@avelin/zero'
import { useQuery as useZeroQuery } from '@rocicorp/zero/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import EmptyRooms from './empty-rooms'
import { RoomListItem } from './room-list-item'

export default function RoomList() {
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
      <div className="flex flex-col gap-y-1">
        {rooms.map((room) => (
          <RoomListItem
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
