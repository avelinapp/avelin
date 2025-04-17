import { LogoAvelin } from '@avelin/icons'
import { cn } from '@avelin/ui/cn'
import { motion } from 'motion/react'

export function LoadingRoom() {
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
          <LogoAvelin className={cn('size-24 animate-pulse')} />
        </motion.div>
        <motion.h1
          layout="position"
          className="text-4xl font-semibold tracking-tighter w-[600px] text-center"
        >
          {/* {isPending ? <LoadingHeader /> : error ? <ErrorHeader /> : 'Done.'} */}
          <LoadingHeader />
        </motion.h1>
        <motion.p
          layout="position"
          className="text-color-text-secondary mt-2 w-[600px] text-center"
        >
          We're loading your code room...
          {/* {isPending && "We're loading your code room..."} */}
          {/* {error && "We couldn't find the room you were looking for."} */}
        </motion.p>
      </motion.div>
      {/* {error && (
        <motion.div layout="position">
          <CreateRoomButton />
        </motion.div>
      )}
      {error && (
        <motion.div
          layout="position"
          className="absolute bottom-[-175px]"
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
      )} */}
    </motion.div>
  )
}

const LoadingHeader = () => (
  <>
    Patience, <span className="text-secondary-text">young grasshopper.</span>
  </>
)

const ErrorHeader = () => (
  <>
    Oops! <span className="text-secondary-text">We ran into an issue.</span>
  </>
)

const Error404 = () => (
  <div className="text-[24rem] font-black tracking-tighter bg-gradient-to-b from-gray-4 to-gray-1 text-transparent bg-clip-text ">
    404
  </div>
)
