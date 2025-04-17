'use client'

import { useAuth } from '@/providers/auth-provider'
import { useCodeRoomStore } from '@/providers/code-room-provider'
import type { Auth } from '@avelin/database'
import { LogInIcon, LogoAvelin } from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { Separator } from '@avelin/ui/separator'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo } from 'react'
import { CopyRoomURL } from './copy-room-url'
import { EditorLanguageCombobox } from './editor-language-combobox'
import { UsersList } from './editor-users-list'
import { MyAccountDropdown } from './my-account-dropdown'
import { NetworkStatusBadge } from './network-status'
import { RoomTitle } from './room-title'

export const EditorToolbar = memo(__EditorToolbar)

function __EditorToolbar() {
  const pathname = usePathname()

  const { isPending, isAuthenticated, isAnonymous, user } = useAuth()
  const [room] = useCodeRoomStore((state) => [state.room])

  // console.log('**** [EditorToolbar] RE-RENDER')

  return (
    <div className="flex items-center m-2 drop-shadow-sm py-2 px-4 max-w-full bg-popover-bg rounded-lg border border-color-border-subtle">
      <div className="w-full grid grid-cols-3">
        <div className="flex items-center place-self-start">
          <div className="flex items-center h-6">
            {isAuthenticated &&
            {
              /* !isAnonymous  */
            } ? (
              <Link href="/dashboard">
                <LogoAvelin className="size-6 shrink-0" />
              </Link>
            ) : (
              <Link href="/">
                <LogoAvelin className="size-6 shrink-0" />
              </Link>
            )}
            <NetworkStatusBadge className="ml-2" />
            <Separator className="mx-3" orientation="vertical" />
          </div>
          <div className="flex items-center gap-4">
            <EditorLanguageCombobox />
          </div>
        </div>
        <div className="place-self-center flex items-center justify-center w-full">
          <RoomTitle />
        </div>
        <div className="place-self-end flex items-center h-6 my-auto">
          <div className="flex items-center gap-1">
            <UsersList />
            <CopyRoomURL roomSlug={room?.slug ?? ''} />
          </div>
          <Separator className="mx-3" orientation="vertical" />
          {/* TODO: Add back anonymous users */}
          {/* The check below should show Login/Signup if the user is not authed or **anonymous** */}
          {isPending ? null : !isAuthenticated || isAnonymous ? (
            <Button
              asChild
              size="xs"
              className="bg-indigo-9 hover:bg-indigo-10 text-indigo-1 inline-flex items-center"
            >
              <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
                <LogInIcon strokeWidth={2.25} className="size-4 shrink-0" />
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
