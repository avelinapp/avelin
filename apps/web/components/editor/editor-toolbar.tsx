import { type UserInfo } from '@/lib/sync'
import { Avatar, AvatarFallback, AvatarImage } from '@avelin/ui/avatar'

const users: UserInfo[] = [
  {
    name: 'User 1',
    color: '#f97316',
    lastActive: Date.now(),
  },
]

export function EditorToolbar() {
  return (
    <div className='flex items-center m-2 drop-shadow-sm h-12 py-2 px-4 max-w-full bg-white rounded-full border border-color-border-subtle'>
      <div className='flex items-center gap-2'>
        <Avatar className='size-5'>
          <AvatarImage src='https://picsum.photos/20' />
          <AvatarFallback>UI</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
