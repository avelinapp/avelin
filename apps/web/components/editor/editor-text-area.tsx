'use client'

import { type Monaco, default as MonacoEditor } from '@monaco-editor/react'
import { type editor, KeyCode, KeyMod } from 'monaco-editor'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useMonacoBinding } from '@/hooks/use-monaco-binding'
import { berkeleyMono } from '@/lib/fonts'
import { useCodeRoomStore } from '@/providers/code-room-provider'
import { Cursors } from './cursors'
import { avelinDark, avelinLight } from './themes'
import './cursors.css'
import { cn } from '@avelin/ui/cn'
import { shikiToMonaco } from '@shikijs/monaco'
import { useAnimate } from 'motion/react-mini'
import { useTheme } from 'next-themes'
import { createHighlighter } from 'shiki'
import { languages } from '@/lib/constants'
import reactDTsContent from './tsdefs/react/index.d.ts.txt'
import reactJsxRuntimeDTsContent from './tsdefs/react/jsx-runtime.d.ts.txt'

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

  // console.log('**** [EditorTextArea] RE-RENDER')

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

  const setupEditor = useCallback(
    async (
      editorInstance: editor.IStandaloneCodeEditor,
      monacoInstance: Monaco,
    ) => {
      editorInstance.focus()
      editorRef.current = editorInstance
      monacoRef.current = monacoInstance

      const highlighter = await createHighlighter({
        themes: [avelinLight, avelinDark],
        langs: languages.map((l) => l.value),
      })

      monacoInstance.languages.register({ id: 'tsx' })

      shikiToMonaco(highlighter, monacoInstance)

      monacoInstance.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
        {
          noSemanticValidation: false,
          noSyntaxValidation: false,
        },
      )

      monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions(
        {
          target: monacoInstance.languages.typescript.ScriptTarget.ES2016,
          allowNonTsExtensions: true,
          moduleResolution:
            monacoInstance.languages.typescript.ModuleResolutionKind.NodeJs,
          module: monacoInstance.languages.typescript.ModuleKind.CommonJS,
          noEmit: true,
          typeRoots: ['node_modules/@types'],
          jsx: monacoInstance.languages.typescript.JsxEmit.ReactJSX,
          jsxFactory: 'React.createElement',
          reactNamespace: 'React',
        },
      )

      monacoInstance.languages.typescript.typescriptDefaults.addExtraLib(
        reactDTsContent,
        'file:///node_modules/@types/react/index.d.ts',
      )

      monacoInstance.languages.typescript.typescriptDefaults.addExtraLib(
        reactJsxRuntimeDTsContent,
        'file:///node_modules/@types/react/jsx-runtime.d.ts',
      )

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
        {
          keybinding: KeyMod.CtrlCmd | KeyCode.BracketLeft,
          command: null,
        },
        {
          keybinding: KeyMod.CtrlCmd | KeyCode.BracketRight,
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
        theme="avelin-light"
        loading={null}
        defaultValue=""
        // defaultPath="file:///main.tsx"
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
