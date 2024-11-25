'use client'

import { Separator } from '@avelin/ui/separator'
import { LogInIcon, LogoAvelin } from '@avelin/icons'
import { EditorLanguageCombobox } from './editor-language-combobox'
import { UsersList } from './editor-users-list'
import { useCodeRoom } from '@/providers/code-room-provider'
import { NetworkStatusBadge } from './network-status'
import { CopyRoomURL } from './copy-room-url'
import { Button } from '@avelin/ui/button'
import { useAuth } from '@/providers/auth-provider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MyAccountDropdown } from './my-account-dropdown'
import { Auth } from '@avelin/database'

export function EditorToolbar() {
  const pathname = usePathname()

  const { room } = useCodeRoom()
  const { isPending, isAuthenticated, user } = useAuth()

  return (
    <div className='flex items-center m-2 drop-shadow-sm py-2 px-4 max-w-full bg-popover-bg rounded-lg border border-color-border-subtle'>
      <div className='w-full grid grid-cols-2'>
        <div className='flex items-center place-self-start'>
          <div className='flex items-center h-6'>
            <LogoAvelin className='size-6 shrink-0' />
            <NetworkStatusBadge className='ml-2' />
            <Separator
              className='mx-3'
              orientation='vertical'
            />
          </div>
          <div className='flex items-center gap-4'>
            <EditorLanguageCombobox />
          </div>
        </div>
        <div className='place-self-end flex items-center h-6 my-auto'>
          <div className='flex items-center gap-1'>
            <UsersList />
            <CopyRoomURL roomSlug={room?.slug ?? ''} />
          </div>
          <Separator
            className='mx-3'
            orientation='vertical'
          />
          {isPending ? null : !isAuthenticated ? (
            <Button
              asChild
              size='xs'
              className='bg-indigo-9 hover:bg-indigo-10 text-indigo-1 inline-flex items-center'
            >
              <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
                <LogInIcon
                  strokeWidth={2.25}
                  className='size-4 shrink-0'
                />
                Login
              </Link>
            </Button>
          ) : (
            <MyAccountDropdown user={user as Auth['user']} />
          )}
        </div>
      </div>
    </div>
  )
}
