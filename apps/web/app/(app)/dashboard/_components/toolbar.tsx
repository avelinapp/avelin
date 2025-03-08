'use client'

import { MyAccountDropdown } from '@/components/editor/my-account-dropdown'
import { authClient } from '@/lib/auth'
import type { Auth } from '@avelin/database'
import { LogoAvelin } from '@avelin/icons'
import Link from 'next/link'

export default function Toolbar() {
  const { data, isPending, error } = authClient.useSession()

  if (isPending || error || !data) {
    return null
  }

  const { user, session } = data

  return (
    <div className="flex-0 sticky top-4 flex items-center drop-shadow-sm py-2 px-4 w-full bg-popover-bg rounded-lg border border-color-border-subtle">
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
    </div>
  )
}
