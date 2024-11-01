'use client'

import { BaseColor, colors } from '@/lib/rooms'
import { type UserInfo } from '@/lib/sync'
import { Avatar, AvatarFallback } from '@avelin/ui/avatar'
import { Combobox } from '@avelin/ui/combobox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@avelin/ui/dropdown-menu'
import { Input } from '@avelin/ui/input'
import { cn } from '@avelin/ui/cn'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { languages } from '@/lib/constants'
import { Button } from '@avelin/ui/button'
import { CopyIcon } from '@avelin/icons'

const users: UserInfo[] = [
  {
    name: 'burnt-flamingo',
    color: colors.red.name,
    lastActive: Date.now(),
  },
  {
    name: 'toasty-llama',
    color: colors.orange.name,
    lastActive: Date.now(),
  },
  {
    name: 'salty-seahorse',
    color: colors.blue.name,
    lastActive: Date.now(),
  },
  {
    name: 'sunny-horse',
    color: colors.purple.name,
    lastActive: Date.now(),
  },
  {
    name: 'snowy-duck',
    color: colors.pink.name,
    lastActive: Date.now(),
  },
  {
    name: 'cool-cucumber',
    color: colors.green.name,
    lastActive: Date.now(),
  },
]

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
        'h-6 w-6 text-[11px] font-medium drop-shadow-sm border-[0.5px] border-white',
        colors[user.color as BaseColor].avatar_bg,
        className,
      )}
    >
      <AvatarFallback className='leading-none'>
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
      <div className='h-6 w-6 leading-none tabular-nums rounded-full z-10 font-medium -ml-2 text-[11px] bg-gray-3 flex items-center justify-center'>
        <span>+{remainingUsersCount}</span>
      </div>
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

function UsersList() {
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

const languageOptions = languages.map((l) => ({
  value: l.value,
  label: l.name,
  keywords: l.keywords,
}))

function EditorLanguage() {
  return (
    <div className='flex items-center gap-2'>
      <Combobox
        name='language'
        namePlural='languages'
        options={languageOptions}
        value='typescript'
      />
    </div>
  )
}

function CopyRoomURL() {
  return (
    <Button
      variant='secondary'
      size='xs'
      className='text-secondary-text'
    >
      <CopyIcon
        className='size-4 shrink-0 text-color-text-secondary'
        strokeWidth={2.25}
      />
      Copy URL
    </Button>
  )
}

export function EditorToolbar() {
  return (
    <div className='flex items-center m-2 drop-shadow-sm py-2 px-2 max-w-full bg-white rounded-lg border border-color-border-subtle'>
      <div className='w-full grid grid-cols-3'>
        <div className='flex items-center gap-4 place-self-start'>
          <UsersList />
          <CopyRoomURL />
        </div>
        <div className='place-self-center'>
          <Input
            size='xs'
            className='font-medium'
          />
        </div>
        <div className='place-self-end'>
          <EditorLanguage />
        </div>
      </div>
    </div>
  )
}
