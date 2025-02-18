'use client'

import { useAuth } from '@/providers/auth-provider'
import RoomsList from './_components/rooms-list'

export default function Page() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">
          Welcome back,{' '}
          <span className="text-color-text-quaternary">
            {user?.name.split(' ')[0]}
          </span>
        </h1>
        <p className="text-color-text-quaternary">
          All your code rooms - past, present, and future.
        </p>
      </div>
      <RoomsList />
    </div>
  )
}
