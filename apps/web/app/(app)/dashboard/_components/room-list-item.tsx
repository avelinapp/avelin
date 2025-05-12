'use client'

import { type Language, languages } from '@/lib/constants'
import { env } from '@/lib/env'
import { Room } from '@/lib/mutations.zero'
import { relativeTime } from '@/lib/utils'
import { useZero } from '@/lib/zero'
import { ActivityIcon, CopyIcon, LinkIcon, Trash2Icon } from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@avelin/ui/context-menu'
import { useCopyToClipboard } from '@avelin/ui/hooks'
import { toast } from '@avelin/ui/sonner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@avelin/ui/tooltip'
import type { Zero } from '@avelin/zero'
import { useQuery as useZeroQuery } from '@rocicorp/zero/react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { ActiveUsersDisplay } from './active-users-display'
import { UsersListDisplay } from './user-avatar-list'

type RoomListItemProps = {
  view: 'active' | 'all' | 'hidden'
  room: Zero.Schema.Room &
    Pick<Zero.Schema.RoomParticipant, 'lastAccessedAt'> & {
      roomParticipants: Array<
        Zero.Schema.RoomParticipant & { user: Zero.Schema.User }
      >
      connections: Array<Zero.Schema.RoomConnection>
    }
  preload: (id: string) => Promise<void>
} & React.ComponentProps<'div'>

export const RoomListItem = ({
  view,
  room,
  preload,
  className,
  ...props
}: RoomListItemProps) => {
  const router = useRouter()
  const z = useZero()

  const language = languages.find(
    (l) => l.value === (room.editorLanguage as Language['value']),
  )!

  const LanguageIcon = language.logo

  const participants = room.roomParticipants.map((rp) => rp.user)

  const activeParticipants = participants.filter((u) =>
    room.connections.some((conn) => conn.userId === u.id && conn.isActive),
  )
  const isRoomActive = activeParticipants.length > 0

  const isRoomCreator = room.creatorId === z.userID

  // Find the room creator
  const [creator] = useZeroQuery(
    z.query.users.where('id', room.creatorId ?? '').one(),
  )

  // If the creator is not in the list of room participants, add them
  if (
    creator &&
    creator.id !== 'user_system' &&
    !participants.find((u) => u.id === creator.id)
  ) {
    participants.push(creator)
  }

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
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={cn(
            'group/item px-4 h-12 flex items-center rounded-md gap-x-4 w-full justify-between border border-transparent data-[state=open]:bg-gray-2 data-[selected=true]:bg-gray-2 data-[keyboard-selected=true]:border-color-border-subtle outline-none',
            className,
          )}
          onClick={() => router.push(`/rooms/${room.slug}`)}
          onMouseEnter={() => preload(room.id)}
          onFocus={() => preload(room.id)}
          {...props}
        >
          <div className="flex items-center gap-4">
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
              {room.title && room.title.length >= 1
                ? room.title
                : 'Untitled room'}
            </span>
            {view === 'active' && (
              <ActiveUsersDisplay users={activeParticipants} />
            )}
            {view === 'all' && isRoomActive && (
              <div className="flex items-center gap-1.5 text-xs font-medium rounded-md bg-green-5 px-2 py-0.5">
                <ActivityIcon className="size-3" />
                Active
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-color-text-quaternary ml-4">
              {relativeTime(room.lastAccessedAt ?? room.createdAt!)}
            </span>
            <div className="flex items-center gap-2">
              {view === 'active' && (
                <UsersListDisplay
                  users={participants}
                  hideAnonymous="display"
                  maxUsers={4}
                />
              )}
              {view === 'all' && (
                <UsersListDisplay
                  users={participants}
                  hideAnonymous="display"
                  maxUsers={4}
                />
              )}
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => handleCopy(true)}>
          <LinkIcon />
          Copy link
        </ContextMenuItem>
        <ContextMenuItem onSelect={handleDeleteRoom}>
          <Trash2Icon /> Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
