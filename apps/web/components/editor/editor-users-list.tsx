'use client'

import { BaseColor, colors } from '@/lib/rooms'
import { type UserInfo } from '@/lib/sync'
import { Avatar, AvatarFallback, AvatarImage } from '@avelin/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@avelin/ui/dropdown-menu'
import { cn } from '@avelin/ui/cn'
import { ComponentPropsWithoutRef, forwardRef, useState } from 'react'
import { useCodeRoom } from '@/providers/code-room-provider'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Button } from '@avelin/ui/button'
import { ChevronDownIcon } from '@avelin/icons'
import { useNetworkStatus } from '@avelin/ui/hooks'

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
        'h-6 w-6 text-[11px] font-medium drop-shadow-sm border-[1.5px] border-white text-primary-text',
        colors[user.color as BaseColor].avatar_bg,
        className,
      )}
    >
      {user.picture && <AvatarImage src={user.picture} />}
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
      <LayoutGroup>
        <AnimatePresence
          initial={false}
          mode='popLayout'
        >
          {displayedUsers.map((user) => (
            <motion.div
              layout
              key={user.name}
              className='first:-ml-0 -ml-2.5'
              initial={{
                opacity: 0,
                filter: 'blur(2px)',
                transform: 'translateX(10px)',
              }}
              animate={{
                opacity: 1,
                filter: 'blur(0px)',
                transform: 'translateX(0px)',
              }}
              exit={{
                opacity: 0,
                filter: 'blur(2px)',
                transform: 'translateX(10px)',
              }}
              transition={{
                duration: 0.2,
                ease: 'easeOut',
              }}
            >
              <UserAvatar user={user} />
            </motion.div>
          ))}
          {remainingUsersCount > 0 && (
            <motion.div
              layout
              key='remaining'
              initial={{
                opacity: 0,
                filter: 'blur(2px)',
                transform: 'translateX(-1px)',
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                filter: 'blur(0px)',
                transform: 'translateX(0px)',
                scale: 1,
              }}
              exit={{
                opacity: 0,
                filter: 'blur(2px)',
                transform: 'translateX(-1px)',
                scale: 0.8,
              }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
            >
              <div className='h-6 w-6 leading-none tabular-nums border-[1.5px] border-white rounded-full z-10 font-medium -ml-2.5 text-[11px] bg-gray-3 flex items-center justify-center'>
                <span>+{remainingUsersCount}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
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
  const [open, setOpen] = useState(false)
  const { users: roomUsers } = useCodeRoom()
  const { isOnline } = useNetworkStatus()

  const users = Array.from(roomUsers.values())

  if (!isOnline || !users || !users.length) return null

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button
          size='xs'
          variant='ghost'
          className={cn(
            'flex items-center justify-between gap-2',
            open && 'bg-secondary-bg text-secondary-text',
          )}
        >
          <UsersListDisplay users={users} />
          <ChevronDownIcon className='group-hover:visible text-secondary-text' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
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
