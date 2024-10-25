'use client'

import { Button } from '@avelin/ui/button'
import { useCopyToClipboard } from '@avelin/ui/hooks'
// import { createRoom } from '@/lib/api/room'
// import { hostname, prettyHostname } from '@/lib/constants'
import { CheckCircleIcon, LinkIcon, PlusIcon } from '@avelin/icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
// import { toast } from 'sonner'
import { useScramble } from 'use-scramble'
import { useCreateRoom } from '@/lib/mutations'

export default function CreateRoomButton() {
  const router = useRouter()
  const [, copy] = useCopyToClipboard()
  const [loading, setLoading] = useState<boolean>(false)
  const buttonText = !loading ? 'Create a new room' : 'Building your room...'
  const { ref } = useScramble({
    text: buttonText,
  })

  const { mutate, isPending } = useCreateRoom()

  async function handleClick() {
    setLoading(true)

    // const room = await createRoom()
    // const roomUrl = `${prettyHostname}/${room.id}`
    //
    // toast.info('Room created!', {
    //   description: roomUrl,
    //   icon: <Link className='size-4' />,
    //   action: {
    //     label: 'Copy Link',
    //     onClick: () => {
    //       copy(`${hostname}/${room.id}`)
    //       toast.success('Copied room link - share it!', {
    //         description: roomUrl,
    //         icon: <CheckCircle className='size-4' />,
    //       })
    //     },
    //   },
    // })

    // router.push(`/${room.id}`)

    setLoading(false)
  }

  return (
    <Button
      size='lg'
      className='inline-flex min-w-[275px] items-center font-mono text-base font-medium tracking-tight sm:min-w-[350px] sm:text-xl'
      disabled={isPending}
      onClick={() => mutate()}
    >
      {!loading && <PlusIcon className='mr-2 size-4 sm:size-6' />}
      <span ref={ref} />
    </Button>
  )
}
