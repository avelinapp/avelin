'use client'

import { LayoutGroup, motion } from 'motion/react'
import { useMemo } from 'react'
import type { WaitlistConfig } from '../page'
import { Header } from './header'
import { containerVariants } from './variants'
import { Waitlist } from './waitlist'
import { WaitlistSoon } from './waitlist-soon'

export function Landing({ config }: { config: WaitlistConfig }) {
  const content = useMemo(
    () => (config.enabled ? <Waitlist /> : <WaitlistSoon />),
    [config.enabled],
  )

  return (
    <LayoutGroup>
      <motion.div
        className="flex w-full flex-1 h-full flex-col items-center justify-center gap-12 p-4 select-none"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Header />
        {content}
      </motion.div>
    </LayoutGroup>
  )
}
