import { Auth } from '@avelin/database'
import { Avatar, AvatarImage, AvatarFallback } from '@avelin/ui/avatar'
import { Button } from '@avelin/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@avelin/ui/dropdown-menu'

export function MyAccountDropdown({ user }: { user: Auth['user'] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='h-fit w-fit p-0 relative rounded-full bg-none hover:bg-none group'
        >
          <div className='z-10 absolute inset-0 rounded-full bg-gray-12/15 opacity-0 transition-opacity group-hover:opacity-100' />
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
      <DropdownMenuContent align='end'>
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
