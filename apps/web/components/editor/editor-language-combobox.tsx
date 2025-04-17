'use client'

import { languages } from '@/lib/constants'
import { useZero } from '@/lib/zero'
import { useCodeRoomStore } from '@/providers/code-room-provider'
import { Combobox } from '@avelin/ui/combobox'
import { useQuery } from '@rocicorp/zero/react'
import { memo, useEffect } from 'react'

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
