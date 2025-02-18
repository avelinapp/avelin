'use client'

import { useShortcut } from '@/hooks/use-shortcut'
import { useCreateRoom } from '@/lib/mutations'
import { Room } from '@/lib/mutations.zero'
import { getQueryClient } from '@/lib/queries'
import { useZero } from '@/lib/zero'
import { PlusIcon } from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { useRouter } from 'next/navigation'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useScramble } from 'use-scramble'

export default function CreateRoomButton() {
  const FF_zero = useFeatureFlagEnabled('zero')

  if (FF_zero) {
    return <CreateRoomButton.Zero />
  }
  return <CreateRoomButton.Network />
}

CreateRoomButton.Network = () => {
  const router = useRouter()
  const queryClient = getQueryClient()
  const { mutate, isPending } = useCreateRoom({ queryClient })

  const createRoom = () =>
    mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/rooms/${data.slug}`)
      },
    })

  const buttonText = !isPending ? 'Create room' : 'Building...'
  const { ref } = useScramble({
    text: buttonText,
    speed: 0.75,
    scramble: 6,
  })

  useShortcut(['c'], createRoom)

  return (
    <Button
      size="lg"
      className="bg-indigo-9 dark:text-indigo-12 hover:bg-indigo-10 group text-indigo-1 inline-flex items-center min-w-[275px] text-lg"
      disabled={isPending}
      onClick={createRoom}
    >
      {!isPending && <PlusIcon strokeWidth={3} className="size-24 shrink-0" />}
      <span className="text-indigo-2 dark:text-indigo-12" ref={ref} />
      {!isPending && <KeyboardShortcut />}
    </Button>
  )
}

CreateRoomButton.Zero = () => {
  const router = useRouter()
  const z = useZero()

  const createRoom = async () => {
    const room = await Room.create(z)
    if (room) {
      router.push(`/rooms/${room.slug}`)
    }
  }

  return (
    <Button
      size="lg"
      className="bg-indigo-9 dark:text-indigo-12 hover:bg-indigo-10 group text-indigo-1 inline-flex items-center min-w-[275px] text-lg"
      onClick={createRoom}
    >
      <PlusIcon strokeWidth={3} className="size-24 shrink-0" />
      <span className="text-indigo-2 dark:text-indigo-12">Create room</span>
      <KeyboardShortcut />
    </Button>
  )
}

const KeyboardShortcut = () => (
  <div className="ml-2 font-mono rounded-sm size-7 inline-flex items-center justify-center text-indigo-3 dark:text-indigo-12 font-normal bg-indigo-12/25 text-base">
    C
  </div>
)
