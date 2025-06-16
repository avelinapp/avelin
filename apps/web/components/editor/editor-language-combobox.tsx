'use client'

import { Combobox } from '@avelin/ui/combobox'
import { memo } from 'react'
import { languages } from '@/lib/constants'
import { useCodeRoomStore } from '@/providers/code-room-provider'

const languageOptions = languages.map((l) => ({
  value: l.value,
  label: l.name,
  keywords: l.keywords,
}))

export const EditorLanguageCombobox = memo(__EditorLanguageCombobox)

function __EditorLanguageCombobox() {
  const [editorLanguage, setEditorLanguage] = useCodeRoomStore((state) => [
    state.editorLanguage,
    state.setEditorLanguage,
  ])

  // console.log('**** RE-RENDER')

  return (
    <div className="flex items-center gap-2">
      <Combobox
        name="language"
        namePlural="languages"
        options={languageOptions}
        value={editorLanguage}
        onValueChange={async (value) => {
          await setEditorLanguage(value)
        }}
        tooltip={{
          content: 'Change editor language',
          align: 'start',
        }}
      />
    </div>
  )
}
