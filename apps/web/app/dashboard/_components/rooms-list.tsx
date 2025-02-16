'use client'

import { type Language, languages } from '@/lib/constants'
import { useCreateRoom, useDeleteRoom } from '@/lib/mutations'
import { getQueryClient, queries } from '@/lib/queries'
import type { Room } from '@avelin/database'
import {
  LinkIcon,
  PlusIcon,
  SquareArrowUpRightIcon,
  TrashIcon,
} from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import { FadeInContainer } from '@avelin/ui/fade-in-container'
import type { ZeroSchema } from '@avelin/zero'
import { useZero, useQuery as useZeroQuery } from '@rocicorp/zero/react'
import { useQuery as useReactQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PostHogFeature } from 'posthog-js/react'
import { EmptyDashboardIcon } from './empty-state-icon'

export function RoomsListWrapper() {
  const router = useRouter()
  const queryClient = getQueryClient()
  const createRoom = useCreateRoom({ queryClient })

  async function handleCreateRoom() {
    const data = await createRoom.mutateAsync()

    router.push(`/rooms/${data.slug}`)
  }

  return (
    <div className="flex-1 flex flex-col gap-4 h-full">
      <PostHogFeature
        className="flex-1 flex flex-col"
        flag="zero"
        match={false}
      >
        <RoomsList handleCreateRoom={handleCreateRoom} />
      </PostHogFeature>
      <PostHogFeature className="flex-1 flex flex-col" flag="zero" match={true}>
        <RoomsListZero handleCreateRoom={handleCreateRoom} />
      </PostHogFeature>
    </div>
  )
}

function RoomsList({ handleCreateRoom }: { handleCreateRoom: () => void }) {
  const queryClient = getQueryClient()

  const { data, error, isPending } = useReactQuery(queries.rooms.all())
  const createRoom = useCreateRoom({ queryClient })

  const dashboardIsEmpty = !isPending && !error && !data.length

  return (
    <>
      <div className="flex-1 gap-4 flex flex-col">
        <div>
          <Button
            className={cn((isPending || dashboardIsEmpty) && 'hidden')}
            onClick={handleCreateRoom}
            disabled={createRoom.isPending}
          >
            <PlusIcon className="size-fit" />
            Create
          </Button>
        </div>
        {isPending ? null : error ? (
          <div>Error: {error.message}</div>
        ) : (
          <FadeInContainer className="h-full flex-1 flex flex-col gap-1">
            {dashboardIsEmpty ? (
              <div className="flex items-center gap-8 m-auto">
                <EmptyDashboardIcon className="size-32 stroke-gray-8 stroke-1" />
                <div className="space-y-4">
                  <p className="font-medium">Create or join a code room</p>
                  <div>
                    <p>
                      Your code rooms will be available to you from this
                      dashboard.
                    </p>
                    <p>You can get started by creating a code room.</p>
                  </div>
                  <Button
                    onClick={handleCreateRoom}
                    disabled={createRoom.isPending}
                  >
                    Create room
                  </Button>
                </div>
              </div>
            ) : (
              data.map((room) => <CodeRoomListItem key={room.id} room={room} />)
            )}
          </FadeInContainer>
        )}
      </div>
    </>
  )
}

function RoomsListZero({ handleCreateRoom }: { handleCreateRoom: () => void }) {
  const queryClient = getQueryClient()

  const createRoom = useCreateRoom({ queryClient })

  const z = useZero<ZeroSchema>()

  const q = z.query.rooms
    .where('deletedAt', 'IS', null)
    .related('roomParticipants', (q) =>
      q.where('userId', '=', z.userID).orderBy('lastAccessedAt', 'desc'),
    )

  let [rooms, roomsDetail] = useZeroQuery(q)

  rooms = rooms
    .filter(
      (room) =>
        (room.creatorId === z.userID &&
          !room.roomParticipants.find((rp) => rp.userId === z.userID)) ||
        !!room.roomParticipants.find((rp) => rp.userId === z.userID),
    )
    .map((room) => ({
      ...room,
      lastAccessedAt: room.roomParticipants[0]?.lastAccessedAt!,
    }))
    .sort((a, b) => b.lastAccessedAt - a.lastAccessedAt)

  const dashboardIsEmpty = !rooms.length

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div>
        <Button
          className={cn(dashboardIsEmpty && 'hidden')}
          onClick={handleCreateRoom}
          disabled={createRoom.isPending}
        >
          <PlusIcon className="size-fit" />
          Create
        </Button>
      </div>
      <div className="flex-1 h-full flex flex-col gap-1">
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
              <Button
                onClick={handleCreateRoom}
                disabled={createRoom.isPending}
              >
                Create room
              </Button>
            </div>
          </div>
        ) : (
          rooms.map((room) => (
            // @ts-ignore
            <CodeRoomListItem key={room.id} room={room} />
          ))
        )}
      </div>
    </div>
  )
}

const CodeRoomListItem = ({
  room,
}: {
  room: Omit<Room, 'ydoc'> & { lastAccessedAt: Date | null }
}) => {
  const queryClient = getQueryClient()
  const deleteRoom = useDeleteRoom({ queryClient })

  const language = languages.find(
    (l) => l.value === (room.editorLanguage as Language['value']),
  )!

  const LanguageIcon = language.logo!

  return (
    <div className="group/item first:border-t hover:bg-color-background-2 border-b border-color-border-subtle px-4 h-12 flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2">
        {!!language?.logo && <LanguageIcon className="size-5 shrink-0" />}
        <span className="font-medium">
          {room.title && room.title.length >= 1 ? room.title : 'Untitled room'}
        </span>
        {/* <span>{room.editorLanguage}</span> */}
      </div>
      <div className="hidden group-hover/item:flex items-center gap-1">
        <Button
          size="sm"
          asChild
          tooltip={{
            content: 'Open code room',
          }}
        >
          <Link href={`/rooms/${room.slug}`}>
            <SquareArrowUpRightIcon className="size-fit" />
          </Link>
        </Button>
        <Button
          size="sm"
          variant="secondary"
          tooltip={{
            content: 'Copy URL',
          }}
        >
          <LinkIcon className="size-fit" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          tooltip={{
            content: 'Delete code room',
          }}
          onClick={() => {
            deleteRoom.mutate({ roomId: room.id })
          }}
        >
          <TrashIcon className="size-4 shrink-0" />
        </Button>
      </div>
    </div>
  )
}
