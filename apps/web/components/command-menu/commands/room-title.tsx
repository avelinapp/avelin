import { useCodeRoomStore } from '@/providers/code-room-provider'
import { PencilIcon } from '@avelin/icons'
import { CommandItem, type CommandItemProps } from '@avelin/ui/command'
import { useEffect } from 'react'

export function RoomTitleRootCommand({ ...props }: CommandItemProps) {
  return (
    <CommandItem keywords={['title']} {...props}>
      <PencilIcon />
      Edit room title...
    </CommandItem>
  )
}

type Props = {
  closeMenu: () => void
  search: string
  setSearch: (search: string) => void
}

export function EditRoomTitleCommand({ closeMenu, search, setSearch }: Props) {
  const [roomTitle, setRoomTitle] = useCodeRoomStore((state) => [
    state.roomTitle,
    state.setRoomTitle,
  ])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setSearch(roomTitle ?? '')
  }, [setSearch])

  function save() {
    setRoomTitle(search)
    closeMenu()
  }

  return (
    <>
      <CommandItem onSelect={save} value={search} keywords={[search]}>
        <PencilIcon />
        <p className="text-color-text-primary">
          Change room title to{' '}
          <span className="text-color-text-quaternary">{`"${search}"`}</span>
        </p>
      </CommandItem>
    </>
  )
}
