'use client'

import { buttonVariants } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import { inputVariants } from '@avelin/ui/input'
import { motion } from 'motion/react'
import type { RefObject } from 'react'

export function FormView({
  handleJoinWaitlist,
  ref,
}: { handleJoinWaitlist: () => void; ref: RefObject<HTMLDivElement> }) {
  return (
    <motion.div ref={ref} className="flex gap-4 w-[400px]">
      <motion.input
        className={cn(inputVariants(), 'w-[300px]')}
        placeholder="Email address"
        initial={{ opacity: 0, translateX: -15, scale: 0.95 }}
        animate={{
          opacity: 1,
          translateX: 0,
          scale: 1,
          transition: { delay: 0.1 },
        }}
        exit={{
          opacity: 0,
          translateX: -15,
          scale: 0.95,
        }}
        transition={{ ease: 'easeInOut' }}
        style={{ borderRadius: 10, zIndex: '1' }}
      />
      <motion.button
        layoutId="join-button"
        layout
        className={cn(
          buttonVariants({ variant: 'default' }),
          'bg-white hover:bg-white group w-full flex-1',
        )}
        style={{ borderRadius: 10, zIndex: '2' }}
        onClick={handleJoinWaitlist}
      >
        <motion.span layoutId="join-button-text" layout>
          Join
        </motion.span>
      </motion.button>
    </motion.div>
  )
}

export function SubmittingView({ ref }: { ref: RefObject<HTMLDivElement> }) {
  return (
    <motion.div ref={ref} className="flex gap-4 w-[400px] rounded-md">
      <motion.button
        layoutId="join-button"
        layout
        className={cn(
          buttonVariants({ variant: 'default' }),
          'bg-white group w-full flex-1 hover:bg-white',
        )}
        style={{ borderRadius: 10, zIndex: '2' }}
      >
        <motion.span layoutId="join-button-text" layout>
          Joining...
        </motion.span>
      </motion.button>
    </motion.div>
  )
}

export function SuccessView() {}
