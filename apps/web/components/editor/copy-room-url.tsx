'use client'

import { Button } from '@avelin/ui/button'
import { CopyIcon, LinkIcon } from '@avelin/icons'
import { useMemo } from 'react'
import { toast } from '@avelin/ui/sonner'
import { useCopyToClipboard } from '@avelin/ui/hooks'

export function CopyRoomURL({ roomSlug }: { roomSlug: string }) {
  const [, copy] = useCopyToClipboard()

  const roomUrl = useMemo(
    () => process.env.NEXT_PUBLIC_APP_URL + '/' + roomSlug,
    [roomSlug],
  )

  function handleCopy(notify?: boolean) {
    copy(roomUrl)

    if (notify) {
      toast('Room link copied to your clipboard - share it!', {
        description: roomUrl,
        action: (
          <Button
            size='xs'
            variant='ghost'
            className='p-1.5 h-fit rounded-md ml-auto'
            onClick={() => handleCopy(false)}
          >
            <CopyIcon className='size-4 shrink-0' />
          </Button>
        ),
      })
    }
  }

  return (
    <Button
      variant='default'
      size='xs'
      onClick={() => handleCopy(true)}
      tooltip={{
        content: 'Copy room link',
      }}
    >
      <LinkIcon
        className='size-4 shrink-0'
        strokeWidth={2.25}
      />
      Share
    </Button>
  )
}
