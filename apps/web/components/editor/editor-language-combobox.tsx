import { languages } from '@/lib/constants'
import { useCodeRoom } from '@/providers/code-room-provider'
import { Combobox } from '@avelin/ui/combobox'
import { useEffect } from 'react'

const languageOptions = languages.map((l) => ({
  value: l.value,
  label: l.name,
  keywords: l.keywords,
}))

export function EditorLanguageCombobox() {
  const { editorLanguage, setEditorLanguage } = useCodeRoom()

  return (
    <div className='flex items-center gap-2'>
      <Combobox
        name='language'
        namePlural='languages'
        options={languageOptions}
        value={editorLanguage}
        onValueChange={(value) => {
          setEditorLanguage(value)
        }}
      />
    </div>
  )
}
