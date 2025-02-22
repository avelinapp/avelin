'use client'

import {
  ArrowRightIcon,
  DiscordLogo,
  GitHubLogo,
  LogoAvelin,
  XLogo,
} from '@avelin/icons'
import '../globals.css'
import '@avelin/ui/globals.css'
import { Button, type ButtonProps } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import { Input } from '@avelin/ui/input'
import { type Variants, motion } from 'motion/react'
import Link from 'next/link'

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
  return (
    <motion.div
      className="flex w-full flex-1 h-full flex-col items-center justify-center gap-12 p-4 select-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="flex flex-col items-center gap-6"
        variants={variants}
      >
        <LogoAvelin className="text-primary-bg size-24 drop-shadow-xl" />
        <h1 className="font-semibold text-4xl font-mono !tracking-tighter text-white relative">
          <span className="!tracking-[-0.05em]">Avelin</span>
          <span
            className="text-sm text-pink-9 absolute ml-1 left-full"
            style={{ verticalAlign: 'super' }}
          >
            (alpha)
          </span>
        </h1>
        <div className="flex flex-col items-center gap-4 text-xl text-color-text-quaternary">
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
        className="flex flex-col items-center gap-6 !tracking-normal *:!tracking-normal"
        variants={variants}
      >
        <div className="w-[50px] h-[1px] bg-color-border-subtle mb-4" />
        <span className="text-xl text-white font-medium">
          Join the waitlist for early access.
        </span>
        <div className="flex gap-4">
          <Input className="w-[300px]" placeholder="Email address" />
          <Button className="bg-white group">
            Join
            <ArrowRightIcon className="group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
        <Link
          href="/readme"
          className="!tracking-normal text-color-text-quaternary sm:hover-expand-6 sm:blur-sm sm:hover:blur-none hover:text-white hover:underline transition-all"
        >
          Why are we building this?
        </Link>
      </motion.div>
    </motion.div>
  )
}
