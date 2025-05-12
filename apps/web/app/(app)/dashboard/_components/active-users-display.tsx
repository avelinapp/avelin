'use client'

import { Avatar, AvatarFallback } from '@avelin/ui/avatar'
import { cn } from '@avelin/ui/cn'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@avelin/ui/hover-card'
import type { Zero } from '@avelin/zero'
import { useMemo } from 'react'
import { UserAvatar, UsersListDisplay } from './user-avatar-list'

interface ActiveUsersDisplayProps {
  users: Array<Zero.Schema.User>
}

export function ActiveUsersDisplay({ users }: ActiveUsersDisplayProps) {
  const areAllUsersAnonymous = useMemo(
    () => users.every((u) => u.isAnonymous),
    [users],
  )

  const anonymousCount = useMemo(
    () => users.filter((u) => u.isAnonymous).length,
    [users],
  )

  return (
    <HoverCard openDelay={500} closeDelay={200}>
      <HoverCardTrigger asChild>
        <div className="dark:hover:brightness-[1.20] dark:data-[state=open]:brightness-[1.20] hover:brightness-[0.8] data-[state=open]:brightness-[0.8] transition-[filter]">
          <UsersListDisplay users={users} hideAnonymous="none" maxUsers={4} />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="rounded-sm flex flex-col gap-3 p-4 text-sm">
        <span className="font-[450] text-base">
          Active users{' '}
          <sup className="font-mono text-color-text-quaternary">
            {users.length}
          </sup>
        </span>
        <div
          className={cn(
            'flex flex-col gap-1.5',
            areAllUsersAnonymous && 'hidden',
          )}
        >
          {users
            .filter((u) => !u.isAnonymous)
            .map((user) => {
              return (
                <div key={user.id} className="inline-flex items-center gap-2">
                  <UserAvatar user={user} className="size-5" />
                  <span>{user.name}</span>
                </div>
              )
            })}
        </div>
        <span className="text-color-text-quaternary">
          {!areAllUsersAnonymous && '+'}
          {anonymousCount} anonymous user{anonymousCount > 1 ? 's' : ''}
        </span>
      </HoverCardContent>
    </HoverCard>
  )
}
