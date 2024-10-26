'use client'

import { sync } from '@/lib/sync'
import { use, useEffect, useRef, useState } from 'react'
import { Monaco, default as MonacoEditor } from '@monaco-editor/react'
import { useCodeRoom } from '@/providers/code-room-provider'

type Params = Promise<{ slug: string }>

export default function Page({ params }: { params: Params }) {
  const { slug } = use(params)
  const { initialize } = useCodeRoom()

  useEffect(() => {
    initialize({
      id: 'room_0192ca62cc417bb8b07a49944961e033',
      slug,
    })
  }, [])

  return (
    <div>
      <MonacoEditor
        width='100vw'
        height='100vh'
        theme='light'
        // language={language}
        value=''
        // onMount={setupEditor}
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
