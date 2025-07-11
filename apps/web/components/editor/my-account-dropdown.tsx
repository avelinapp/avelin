'use client'

import type { User } from '@avelin/auth'
import {
  HouseIcon,
  KeyRoundIcon,
  LogOutIcon,
  LogoAvelin,
  SettingsIcon,
  ShieldUserIcon,
} from '@avelin/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@avelin/ui/avatar'
import { Button } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@avelin/ui/dropdown-menu'
import { toast } from '@avelin/ui/sonner'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useState } from 'react'
import { authClient } from '@/lib/auth'
import { LOGOUT_ACTION_TOAST_ID } from '@/lib/constants'
import { env } from '@/lib/env'
import { preferencesComingSoonToast } from '@/lib/toasts'

export function MyAccountDropdown({ user }: { user: User }) {
  const router = useRouter()
  const FF_fixedJwtClearBehaviourOnSignout = useFeatureFlagEnabled(
    'fixed-jwt-clear-behaviour-on-signout',
  )

  function handleDashboardClick() {
    router.push('/dashboard')
  }

  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onResponse: () => {
          if (FF_fixedJwtClearBehaviourOnSignout) {
            Cookies.remove('avelin.session_jwt', {
              path: '/',
              domain: `.${env.NEXT_PUBLIC_BASE_DOMAIN}`,
            })
          } else {
            Cookies.remove('avelin.session_jwt')
          }
        },
        onSuccess: () => {
          toast('Logged out.', {
            id: LOGOUT_ACTION_TOAST_ID,
            icon: <KeyRoundIcon className="size-4 shrink-0" />,
          })
          router.push('/login')
        },
        onError: () => {
          toast.error('Failed to log out.', {
            id: LOGOUT_ACTION_TOAST_ID,
            icon: <KeyRoundIcon className="size-4 shrink-0" />,
          })
        },
      },
    })
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-fit w-fit p-0 relative rounded-full bg-none hover:bg-none group"
          tooltip={{
            content: 'Account',
            collisionPadding: 8,
          }}
        >
          <Avatar
            className={cn(
              'size-7 shrink-0  transition-all',
              'hover:brightness-[0.8] group-data-[state=open]:brightness-[0.8]',
              'dark:hover:brightness-[1.2] dark:group-data-[state=open]:brightness-[1.2]',
            )}
          >
            <AvatarImage src={user?.image ?? undefined} />
            <AvatarFallback className="leading-none bg-gray-3 text-sm">
              {user.name
                .split(' ')
                .map((s) => s[0]?.toUpperCase())
                .join('')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        <DropdownMenuItem className="justify-between gap-4 focus:bg-transparent">
          <Avatar className="size-7 shrink-0">
            <AvatarImage src={user?.image ?? undefined} />
            <AvatarFallback className="leading-none bg-gray-3 text-sm">
              {user.name
                .split(' ')
                .map((s) => s[0]?.toUpperCase())
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-color-text-primary">
              {user.name}
            </span>
            <span className="text-color-text-quaternary">{user.email}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="group" onSelect={handleDashboardClick}>
          <HouseIcon
            strokeWidth={2.25}
            className="size-4 shrink-0 group-hover:text-color-text-primary"
          />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem
          className="group"
          onSelect={preferencesComingSoonToast}
        >
          <SettingsIcon
            strokeWidth={2.25}
            className="size-4 shrink-0 group-hover:text-color-text-primary"
          />
          Preferences
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="group" asChild>
          <Link href="/home">
            <LogoAvelin className="size-4 shrink-0 group-hover:text-color-text-primary" />
            Homepage
          </Link>
        </DropdownMenuItem>
        {user.isAdminUser && (
          <DropdownMenuItem className="group" asChild>
            <Link href="/admin">
              <ShieldUserIcon
                strokeWidth={2.25}
                className="size-4 shrink-0 group-hover:text-color-text-primary"
              />
              Admin Area
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="group" onClick={handleLogout}>
          <LogOutIcon strokeWidth={2.25} className="size-4 shrink-0" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
