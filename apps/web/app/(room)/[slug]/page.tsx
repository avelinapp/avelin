'use client'

import { use, useCallback, useEffect, useRef, useState } from 'react'
import { Monaco, default as MonacoEditor } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import { useCodeRoom } from '@/providers/code-room-provider'
import { MonacoBinding } from 'y-monaco'

type Params = Promise<{ slug: string }>

export default function Page({ params }: { params: Params }) {
  const { slug } = use(params)
  const { initialize, destroy, ydoc, networkProvider } = useCodeRoom()

  useEffect(() => {
    initialize({
      id: 'room_0192ca62cc417bb8b07a49944961e033',
      slug,
    })

    return () => destroy()
  }, [initialize, destroy, slug])

  // useEffect(() => {
  //   if (!networkProvider) return
  //
  //   const timeout = setTimeout(() => {
  //     networkProvider.disconnect()
  //   }, 3000)
  //
  //   return () => clearTimeout(timeout)
  // }, [networkProvider])

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const [editorMounted, setEditorMounted] = useState(false)

  const setupEditor = useCallback(
    (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
      editor.focus()

      editorRef.current = editor
      monacoRef.current = monaco

      setEditorMounted(true)
    },
    [],
  )

  useEffect(() => {
    initialize({
      id: 'room_0192ca62cc417bb8b07a49944961e033',
      slug,
    })

    return () => destroy()
  }, [destroy, initialize, slug])

  useEffect(() => {
    if (!editorMounted || !editorRef.current || !networkProvider || !ydoc)
      return

    const yText = ydoc.getText('monaco')
    const binding = new MonacoBinding(
      yText,
      editorRef.current.getModel() as editor.ITextModel,
      new Set([editorRef.current!]),
      networkProvider.awareness,
    )

    return () => {
      binding.destroy()
    }
  }, [editorMounted, networkProvider, ydoc])

  return (
    <div>
      <MonacoEditor
        width='100vw'
        height='100vh'
        theme='light'
        // language={language}
        value=''
        onMount={setupEditor}
        options={{
          padding: {
            top: 30,
            bottom: 30,
          },
          fontSize: 16,
          // fontFamily: `${jetbrainsMono.style.fontFamily}`,
          fontLigatures: true,
          minimap: {
            enabled: false,
          },
          renderLineHighlight: 'none',
        }}
      />
    </div>
  )
}
