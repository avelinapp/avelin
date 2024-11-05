'use client'

import { Button } from '@avelin/ui/button'
import { Separator } from '@avelin/ui/separator'
import { CopyIcon, LinkIcon, LogoAvelin } from '@avelin/icons'
import { EditorLanguageCombobox } from './editor-language-combobox'
import { UsersList } from './editor-users-list'
import { useCodeRoom } from '@/providers/code-room-provider'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@avelin/ui/tooltip'
import { useMemo } from 'react'
import { toast } from '@avelin/ui/sonner'
import { useCopyToClipboard } from '@avelin/ui/hooks'

function CopyRoomURL({ roomSlug }: { roomSlug: string }) {
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='default'
            size='xs'
            onClick={() => handleCopy(true)}
          >
            <LinkIcon
              className='size-4 shrink-0'
              strokeWidth={2.25}
            />
            Share
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className='text-xs'
          align='end'
        >
          Copy room link
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function EditorToolbar() {
  const { room } = useCodeRoom()
  return (
    <div className='flex items-center m-2 drop-shadow-sm py-2 px-2 max-w-full bg-white rounded-lg border border-color-border-subtle'>
      <div className='w-full grid grid-cols-3'>
        <div className='flex items-center place-self-start'>
          <div className='flex items-center h-6'>
            <LogoAvelin className='size-6 shrink-0' />
            <Separator
              className='mx-3'
              orientation='vertical'
            />
          </div>
          <div className='flex items-center gap-4'>
            <EditorLanguageCombobox />
          </div>
        </div>
        <div className='place-self-center'>
          {/* <Input */}
          {/*   size='xs' */}
          {/*   className='font-medium' */}
          {/* /> */}
        </div>
        <div className='place-self-end flex items-center gap-1'>
          <UsersList />
          <CopyRoomURL roomSlug={room?.slug ?? ''} />
        </div>
      </div>
    </div>
  )
}
