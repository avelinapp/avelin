'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@avelin/ui/avatar'
import { cn } from '@avelin/ui/cn'
import type { Zero } from '@avelin/zero'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'

type UsersListDisplayProps = {
  users: Array<Zero.Schema.User>
  maxUsers?: number
  layoutId?: string
}

const UserAvatar = ({
  user,
  className,
}: {
  user: Zero.Schema.User
  className?: string
}) => {
  return (
    <Avatar
      key={user.id}
      className={cn(
        'h-6 w-6 text-[11px] font-medium drop-shadow-sm border-[1.5px] border-white dark:border-color-background-2 text-primary-text',
        (user.isAnonymous || !user.picture) && 'bg-gray-11',
        className,
      )}
    >
      {user.picture && <AvatarImage src={user.picture} />}
      <AvatarFallback className="leading-none">
        {user.name
          .split(' ')
          .map((s) => s[0]?.toUpperCase())
          .join('')}
      </AvatarFallback>
    </Avatar>
  )
}

export const UsersListDisplay = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'> & UsersListDisplayProps
>(({ users, maxUsers = 3, layoutId, ...props }, ref) => {
  const displayedUsers = users.slice(0, maxUsers)
  const remainingUsersCount = users.length - displayedUsers.length

  return (
    <div ref={ref} className="flex items-center select-none h-8" {...props}>
      <LayoutGroup id={layoutId}>
        <AnimatePresence initial={false} mode="popLayout">
          {displayedUsers.map((user) => (
            <motion.div
              layout
              key={`${user.id}-${layoutId}`}
              className="first:-ml-0 -ml-2.5"
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
              key="remaining"
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
              <div className="h-6 w-6 leading-none tabular-nums border-[1.5px] border-white dark:border-color-background-2 rounded-full z-10 font-medium -ml-2.5 text-[11px] bg-gray-3 dark:bg-gray-11 flex items-center justify-center">
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
