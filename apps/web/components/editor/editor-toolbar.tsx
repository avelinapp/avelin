import { BaseColor, colors } from '@/lib/rooms'
import { type UserInfo } from '@/lib/sync'
import { Avatar, AvatarFallback, AvatarImage } from '@avelin/ui/avatar'
import { cn } from '@avelin/ui/cn'

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

function UsersList({
  users,
  maxUsers = 3,
}: {
  users: UserInfo[]
  maxUsers?: number
}) {
  const displayedUsers = users.slice(0, maxUsers)
  const remainingUsersCount = users.length - displayedUsers.length

  return (
    <div className='flex items-center'>
      {displayedUsers.map((user) => (
        <Avatar
          key={user.name}
          className={cn(
            'h-6 w-6 first:-ml-0 -ml-2 text-[11px] drop-shadow-sm border-[0.5px] border-white',
            colors[user.color as BaseColor].avatar_bg,
            colors[user.color as BaseColor].avatar_placeholder_text,
          )}
        >
          <AvatarFallback className='leading-none'>
            {user.name
              .split('-')
              .map((s) => s[0]?.toUpperCase())
              .join('')}
          </AvatarFallback>
        </Avatar>
      ))}
      <div className='h-6 w-6 leading-none rounded-full z-10 font-medium -ml-2 text-[11px] bg-gray-3 flex items-center justify-center'>
        <span>+{remainingUsersCount}</span>
      </div>
    </div>
  )
}

export function EditorToolbar() {
  return (
    <div className='flex items-center m-2 drop-shadow-sm h-12 py-2 px-4 max-w-full bg-white rounded-full border border-color-border-subtle'>
      <UsersList users={users} />
    </div>
  )
}
