import { DiscordLogo, XLogo } from '@avelin/icons'
import { motion } from 'motion/react'
import Link from 'next/link'

export default function WaitlistConfirmation() {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 sm:gap-6"
      initial={{
        opacity: 0,
        scale: 0.99,
        translateY: 5,
        filter: 'blur(2px)',
      }}
      animate={{
        opacity: 1,
        scale: 1,
        translateY: 0,
        filter: 'blur(0px)',
        transition: {
          duration: 0.4,
          ease: 'easeOut',
        },
      }}
    >
      <div className="w-[50px] h-[1px] bg-color-border-subtle mb-9 sm:mb-5" />
      <span className="text-xl text-white font-medium">
        Thank you for your interest in Avelin.
      </span>
      <div className="flex flex-col gap-1 *:text-lg *:text-color-text-quaternary *:text-center">
        <p>We're thrilled to have you on board!</p>
        <p>
          Our private alpha is live right now - we're letting users on slowly.
        </p>
        <p>We'll send you an email when we're ready for you.</p>
      </div>
      <div className="flex flex-col gap-1 *:text-lg *:text-color-text-quaternary *:text-center">
        <p className="!text-xl font-medium !text-white">
          If you're interested in updates & sneak peeks:
        </p>
        <Link
          href="https://x.com/kianbazza"
          className="mt-2 text-lg text-color-text-quaternary font-normal relative"
        >
          <XLogo className="size-4 sm:size-5 inline-block relative translate-y-[-1px] text-white mx-[0.5px]" />{' '}
          <span className="text-color-text-secondary font-medium underline transition-colors decoration-transparent hover:decoration-white hover:text-white underline-offset-2 duration-150 ease-in">
            @kianbazza
          </span>
        </Link>
        <Link
          href="https://go.avelin.app/discord"
          className="text-lg text-color-text-quaternary font-normal relative"
        >
          <DiscordLogo className="size-4 sm:size-5 inline-block relative translate-y-[-1px] text-white mx-[0.5px]" />{' '}
          <span className="font-medium text-color-text-secondary underline transition-colors decoration-transparent hover:decoration-white hover:text-white underline-offset-2 duration-150 ease-in">
            Avelin Discord
          </span>
        </Link>
      </div>
    </motion.div>
  )
}
