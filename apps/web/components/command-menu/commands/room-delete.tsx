import { Room } from '@/lib/mutations.zero'
import { useCodeRoomStore } from '@/providers/code-room-provider'
import { Trash2Icon } from '@avelin/icons'
import { CommandItem } from '@avelin/ui/command'
import { useRouter } from 'next/navigation'

interface RoomDeleteCommandProps {
  closeMenu: () => void
}

export function RoomDeleteCommand({ closeMenu }: RoomDeleteCommandProps) {
  const [room] = useCodeRoomStore((state) => [state.room])
  const router = useRouter()

  async function deleteRoom() {
    if (!room) return
    await Room.delete({ id: room.id })
    router.push('/dashboard')
    closeMenu()
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
