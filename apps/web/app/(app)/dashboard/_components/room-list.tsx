'use client'

import { useRerender } from '@/hooks/use-rerender'
import { Room } from '@/lib/mutations.zero'
import { useZero } from '@/lib/zero'
import { useView } from '@/providers/view-provider'
import {
  ActivityIcon,
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
import { useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
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

  useHotkeys(
    '1',
    (e) => {
      e.preventDefault()
      setRoomsView('all')
    },
    { enableOnFormTags: false },
  )

  useHotkeys(
    '2',
    (e) => {
      e.preventDefault()
      setRoomsView('active')
    },
    { enableOnFormTags: false },
  )

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
              <ActivityIcon />
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
  const router = useRouter()

  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const containerRef = useRef<HTMLDivElement>(null)

  // Keep track of the last “selected” element so we can clear it
  const lastElRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const container = containerRef.current!
    const handleHoverIn = (e: Event) => {
      const target = e.target as HTMLElement
      const item =
        target.dataset.roomId !== undefined
          ? target
          : (target.closest('[data-room-id]') as HTMLElement)
      if (!item) return
      // console.log('handleHoverIn - with modality', modalityRef.current)
      select(item, 'pointer')
    }
    const handleHoverOut = (e: Event) => {
      const target = e.target as HTMLElement
      const item =
        target.dataset.roomId !== undefined
          ? target
          : (target.closest('[data-room-id]') as HTMLElement)
      if (!item) return
      // console.log('handleHoverOut - with modality', modalityRef.current)
      clearLast()
    }
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      const item =
        target.dataset.roomId !== undefined
          ? target
          : (target.closest('[data-room-id]') as HTMLElement)
      if (!item) return
      // console.log('handleFocusIn - with modality', modalityRef.current)
      select(item, 'keyboard')
    }
    const handleFocusOut = (e: FocusEvent) => {
      clearLast()
    }

    container.addEventListener('mouseover', handleHoverIn, true)
    container.addEventListener('mouseout', handleHoverOut, true)
    container.addEventListener('focusin', handleFocusIn, true)
    container.addEventListener('focusout', handleFocusOut, true)

    return () => {
      container.removeEventListener('mouseover', handleHoverIn, true)
      container.removeEventListener('mouseout', handleHoverOut, true)
      container.removeEventListener('focusin', handleFocusIn, true)
      container.removeEventListener('focusout', handleFocusOut, true)
    }
  }, [])

  useEffect(() => {
    const restore = () => {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const roomId = (history.state as any)?.lastKeyboardRoom
      const el = roomId && itemRefs.current[roomId]
      if (el) {
        // mark it selected + keyboardSelected
        el.dataset.selected = 'true'
        el.dataset.keyboardSelected = 'true'
        el.focus()
        lastElRef.current = el
      }
    }

    // restore on first render
    restore()
    // restore again whenever the user hits back/forward
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])

  // Imperatively set/clear the data-attributes
  function select(el: HTMLElement, modality: 'keyboard' | 'pointer') {
    clearLast()
    el.dataset.selected = 'true'
    if (modality === 'keyboard') {
      el.dataset.keyboardSelected = 'true'
      history.replaceState(
        {
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          ...(history.state as any),
          lastKeyboardRoom: el.dataset.roomId,
        },
        '',
      )
    }
    lastElRef.current = el
  }

  function clearLast() {
    const prev = lastElRef.current
    if (!prev) return
    prev.dataset.selected = undefined
    prev.dataset.keyboardSelected = undefined
    lastElRef.current = null
  }

  const z = useZero()

  async function preloadRoom(id: string) {
    const { cleanup, complete } = z.query.rooms
      .where('id', id)
      .related('roomParticipants')
      .preload({ ttl: '1d' })

    await complete

    console.log('Preloaded room', id)
  }

  // Global "j" / "k" handlers
  useHotkeys(
    'j',
    (e) => {
      e.preventDefault()
      const ids = rooms.map((r) => r.id)
      const activeEl = lastElRef.current as HTMLElement
      const currentId = Object.entries(itemRefs.current).find(
        ([, el]) => el === activeEl,
      )?.[0]
      const currentIdx = currentId ? ids.indexOf(currentId) : -1
      const nextIdx = Math.min(ids.length - 1, currentIdx + 1)
      itemRefs.current[ids[nextIdx]!]?.focus()
    },
    { enableOnFormTags: false },
    [rooms],
  )

  useHotkeys(
    'k',
    (e) => {
      e.preventDefault()
      const ids = rooms.map((r) => r.id)
      const activeEl = lastElRef.current as HTMLElement
      const currentId = Object.entries(itemRefs.current).find(
        ([, el]) => el === activeEl,
      )?.[0]
      const currentIdx = currentId ? ids.indexOf(currentId) : ids.length
      const prevIdx = Math.max(0, currentIdx - 1)
      itemRefs.current[ids[prevIdx]!]?.focus()
    },
    { enableOnFormTags: false },
    [rooms],
  )

  useHotkeys(
    'enter',
    (e) => {
      e.preventDefault()

      const roomId = lastElRef.current?.dataset.roomId
      if (!roomId) return

      const room = rooms.find((r) => r.id === roomId)
      if (!room) return

      router.push(`/rooms/${room.slug}`)
    },
    { enableOnFormTags: false },
    [rooms],
  )

  useHotkeys(
    'd',
    (e) => {
      e.preventDefault()

      const roomId = lastElRef.current?.dataset.roomId
      if (!roomId) return

      const room = rooms.find((r) => r.id === roomId)
      if (!room) return

      const ids = rooms.map((r) => r.id)
      const currentIdx = ids.indexOf(roomId)
      const nextIdx = Math.min(ids.length - 1, currentIdx + 1)

      Room.delete({ id: room.id })

      itemRefs.current[ids[nextIdx]!]?.focus()
    },
    { enableOnFormTags: false },
    [rooms],
  )

  // If the list changes, clear any stale refs
  useEffect(() => {
    const validIds = new Set(rooms.map((r) => r.id))
    for (const id of Object.keys(itemRefs.current)) {
      if (!validIds.has(id)) delete itemRefs.current[id]
    }
  }, [rooms])

  return (
    <div
      ref={containerRef}
      className="overflow-y-scroll overflow-x-hidden outline-none"
    >
      <div className="flex flex-col">
        {rooms.map((room) => {
          return (
            <RoomListItem
              room={room}
              view={view}
              preload={preloadRoom}
              key={room.id}
              ref={(el) => {
                itemRefs.current[room.id] = el
              }}
              data-room-id={room.id}
              tabIndex={0}
            />
          )
        })}
      </div>
    </div>
  )
}
