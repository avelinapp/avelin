import { useEffect } from 'react'
import { editor } from 'monaco-editor'
import { MonacoBinding } from 'y-monaco'
import * as Y from 'yjs'
import { HocuspocusProvider } from '@hocuspocus/provider'

export function useMonacoBinding(
  editorInstance: editor.IStandaloneCodeEditor | null,
  ydoc: Y.Doc | null,
  networkProvider: HocuspocusProvider | undefined,
) {
  useEffect(() => {
    if (!editorInstance || !ydoc || !networkProvider) return

    const yText = ydoc.getText('monaco')
    const binding = new MonacoBinding(
      yText,
      editorInstance.getModel() as editor.ITextModel,
      new Set([editorInstance]),
      networkProvider.awareness,
    )

    return () => {
      binding.destroy()
    }
  }, [editorInstance, ydoc, networkProvider])
}
