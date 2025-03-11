'use client'

import { DiscordLogo, GitHubLogo, LogoAvelin, XLogo } from '@avelin/icons'
import { Button, type ButtonProps } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import { motion } from 'motion/react'
import Link from 'next/link'
import type { JSX, SVGProps } from 'react'
import { sectionVariants } from './variants'

const SocialButton = ({ children, className, ...props }: ButtonProps) => {
  return (
    <Button
      className={cn(
        'flex items-center gap-2 text-color-text-quaternary p-1 size-8 hover:text-white',
        className,
      )}
      variant="ghost"
      {...props}
    >
      {children}
    </Button>
  )
}

const socials: Array<{
  name: string
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
  url: string
}> = [
  { name: 'X', icon: XLogo, url: 'https://x.com/kianbazza' },
  { name: 'Discord', icon: DiscordLogo, url: 'https://go.avelin.app/discord' },
  { name: 'GitHub', icon: GitHubLogo, url: 'https://github.com/avelinapp' },
]

export function Header() {
  return (
    <motion.div
      className="flex flex-col items-center gap-4 sm:gap-6"
      variants={sectionVariants}
      layout="position"
    >
      <LogoAvelin className="text-primary-bg size-16 sm:size-24 drop-shadow-xl" />
      <h1 className="font-semibold text-2xl sm:text-4xl font-mono tracking-tighter text-white relative">
        <span>Avelin</span>
        <span
          className="text-xs sm:text-sm text-pink-9 absolute ml-1 left-full tracking-normal"
          style={{ verticalAlign: 'super' }}
        >
          (alpha)
        </span>
      </h1>
      <div className="flex flex-col items-center gap-4 text-base sm:text-xl text-color-text-quaternary">
        <p>Collaborative code editor for the web.</p>
        <div className="flex items-center gap-1 text-color-text-quaternary ">
          {socials.map(({ name, icon, url }) => {
            const Icon = icon

            return (
              <SocialButton key={name} asChild>
                <Link href={url}>
                  <Icon className="size-5" />
                </Link>
              </SocialButton>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
