'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Monaco, default as MonacoEditor } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import { useCodeRoom } from '@/providers/code-room-provider'
import { useMonacoBinding } from '@/hooks/use-monaco-binding'
import { jetbrainsMono } from '@/lib/fonts'
import { themes } from './themes'
import { Cursors } from './cursors'
import './cursors.css'
import { cn } from '@avelin/ui/cn'

interface EditorProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  value?: string
  language?: string
}

export function EditorTextArea({ className }: EditorProps) {
  const { ydoc, networkProvider, editorLanguage } = useCodeRoom()

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const [editorMounted, setEditorMounted] = useState(false)

  const setupEditor = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor, monacoInstance: Monaco) => {
      console.log('Setting up editor...')
      editorInstance.focus()
      editorRef.current = editorInstance
      monacoRef.current = monacoInstance

      monacoInstance.editor.defineTheme('avelin-dark', themes.dark)
      monacoInstance.editor.defineTheme('avelin-light', themes.light)

      monacoInstance.editor.setTheme('avelin-light')

      setEditorMounted(true)
    },
    [],
  )

  useMonacoBinding(
    editorMounted ? editorRef.current : null,
    ydoc,
    networkProvider,
  )
  //
  // useEffect(() => {
  //   if (editorMounted && editorRef.current && monacoRef.current) {
  //     if (!!editorRef.current.getModel()) {
  //       monacoRef.current!.editor.setModelLanguage(
  //         editorRef.current.getModel()!,
  //         editorLanguage ?? 'plaintext',
  //       )
  //     }
  //   } else {
  //     console.log('Editor not mounted, do not change language.')
  //   }
  // }, [editorMounted, editorLanguage])

  return (
    <div className={cn(className, 'h-full w-full')}>
      {networkProvider ? <Cursors provider={networkProvider} /> : null}
      <MonacoEditor
        width='100vw'
        theme='light'
        loading={null}
        defaultValue=''
        defaultLanguage='plaintext'
        language={editorLanguage}
        onMount={setupEditor}
        options={{
          padding: { top: 16, bottom: 16 },
          fontSize: 16,
          fontFamily: `${jetbrainsMono.style.fontFamily}`,
          fontLigatures: true,
          minimap: { enabled: false },
          renderLineHighlight: 'none',
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  )
}

export default EditorTextArea
