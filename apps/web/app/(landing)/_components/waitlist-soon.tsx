import { XLogo } from '@avelin/icons'
import { motion } from 'motion/react'
import Link from 'next/link'
import { sectionVariants } from './variants'

export function WaitlistSoon() {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 sm:gap-6"
      variants={sectionVariants}
    >
      <div className="w-[50px] h-[1px] bg-color-border-subtle mb-9 sm:mb-5" />
      <div className="flex flex-col items-center gap-2 *:sm:text-xl *:text-base">
        <span className="text-white font-medium">
          Stay tuned for early access.
        </span>
        <span className="hidden sm:inline text-color-text-quaternary font-medium">
          We are getting ready for our private{' '}
          <span className="text-pink-9">alpha</span> launch.
        </span>
      </div>
      <Link
        href="https://x.com/kianbazza"
        className="mt-2 text-base sm:text-xl text-color-text-quaternary font-medium relative"
      >
        Follow me on{' '}
        <XLogo className="size-4 sm:size-5 inline-block relative translate-y-[-1px] text-white mx-[0.5px]" />{' '}
        <span className="text-white underline transition-colors decoration-transparent hover:decoration-white underline-offset-2 duration-150 ease-in">
          @kianbazza
        </span>{' '}
        for updates.
      </Link>
    </motion.div>
  )
}
