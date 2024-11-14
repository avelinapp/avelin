'use client'

const EditorTextArea = dynamic(
  () => import('@/components/editor/editor-text-area'),
  { ssr: false },
)
import { EditorToolbar } from '@/components/editor/editor-toolbar'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

export default function CodeRoom() {
  return (
    <div className='flex flex-col h-full w-full'>
      <motion.div
        initial={{ opacity: 0, filter: 'blur(2px)', scale: 0.98 }}
        animate={{
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1,
          transition: { duration: 0.2, ease: 'easeOut' },
        }}
      >
        <EditorToolbar />
      </motion.div>
      <EditorTextArea className='flex-1' />
    </div>
  )
}