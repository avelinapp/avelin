'use client'

import { CircleCheckBigIcon } from '@avelin/icons'
import { buttonVariants } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import { inputVariants } from '@avelin/ui/input'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { type RefObject, useMemo } from 'react'
import { sectionVariants } from './variants'

export function WaitlistForm({
  status,
  setStatus,
}: {
  status: 'idle' | 'submitting' | 'success' | 'error'
  setStatus: (status: 'idle' | 'submitting' | 'success' | 'error') => void
}) {
  function handleJoinWaitlist() {
    setStatus('submitting')
    setTimeout(() => {
      setStatus('success')

      // setTimeout(() => {
      //   setStatus('idle')
      // }, 2000)
    }, 3000)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const content = useMemo(() => {
    switch (status) {
      case 'idle':
      case 'error':
        return <FormView key="form" handleJoinWaitlist={handleJoinWaitlist} />
      case 'submitting':
        return (
          <SubmittingView
            key="submitting"
            handleJoinWaitlist={handleJoinWaitlist}
          />
        )
      case 'success':
        return <SuccessView key="success" />
    }
  }, [status])

  return (
    <motion.div
      className="flex flex-col items-center gap-2 sm:gap-6 !tracking-normal *:!tracking-normal"
      variants={sectionVariants}
    >
      <div className="w-[50px] h-[1px] bg-color-border-subtle mb-9 sm:mb-5" />
      <span className="text-xl text-white font-medium">
        Join the waitlist for early access.
      </span>
      <div className="w-[400px] h-14 flex-1">
        <AnimatePresence mode="popLayout" initial={false}>
          {content}
        </AnimatePresence>
      </div>
      <Link
        href="/readme"
        className="!tracking-normal text-color-text-quaternary sm:hover-expand-6 sm:blur-sm sm:hover:blur-none hover:text-white hover:underline transition-all"
      >
        Why are we building this?
      </Link>
    </motion.div>
  )
}

export function FormView({
  handleJoinWaitlist,
  ref,
}: {
  handleJoinWaitlist: () => void
  ref?: RefObject<HTMLDivElement>
}) {
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
        onKeyPress={(e) => {
          if (e.key !== 'Enter') return
          handleJoinWaitlist()
        }}
      />
      <motion.button
        layout
        layoutId="join-button"
        className={cn(
          buttonVariants({ variant: 'default' }),
          'bg-white group w-full flex-1',
        )}
        style={{ borderRadius: 10, zIndex: '2' }}
        onClick={handleJoinWaitlist}
      >
        <motion.span
          className="w-[75px]"
          layout="position"
          layoutId="join-button-text"
          exit={{ filter: 'blur(5px)' }}
        >
          Join
        </motion.span>
      </motion.button>
    </motion.div>
  )
}

export function SubmittingView({
  handleJoinWaitlist,
  ref,
}: {
  handleJoinWaitlist: () => void
  ref?: RefObject<HTMLDivElement>
}) {
  return (
    <motion.div ref={ref} className="flex gap-4 w-[400px]">
      <motion.button
        layoutId="join-button"
        layout
        className={cn(
          buttonVariants({ variant: 'default' }),
          'bg-white group w-full flex-1 hover:bg-white',
        )}
        style={{ borderRadius: 10, zIndex: '2' }}
        onClick={handleJoinWaitlist}
      >
        <motion.span
          className="w-[75px]"
          layout="position"
          layoutId="join-button-text"
          exit={{ filter: 'blur(5px)' }}
        >
          Joining...
        </motion.span>
      </motion.button>
    </motion.div>
  )
}

const CircleCheckIcon = motion.create(CircleCheckBigIcon)

export function SuccessView({ ref }: { ref?: RefObject<HTMLDivElement> }) {
  return (
    <motion.div ref={ref} className="flex gap-4 w-[400px]">
      <motion.button
        layoutId="join-button"
        layout
        className={cn(
          buttonVariants({ variant: 'default' }),
          'bg-green-9 group w-full flex-1 hover:bg-green-9 text-color-text-primary',
        )}
        style={{ borderRadius: 10, zIndex: '2' }}
      >
        <motion.span
          layout="position"
          layoutId="join-button-text"
          className="flex gap-2 items-center"
          exit={{ filter: 'blur(5px)' }}
        >
          <AnimatePresence>
            <motion.span key="text">You're on the waitlist.</motion.span>
            <CircleCheckIcon key="check" />
          </AnimatePresence>
        </motion.span>
      </motion.button>
    </motion.div>
  )
}
