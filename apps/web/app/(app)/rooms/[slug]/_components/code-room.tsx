'use client'

const EditorTextArea = dynamic(
  () => import('@/components/editor/editor-text-area'),
  { ssr: false },
)

import { motion } from 'motion/react'
import dynamic from 'next/dynamic'
import { memo } from 'react'
import { EditorToolbar } from '@/components/editor/editor-toolbar'

export const CodeRoom = memo(__CodeRoom)

interface CodeRoomProps {
  skipAnimation?: boolean
}

function __CodeRoom({ skipAnimation }: CodeRoomProps) {
  // console.log('**** [CodeRoom] RE-RENDER')
  console.log('skipAnimation', skipAnimation)
  return (
    <div className="flex flex-col h-full w-full">
      <motion.div
        initial={
          skipAnimation ? {} : { opacity: 0, filter: 'blur(2px)', scale: 0.98 }
        }
        animate={
          skipAnimation
            ? {}
            : {
                opacity: 1,
                filter: 'blur(0px)',
                scale: 1,
                transition: { duration: 0.2, ease: 'easeOut' },
              }
        }
      >
        <EditorToolbar />
      </motion.div>
      <EditorTextArea className="flex-1" />
    </div>
  )
}

export default CodeRoom
