'use client'

import { Button } from '@avelin/ui/button'
import { CodeIcon } from '@avelin/icons'
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

  const buttonText = !isPending ? 'Create room' : 'Building...'
  const { ref } = useScramble({
    text: buttonText,
    speed: 1,
    scramble: 1,
  })

  return (
    <Button
      size='lg'
      className='bg-indigo-9 hover:bg-indigo-9 text-gray-1 inline-flex items-center min-w-[275px] text-lg'
      disabled={isPending}
      onClick={createRoom}
    >
      {!isPending && (
        <CodeIcon
          strokeWidth={3}
          className='h-10 w-10 shrink-0'
        />
      )}
      <span ref={ref} />
      <div className='ml-2 font-mono rounded-sm size-7 inline-flex items-center justify-center text-indigo-3 font-normal bg-indigo-11 text-base'>
        C
      </div>
    </Button>
  )
}
