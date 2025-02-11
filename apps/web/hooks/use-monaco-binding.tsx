import type { HocuspocusProvider } from '@hocuspocus/provider'
import type { editor } from 'monaco-editor'
import { useEffect } from 'react'
import { MonacoBinding } from 'y-monaco'
import type * as Y from 'yjs'

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
