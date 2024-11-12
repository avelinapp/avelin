'use client'

import { useLogout } from '@/lib/mutations'
import { Auth } from '@avelin/database'
import {
  HouseIcon,
  KeyRoundIcon,
  LogOutIcon,
  SettingsIcon,
} from '@avelin/icons'
import { Avatar, AvatarImage, AvatarFallback } from '@avelin/ui/avatar'
import { Button } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@avelin/ui/dropdown-menu'
import { toast } from '@avelin/ui/sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function MyAccountDropdown({ user }: { user: Auth['user'] }) {
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const logout = useLogout()

  const handleLogout = async () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        toast('Logged out.', {
          icon: <KeyRoundIcon className='size-4 shrink-0' />,
        })
        router.push('/login')
      },
      onError: (err) => {
        toast.error('Failed to log out.', {
          icon: <KeyRoundIcon className='size-4 shrink-0' />,
          description: err.message,
        })
      },
    })
  }

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='h-fit w-fit p-0 relative rounded-full bg-none hover:bg-none group'
        >
          <div
            className={cn(
              'z-10 absolute inset-0 rounded-full bg-gray-12/15 opacity-0 transition-opacity group-hover:opacity-100',
              open && 'opacity-100',
            )}
          />
          <Avatar className='size-7 shrink-0'>
            <AvatarImage src={user?.picture ?? undefined} />
            <AvatarFallback className='leading-none bg-gray-3 text-sm'>
              {user.name
                .split(' ')
                .map((s) => s[0]?.toUpperCase())
                .join('')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='min-w-[200px]'
      >
        <DropdownMenuItem className='justify-between gap-4 focus:bg-transparent'>
          <Avatar className='size-7 shrink-0'>
            <AvatarImage src={user?.picture ?? undefined} />
            <AvatarFallback className='leading-none bg-gray-3 text-sm'>
              {user.name
                .split(' ')
                .map((s) => s[0]?.toUpperCase())
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col gap-1'>
            <span className='font-medium text-color-text-primary'>
              {user.name}
            </span>
            <span className='text-color-text-quaternary'>{user.email}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='group'
          asChild
        >
          <Link href={`/dashboard`}>
            <HouseIcon
              strokeWidth={2.25}
              className='size-4 shrink-0 group-hover:text-color-text-primary'
            />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='group'
          asChild
        >
          <Link href={`/settings`}>
            <SettingsIcon
              strokeWidth={2.25}
              className='size-4 shrink-0 group-hover:text-color-text-primary'
            />
            Preferences
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='group'
          onClick={handleLogout}
        >
          <LogOutIcon
            strokeWidth={2.25}
            className='size-4 shrink-0'
          />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
