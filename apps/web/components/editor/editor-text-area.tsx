'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Monaco, default as MonacoEditor } from '@monaco-editor/react'
import { editor, KeyCode, KeyMod } from 'monaco-editor'
import { useCodeRoom } from '@/providers/code-room-provider'
import { useMonacoBinding } from '@/hooks/use-monaco-binding'
import { jetbrainsMono } from '@/lib/fonts'
import { themes } from './themes'
import { Cursors } from './cursors'
import './cursors.css'
import { cn } from '@avelin/ui/cn'
import { useAnimate } from 'motion/react-mini'

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

  const [scope, animate] = useAnimate()

  const setupEditor = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor, monacoInstance: Monaco) => {
      editorInstance.focus()
      editorRef.current = editorInstance
      monacoRef.current = monacoInstance

      monacoInstance.editor.defineTheme('avelin-dark', themes.dark)
      monacoInstance.editor.defineTheme('avelin-light', themes.light)

      monacoInstance.editor.setTheme('avelin-light')

      monacoInstance.editor.addKeybindingRules([
        {
          keybinding: KeyMod.CtrlCmd | KeyCode.KeyK,
          command: null,
        },
      ])

      setEditorMounted(true)
    },
    [],
  )

  useMonacoBinding(
    editorMounted ? editorRef.current : null,
    ydoc,
    networkProvider,
  )

  useEffect(() => {
    if (editorMounted) {
      animate(
        scope.current,
        { opacity: 1, filter: 'blur(0px)', scale: 1 },
        { ease: 'easeOut', duration: 0.2 },
      )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorMounted])

  return (
    <div
      ref={scope}
      className={cn(className, 'editor-text-area h-full w-full')}
      style={{ opacity: 0, filter: 'blur(2px)', scale: 0.995 }}
    >
      {networkProvider ? <Cursors provider={networkProvider} /> : null}
      <MonacoEditor
        width='100vw'
        theme='light'
        loading={null}
        defaultValue=''
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
