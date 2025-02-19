'use client'

import { type Language, languages } from '@/lib/constants'
import { env } from '@/lib/env'
import { useCreateRoom, useDeleteRoom } from '@/lib/mutations'
import { Room } from '@/lib/mutations.zero'
import { getQueryClient, queries } from '@/lib/queries'
import { useZero } from '@/lib/zero'
import { useView } from '@/providers/view-provider'
import type { Room as TRoom } from '@avelin/database'
import {
  CopyIcon,
  LinkIcon,
  PlusIcon,
  SquareArrowUpRightIcon,
  TrashIcon,
} from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import { FadeInContainer } from '@avelin/ui/fade-in-container'
import { useCopyToClipboard } from '@avelin/ui/hooks'
import { toast } from '@avelin/ui/sonner'
import { useQuery as useZeroQuery } from '@rocicorp/zero/react'
import { useQuery as useReactQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PostHogFeature } from 'posthog-js/react'
import { useEffect } from 'react'
import { useMemo } from 'react'
import { EmptyDashboardIcon } from './empty-state-icon'

export default function RoomsList() {
  return (
    <div className="flex-1 flex flex-col gap-4 h-full">
      <PostHogFeature
        className="flex-1 flex flex-col"
        flag="zero"
        match={false}
      >
        <RoomsList.Network />
      </PostHogFeature>
      <PostHogFeature className="flex-1 flex flex-col" flag="zero" match={true}>
        <RoomsList.Zero />
      </PostHogFeature>
    </div>
  )
}

RoomsList.Network = () => {
  const router = useRouter()
  const queryClient = getQueryClient()
  const createRoom = useCreateRoom({ queryClient })

  async function handleCreateRoom() {
    const data = await createRoom.mutateAsync()

    router.push(`/rooms/${data.slug}`)
  }

  const { data, error, isPending } = useReactQuery(queries.rooms.all())

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

RoomsList.Zero = () => {
  const router = useRouter()
  const { ready, setReady } = useView()

  const z = useZero()

  const q = z.query.rooms
    .where('deletedAt', 'IS', null)
    .related('roomParticipants', (q) =>
      q.where('userId', '=', z.userID).orderBy('lastAccessedAt', 'desc'),
    )

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
      lastAccessedAt: room.roomParticipants[0]?.lastAccessedAt ?? null,
    }))
    .sort((a, b) => {
      const x = a.lastAccessedAt ?? a.createdAt!
      const y = b.lastAccessedAt ?? b.createdAt!

      return y - x
    })

  const pageReady = rooms.length > 0 || status === 'complete'

  useEffect(() => {
    if (pageReady && !ready) {
      setReady(true)
    }
  }, [pageReady, setReady, ready])

  const dashboardIsEmpty = !rooms.length

  async function handleCreateRoom() {
    const room = await Room.create(z)

    if (!room) return

    router.push(`/rooms/${room.slug}`)
  }

  return (
    <div className={cn('flex-1 flex flex-col gap-4 h-full')}>
      <div>
        <Button
          className={cn(dashboardIsEmpty && 'hidden')}
          onClick={handleCreateRoom}
        >
          <PlusIcon className="size-fit" />
          Create
        </Button>
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
        ) : (
          rooms.map((room) => (
            // @ts-ignore
            <CodeRoomListItemZero key={room.id} room={room} />
          ))
        )}
      </div>
    </div>
  )
}

const CodeRoomListItem = ({
  room,
}: {
  room: Omit<TRoom, 'ydoc'> & { lastAccessedAt: Date | null }
}) => {
  const queryClient = getQueryClient()
  const deleteRoom = useDeleteRoom({ queryClient })

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
    <div className="group/item first:border-t hover:bg-color-background-2 border-b border-color-border-subtle px-4 h-12 flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2">
        {!!language?.logo && <LanguageIcon className="size-5 shrink-0" />}
        <span className="font-medium">
          {room.title && room.title.length >= 1 ? room.title : 'Untitled room'}
        </span>
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
          onClick={() => handleCopy(true)}
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

const CodeRoomListItemZero = ({
  room,
}: {
  room: Omit<TRoom, 'ydoc'> & { lastAccessedAt: Date | null }
}) => {
  const language = languages.find(
    (l) => l.value === (room.editorLanguage as Language['value']),
  )!

  const LanguageIcon = language.logo!

  const z = useZero()

  async function handleDeleteRoom() {
    await Room.delete(z, { id: room.id })
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
    <div className="group/item first:border-t hover:bg-color-background-2 border-b border-color-border-subtle px-4 h-12 flex items-center gap-2 justify-between">
      <div className="flex items-center gap-2">
        {!!language?.logo && <LanguageIcon className="size-5 shrink-0" />}
        <span className="font-medium">
          {room.title && room.title.length >= 1 ? room.title : 'Untitled room'}
        </span>
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
          onClick={() => handleCopy(true)}
        >
          <LinkIcon className="size-fit" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          tooltip={{
            content: 'Delete code room',
          }}
          onClick={handleDeleteRoom}
        >
          <TrashIcon className="size-4 shrink-0" />
        </Button>
      </div>
    </div>
  )
}
