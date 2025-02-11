'use client'

import { useMonacoBinding } from '@/hooks/use-monaco-binding'
import { jetbrainsMono } from '@/lib/fonts'
import { useCodeRoom } from '@/providers/code-room-provider'
import { type Monaco, default as MonacoEditor } from '@monaco-editor/react'
import { KeyCode, KeyMod, type editor } from 'monaco-editor'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Cursors } from './cursors'
import { themes } from './themes'
import './cursors.css'
import { cn } from '@avelin/ui/cn'
import { useAnimate } from 'motion/react-mini'
import { useTheme } from 'next-themes'

interface EditorProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  value?: string
  language?: string
}

export function EditorTextArea({ className }: EditorProps) {
  const { theme, systemTheme } = useTheme()

  const { ydoc, networkProvider, editorLanguage } = useCodeRoom()

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const [editorMounted, setEditorMounted] = useState(false)

  const [scope, animate] = useAnimate()

  useEffect(() => {
    if (editorMounted) {
      const newTheme = theme === 'system' ? systemTheme : theme
      monacoRef.current?.editor.setTheme(
        newTheme === 'dark' ? 'avelin-dark' : 'avelin-light',
      )
    }
  }, [editorMounted, theme, systemTheme])

  // biome-ignore lint/correctness/useExhaustiveDependencies: false
  const setupEditor = useCallback(
    (editorInstance: editor.IStandaloneCodeEditor, monacoInstance: Monaco) => {
      editorInstance.focus()
      editorRef.current = editorInstance
      monacoRef.current = monacoInstance

      monacoInstance.editor.defineTheme('avelin-dark', themes.dark)
      monacoInstance.editor.defineTheme('avelin-light', themes.light)

      const themeActual = theme === 'system' ? systemTheme : theme
      monacoInstance.editor.setTheme(
        themeActual === 'dark' ? 'avelin-dark' : 'avelin-light',
      )

      monacoInstance.editor.addKeybindingRules([
        {
          keybinding: KeyMod.CtrlCmd | KeyCode.KeyK,
          command: null,
        },
      ])

      setEditorMounted(true)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useMonacoBinding(
    editorMounted ? editorRef.current : null,
    ydoc,
    networkProvider,
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: false
  useEffect(() => {
    if (editorMounted) {
      animate(
        scope.current,
        { opacity: 1, filter: 'blur(0px)', scale: 1 },
        { ease: 'easeOut', duration: 0.2 },
      )
    }
  }, [editorMounted])

  return (
    <div
      ref={scope}
      className={cn(className, 'editor-text-area h-full w-full')}
      style={{ opacity: 0, filter: 'blur(2px)', scale: 0.995 }}
    >
      {networkProvider ? <Cursors provider={networkProvider} /> : null}
      <MonacoEditor
        width="100vw"
        theme="light"
        loading={null}
        defaultValue=""
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
