'use client'

import { Button } from '@avelin/ui/button'
import { PlusIcon } from '@avelin/icons'
import { useScramble } from 'use-scramble'
import { useCreateRoom } from '@/lib/mutations'
import { useRouter } from 'next/navigation'

export default function CreateRoomButton() {
  const router = useRouter()
  const { mutate, isPending } = useCreateRoom()

  const createRoom = () =>
    mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/${data.slug}`)
      },
    })

  const buttonText = !isPending ? 'Create a new room' : 'Building your room...'
  const { ref } = useScramble({
    text: buttonText,
    speed: 1,
    scramble: 1,
  })

  return (
    <Button
      size='lg'
      className='inline-flex min-w-[275px] items-center font-mono text-base font-medium tracking-tight sm:min-w-[350px] sm:text-xl'
      disabled={isPending}
      onClick={createRoom}
    >
      {!isPending && <PlusIcon className='mr-2 size-4 sm:size-6' />}
      <span ref={ref} />
    </Button>
  )
}
