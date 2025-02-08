'use client'

import { MyAccountDropdown } from '@/components/editor/my-account-dropdown'
import { useAuth } from '@/providers/auth-provider'
import { Auth } from '@avelin/database'
import { LogoAvelin } from '@avelin/icons'

export default function Toolbar() {
  const { user } = useAuth()

  return (
    <div className='flex items-center drop-shadow-sm py-2 px-4 w-full bg-popover-bg rounded-lg border border-color-border-subtle'>
      <div className='w-full grid grid-cols-2 items-center'>
        <div className='flex items-center'>
          <LogoAvelin className='size-6 shrink-0' />
        </div>
        <div className='place-self-end flex items-center my-auto'>
          <MyAccountDropdown user={user as Auth['user']} />
        </div>
      </div>
    </div>
  )
}
