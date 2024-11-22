import { languages } from '@/lib/constants'
import { useCodeRoom } from '@/providers/code-room-provider'
import { ChevronRightIcon, CodeXmlIcon } from '@avelin/icons'
import { CommandItem } from '@avelin/ui/command'

interface Props {
  closeMenu: () => void
}

export function ChangeEditorLanguageCommands({ closeMenu }: Props) {
  const { setEditorLanguage } = useCodeRoom()
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
          <span className='text-color-text-quaternary'>Change language</span>
          <ChevronRightIcon className='!h-3 !w-3' />
          {language.name}
        </CommandItem>
      ))}
    </>
  )
}
