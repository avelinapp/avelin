'use client'

import { type Language, languages } from '@/lib/constants'
import { env } from '@/lib/env'
import { useCreateRoom, useDeleteRoom } from '@/lib/mutations'
import { getQueryClient, queries } from '@/lib/queries'
import { relativeTime } from '@/lib/utils'
import { useAuth } from '@/providers/auth-provider'
import type { Room as TRoom } from '@avelin/database'
import {
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
import { FadeInContainer } from '@avelin/ui/fade-in-container'
import { useCopyToClipboard } from '@avelin/ui/hooks'
import { toast } from '@avelin/ui/sonner'
import { ToggleGroup, ToggleGroupItem } from '@avelin/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@avelin/ui/tooltip'
import { useQuery as useReactQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import EmptyRooms from './empty-rooms'

export default function RoomsListNetwork() {
  const router = useRouter()
  const queryClient = getQueryClient()

  const createRoom = useCreateRoom({ queryClient })

  const [roomsDisplayType, setRoomsDisplayType] = useState<'list' | 'grid'>(
    'list',
  )
  const [roomsView, setRoomsView] = useState<'all' | 'active'>('all')

  async function handleCreateRoom() {
    const data = await createRoom.mutateAsync()

    router.push(`/rooms/${data.slug}`)
  }

  const { data, error, isPending } = useReactQuery(queries.rooms.all())

  const dashboardIsEmpty = !isPending && !error && !data.length

  return (
    <div className={cn('flex-1 flex flex-col gap-6 h-full select-none')}>
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
            <ToggleGroupItem className="group" value="active" disabled>
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
            <ToggleGroupItem value="grid" disabled>
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
      {isPending ? null : error ? (
        <div>{error.message}</div>
      ) : (
        <FadeInContainer className="flex-1 h-full flex flex-col gap-1">
          {dashboardIsEmpty ? (
            <EmptyRooms
              handleCreateRoom={handleCreateRoom}
              disabled={createRoom.isPending}
            />
          ) : roomsDisplayType === 'list' ? (
            <CodeRoomListView rooms={data} />
          ) : null}
        </FadeInContainer>
      )}
    </div>
  )
}

type Room = Omit<TRoom, 'ydoc'> & { lastAccessedAt: Date | null }

const CodeRoomListView = ({ rooms }: { rooms: Array<Room> }) => {
  return (
    <div className="grid grid-cols-[max-content_max-content_max-content_minmax(0,_1fr)] gap-y-1">
      {rooms.map((room) => (
        // @ts-ignore
        <CodeRoomListItem key={room.id} room={room} />
      ))}
    </div>
  )
}

const CodeRoomListItem = ({
  room,
}: {
  room: Room
}) => {
  const queryClient = getQueryClient()
  const deleteRoom = useDeleteRoom({ queryClient })

  const router = useRouter()

  const language = languages.find(
    (l) => l.value === (room.editorLanguage as Language['value']),
  )!

  const LanguageIcon = language.logo!

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
      className="group/item rounded-md hover:bg-gray-3 px-4 h-12 grid grid-cols-subgrid col-span-4 items-center gap-x-4 w-full"
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
        {relativeTime(room.lastAccessedAt ?? room.createdAt)}
      </span>
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
          disabled={deleteRoom.isPending}
          onClick={(e) => {
            e.stopPropagation()
            deleteRoom.mutate({ roomId: room.id })
          }}
        >
          <TrashIcon className="size-4 shrink-0 dark:text-gray-12 text-primary-text" />
        </Button>
      </div>
    </div>
  )
}
