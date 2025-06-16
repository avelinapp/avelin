import { Trash2Icon } from '@avelin/icons'
import { CommandItem } from '@avelin/ui/command'
import { toast } from '@avelin/ui/sonner'
import { useRouter } from 'next/navigation'
import { languages } from '@/lib/constants'
import { Room } from '@/lib/mutations.zero'
import { useCodeRoomStore } from '@/providers/code-room-provider'

interface RoomDeleteCommandProps {
  closeMenu: () => void
}

export function RoomDeleteCommand({ closeMenu }: RoomDeleteCommandProps) {
  const [room, roomTitle, editorLanguage, toggleRoomDeleted, destroy] =
    useCodeRoomStore((state) => [
      state.room,
      state.roomTitle,
      state.editorLanguage,
      state.toggleRoomDeleted,
      state.destroy,
    ])
  const router = useRouter()

  function deleteRoom() {
    if (!room) return

    Room.delete({ id: room.id })
    toggleRoomDeleted(true)

    closeMenu()
    router.push('/dashboard')

    destroy()

    toast('Room deleted.', {
      description: () => {
        const language = languages.find((l) => l.value === editorLanguage)
        const Logo = language?.logo

        return (
          <div className="mt-2 flex items-center gap-2">
            {Logo && <Logo />}
            <span className="text-color-text-secondary max-w-full text-ellipsis">
              {roomTitle ?? 'Untitled room'}
            </span>
          </div>
        )
      },
    })
  }

  if (!room) return null

  return (
    <CommandItem
      onSelect={deleteRoom}
      value="delete-room"
      keywords={['room', 'delete room', 'remove']}
    >
      <Trash2Icon />
      <span className="text-color-text-quaternary">Delete room</span>
    </CommandItem>
  )
}
