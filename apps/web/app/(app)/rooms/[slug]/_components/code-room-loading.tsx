import { ChevronLeftIcon, ChevronRightIcon, LogoAvelin } from '@avelin/icons'
import { Button, buttonVariants } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import { motion } from 'motion/react'
import Link from 'next/link'

interface LoadingRoomProps {
  status: 'pending' | 'invalid' | 'deleted' | 'complete'
  canCreateRoom?: boolean
}

export function LoadingRoom({ status, canCreateRoom }: LoadingRoomProps) {
  return (
    <motion.div
      layout
      className={cn(
        'relative flex flex-col items-center justify-center h-full w-full',
      )}
      initial={{ opacity: 0, filter: 'blur(2px)', scale: 0.95 }}
      animate={{
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
        // This delay is to prevent flashing the loading screen when the room loads quickly
        // Ideally, loading states should be avoided for fast operations.
        transition: { delay: 0.5 },
      }}
      exit={{ opacity: 0, filter: 'blur(2px)', scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <motion.div
        layout="position"
        className={cn('flex flex-col items-center justify-center gap-6 p-12')}
      >
        <motion.div layout="position">
          <LogoAvelin
            className={cn('size-24', status === 'pending' && 'animate-pulse')}
          />
        </motion.div>
        <motion.h1
          layout="position"
          className="text-4xl font-semibold tracking-[-0.02em] w-[600px] text-center"
        >
          {status === 'pending' ? (
            <LoadingHeader />
          ) : status === 'invalid' ? (
            <InvalidHeader />
          ) : status === 'deleted' ? (
            <DeletedHeader />
          ) : (
            ''
          )}
        </motion.h1>
        <motion.p
          layout="position"
          className="text-color-text-secondary mt-2 w-[600px] text-center"
        >
          {status === 'pending'
            ? "We're loading your code room..."
            : status === 'invalid'
              ? "We couldn't find the room you were looking for."
              : status === 'deleted'
                ? 'This code room has been deleted.'
                : ''}
        </motion.p>
      </motion.div>
      {(status === 'deleted' || status === 'invalid') && canCreateRoom && (
        <Button
          variant="secondary"
          asChild
          className="group hover:text-color-text-primary transition-colors flex items-center gap-1.5 hover-expand-12"
        >
          <Link href="/dashboard">
            <ChevronLeftIcon className="-ml-1 group-hover:-translate-x-0.5 transition-transform" />
            Dashboard
          </Link>
        </Button>
      )}
      {status === 'invalid' && (
        <motion.div
          layout="position"
          className="absolute bottom-[-10%] mask-b-to-85%"
          initial={{ opacity: 0, filter: 'blur(2px)', y: 100 }}
          animate={{
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: { delay: 0.5, ease: 'easeOut' },
          }}
        >
          <Error404 />
        </motion.div>
      )}
    </motion.div>
  )
}

const LoadingHeader = () => (
  <>
    Patience, <span className="text-secondary-text">young grasshopper.</span>
  </>
)

const DeletedHeader = () => (
  <>
    Be warned, <span className="text-secondary-text">the abyss is ahead.</span>
  </>
)

const InvalidHeader = () => (
  <>
    Oops! <span className="text-secondary-text">We ran into an issue.</span>
  </>
)

const Error404 = () => (
  <div className="text-[24rem] leading-none font-black tracking-tighter text-gray-4 select-none">
    404
  </div>
)
