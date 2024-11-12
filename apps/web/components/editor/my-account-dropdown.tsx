import { Auth } from '@avelin/database'
import { LogOutIcon } from '@avelin/icons'
import { Avatar, AvatarImage, AvatarFallback } from '@avelin/ui/avatar'
import { Button } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@avelin/ui/dropdown-menu'
import { useState } from 'react'

export function MyAccountDropdown({ user }: { user: Auth['user'] }) {
  const [open, setOpen] = useState(false)

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
        <DropdownMenuItem>
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
