'use client'

import { DiscordLogo, GitHubLogo, LogoAvelin, XLogo } from '@avelin/icons'
import '../globals.css'
import '@avelin/ui/globals.css'
import { Button, type ButtonProps } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import { type Variants, motion } from 'motion/react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { FormView, SubmittingView } from './components'

const SocialButton = ({ children, className, ...props }: ButtonProps) => {
  return (
    <Button
      className={cn(
        'flex items-center gap-2 text-color-text-quaternary p-1 size-8 hover:text-white transition-colors',
        className,
      )}
      variant="ghost"
      {...props}
    >
      {children}
    </Button>
  )
}

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.5,
    },
  },
}

const variants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.99,
    translateY: 5,
    filter: 'blur(2px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    translateY: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.75,
      ease: 'easeOut',
    },
  },
}

export default function Landing() {
  // const [status, setStatus] = useState<
  //   'idle' | 'submitting' | 'success' | 'error'
  // >('idle')
  //
  // function handleJoinWaitlist() {
  //   setStatus('submitting')
  //   setTimeout(() => {
  //     setStatus('idle')
  //   }, 3000)
  // }
  //
  // const content = useMemo(() => {
  //   switch (status) {
  //     case 'idle':
  //     case 'success':
  //     case 'error':
  //       return <FormView key="form" handleJoinWaitlist={handleJoinWaitlist} />
  //     case 'submitting':
  //       return <SubmittingView key="submitting" />
  //   }
  // }, [status])

  return (
    <motion.div
      className="flex w-full flex-1 h-full flex-col items-center justify-center gap-12 p-4 select-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex flex-col items-center gap-4 sm:gap-6"
        variants={variants}
      >
        <LogoAvelin className="text-primary-bg size-16 sm:size-24 drop-shadow-xl" />
        <h1 className="font-semibold text-2xl sm:text-4xl font-mono !tracking-tighter text-white relative">
          <span className="!tracking-[-0.05em]">Avelin</span>
          <span
            className="text-xs sm:text-sm text-pink-9 absolute ml-1 left-full"
            style={{ verticalAlign: 'super' }}
          >
            (alpha)
          </span>
        </h1>
        <div className="flex flex-col items-center gap-4 text-base sm:text-xl text-color-text-quaternary">
          <p>Collaborative code editor for the web.</p>
          <div className="flex items-center gap-1 text-color-text-quaternary ">
            <SocialButton asChild>
              <Link href="https://x.com/avelinapp">
                <XLogo className="w-5 h-5" />
              </Link>
            </SocialButton>
            <SocialButton asChild>
              <Link href="https://discord.gg/wvmVJtqkYR">
                <DiscordLogo className="w-5 h-5" />
              </Link>
            </SocialButton>
            <SocialButton asChild>
              <Link href="https://github.com/avelinapp">
                <GitHubLogo className="w-5 h-5" />
              </Link>
            </SocialButton>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="flex flex-col items-center gap-2 sm:gap-6 !tracking-normal *:!tracking-normal"
        variants={variants}
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
        {/* <span className="text-xl text-white font-medium"> */}
        {/*   Join the waitlist for early access. */}
        {/* </span> */}
        {/* <div className="w-[400px] h-14 flex-1"> */}
        {/*   <AnimatePresence mode="popLayout" initial={false}> */}
        {/*     {content} */}
        {/*   </AnimatePresence> */}
        {/* </div> */}
        {/* <Link */}
        {/*   href="/readme" */}
        {/*   className="!tracking-normal text-color-text-quaternary sm:hover-expand-6 sm:blur-sm sm:hover:blur-none hover:text-white hover:underline transition-all" */}
        {/* > */}
        {/*   Why are we building this? */}
        {/* </Link> */}
      </motion.div>
    </motion.div>
  )
}
