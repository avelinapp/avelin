'use client'

import { Button } from '@avelin/ui/button'
import { PlusIcon } from '@avelin/icons'
import { useScramble } from 'use-scramble'
import { useCreateRoom } from '@/lib/mutations'
import { useRouter } from 'next/navigation'
import { useShortcut } from '@/hooks/use-shortcut'

export default function CreateRoomButton() {
  const router = useRouter()
  const { mutate, isPending } = useCreateRoom()

  const createRoom = () =>
    mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/${data.slug}`)
      },
    })

  useShortcut(['c'], createRoom)

  const buttonText = !isPending ? 'Create room' : 'Building...'
  const { ref } = useScramble({
    text: buttonText,
    speed: 0.75,
    scramble: 6,
  })

  return (
    <Button
      size='lg'
      className='bg-indigo-9 hover:bg-indigo-10 group text-indigo-1 inline-flex items-center min-w-[275px] text-lg'
      disabled={isPending}
      onClick={createRoom}
    >
      {!isPending && (
        <PlusIcon
          strokeWidth={3}
          className='size-24 shrink-0'
        />
      )}
      <span
        className='text-indigo-2'
        ref={ref}
      />
      {!isPending && <KeyboardShortcut />}
    </Button>
  )
}

const KeyboardShortcut = () => (
  <div className='ml-2 font-mono rounded-sm size-7 inline-flex items-center justify-center text-indigo-3 font-normal bg-indigo-12/50 text-base'>
    C
  </div>
)
