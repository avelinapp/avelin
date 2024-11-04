'use client'

import { BaseColor, colors } from '@/lib/rooms'
import { type UserInfo } from '@/lib/sync'
import { Avatar, AvatarFallback } from '@avelin/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@avelin/ui/dropdown-menu'
import { cn } from '@avelin/ui/cn'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { useCodeRoom } from '@/providers/code-room-provider'

type UsersListDisplayProps = {
  users: UserInfo[]
  maxUsers?: number
}

const UserAvatar = ({
  user,
  className,
}: {
  user: UserInfo
  className?: string
}) => {
  return (
    <Avatar
      key={user.name}
      className={cn(
        'h-6 w-6 text-[11px] font-medium drop-shadow-sm border-[0.5px] border-white text-primary-text',
        colors[user.color as BaseColor].avatar_bg,
        className,
      )}
    >
      <AvatarFallback className='leading-none animate-in zoom-in-95 fade-in-0 slide-in-from-left-2 ease-out'>
        {user.name
          .split('-')
          .map((s) => s[0]?.toUpperCase())
          .join('')}
      </AvatarFallback>
    </Avatar>
  )
}

const UsersListDisplay = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'> & UsersListDisplayProps
>(({ users, maxUsers = 3, ...props }, ref) => {
  const displayedUsers = users.slice(0, maxUsers)
  const remainingUsersCount = users.length - displayedUsers.length

  return (
    <div
      ref={ref}
      className='flex items-center select-none h-8'
      {...props}
    >
      {displayedUsers.map((user) => (
        <UserAvatar
          key={user.name}
          user={user}
          className='first:-ml-0 -ml-2'
        />
      ))}
      {remainingUsersCount > 0 && (
        <div className='h-6 w-6 leading-none tabular-nums rounded-full z-10 font-medium -ml-2 text-[11px] bg-gray-3 flex items-center justify-center'>
          <span>+{remainingUsersCount}</span>
        </div>
      )}
    </div>
  )
})

UsersListDisplay.displayName = 'UsersListDisplay'

function UsersListMenu({ users }: { users: UserInfo[] }) {
  return (
    <>
      {users.map((user) => (
        <DropdownMenuItem
          className='flex items-center gap-2'
          key={user.name}
        >
          <UserAvatar user={user} />
          <span className='text-sm'>{user.name}</span>
        </DropdownMenuItem>
      ))}
    </>
  )
}

export function UsersList() {
  const { users: roomUsers } = useCodeRoom()

  const users = Array.from(roomUsers.values())

  if (!users || !users.length) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UsersListDisplay users={users} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='start'
        className='min-w-[200px]'
      >
        <DropdownMenuGroup title='Active users'>
          <DropdownMenuLabel>Active Users</DropdownMenuLabel>
          <UsersListMenu users={users} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
