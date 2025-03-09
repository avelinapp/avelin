'use client'

import { useMonacoBinding } from '@/hooks/use-monaco-binding'
import { berkeleyMono } from '@/lib/fonts'
import { useCodeRoomStore } from '@/providers/code-room-provider'
import { type Monaco, default as MonacoEditor } from '@monaco-editor/react'
import { KeyCode, KeyMod, type editor } from 'monaco-editor'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
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

export const EditorTextArea = memo(__EditorTextArea)

function __EditorTextArea({ className }: EditorProps) {
  const { theme, systemTheme } = useTheme()

  const [ydoc, networkProvider, editorLanguage] = useCodeRoomStore((state) => [
    state.ydoc,
    state.networkProvider,
    state.editorLanguage,
  ])

  console.log('**** [EditorTextArea] RE-RENDER')

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
        {
          keybinding: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyD,
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
          fontFamily: `${berkeleyMono.style.fontFamily}`,
          letterSpacing: -0.25,
          fontLigatures: true,
          minimap: { enabled: false },
          renderLineHighlight: 'none',
          scrollBeyondLastLine: false,
          scrollbar: {
            vertical: 'hidden',
          },
        }}
      />
    </div>
  )
}

export default EditorTextArea
