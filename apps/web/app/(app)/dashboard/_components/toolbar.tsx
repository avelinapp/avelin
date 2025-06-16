'use client'

import type { Auth } from '@avelin/database'
import { LogoAvelin } from '@avelin/icons'
import { motion } from 'motion/react'
import Link from 'next/link'
import { MyAccountDropdown } from '@/components/editor/my-account-dropdown'
import { useAuth } from '@/providers/auth-provider'

export default function Toolbar() {
  const { user } = useAuth()

  return (
    <motion.div
      layoutId="toolbar"
      className="h-12 mt-4 flex items-center drop-shadow-sm py-2 px-4 w-full bg-popover-bg rounded-lg border border-color-border-subtle"
    >
      <div className="w-full grid grid-cols-2 items-center">
        <div className="flex items-center">
          <Link href="/dashboard">
            <LogoAvelin className="size-6 shrink-0" />
          </Link>
        </div>
        <div className="place-self-end flex items-center my-auto">
          <MyAccountDropdown user={user as Auth['user']} />
        </div>
      </div>
    </motion.div>
  )
}
