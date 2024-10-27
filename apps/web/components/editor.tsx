// components/Editor.tsx

'use client'

import { useRef, useState, useCallback } from 'react'
import { default as MonacoEditor } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import { useCodeRoom } from '@/providers/code-room-provider'
import { useMonacoBinding } from '@/hooks/use-monaco-binding'

interface EditorProps {
  value?: string
  language?: string
}

export default function Editor({
  value = '',
  language = 'javascript',
}: EditorProps) {
  const { ydoc, networkProvider } = useCodeRoom()

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [editorMounted, setEditorMounted] = useState(false)

  const setupEditor = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor) => {
      editorInstance.focus()
      editorRef.current = editorInstance
      setEditorMounted(true)
    },
    [],
  )

  useMonacoBinding(
    editorMounted ? editorRef.current : null,
    ydoc,
    networkProvider,
  )

  return (
    <MonacoEditor
      width='100vw'
      height='100vh'
      theme='light'
      language={language}
      value={value}
      onMount={setupEditor}
      options={{
        padding: { top: 30, bottom: 30 },
        fontSize: 16,
        fontLigatures: true,
        minimap: { enabled: false },
        renderLineHighlight: 'none',
      }}
    />
  )
}
