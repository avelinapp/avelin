import { languages } from '@/lib/constants'
import { useCodeRoomStore } from '@/providers/code-room-provider'
import { ChevronRightIcon, CodeXmlIcon } from '@avelin/icons'
import { CommandItem, type CommandItemProps } from '@avelin/ui/command'

export function ChangeEditorLanguageRootCommand({
  ...props
}: CommandItemProps) {
  return (
    <CommandItem keywords={['editor', 'language', 'change']} {...props}>
      <CodeXmlIcon />
      Change editor language...
    </CommandItem>
  )
}

interface Props {
  closeMenu: () => void
}

export function ChangeEditorLanguageCommands({ closeMenu }: Props) {
  const [setEditorLanguage] = useCodeRoomStore((state) => [
    state.setEditorLanguage,
  ])
  return (
    <>
      {languages.map((language) => (
        <CommandItem
          key={language.value}
          value={language.value}
          keywords={language.keywords}
          onSelect={(value) => {
            setEditorLanguage(value)
            closeMenu()
          }}
        >
          <CodeXmlIcon />
          <span className="text-color-text-quaternary">Change language</span>
          <ChevronRightIcon className="!h-3 !w-3" />
          {language.name}
        </CommandItem>
      ))}
    </>
  )
}
