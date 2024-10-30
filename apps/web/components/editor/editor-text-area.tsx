'use client'

import { useRef, useState, useCallback } from 'react'
import { Monaco, default as MonacoEditor } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import { useCodeRoom } from '@/providers/code-room-provider'
import { useMonacoBinding } from '@/hooks/use-monaco-binding'
import { jetbrainsMono } from '@/lib/fonts'
import { themes } from './themes'
import { Cursors } from './cursors'
import './style.css'

interface EditorProps {
  value?: string
  language?: string
}

export function EditorTextArea({
  value = '',
  language = 'javascript',
}: EditorProps) {
  const { ydoc, networkProvider } = useCodeRoom()

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [editorMounted, setEditorMounted] = useState(false)

  const setupEditor = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor, monacoRef: Monaco) => {
      editorInstance.focus()
      editorRef.current = editorInstance

      monacoRef.editor.defineTheme('avelin-dark', themes.dark)
      monacoRef.editor.defineTheme('avelin-light', themes.light)

      monacoRef.editor.setTheme('avelin-light')

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
    <>
      {networkProvider ? <Cursors provider={networkProvider} /> : null}
      <MonacoEditor
        width='100vw'
        height='100vh'
        theme='light'
        loading={null}
        language={language}
        value={value}
        onMount={setupEditor}
        options={{
          padding: { top: 30, bottom: 30 },
          fontSize: 16,
          fontFamily: `${jetbrainsMono.style.fontFamily}`,
          fontLigatures: true,
          minimap: { enabled: false },
          renderLineHighlight: 'none',
        }}
      />
    </>
  )
}

export default EditorTextArea
