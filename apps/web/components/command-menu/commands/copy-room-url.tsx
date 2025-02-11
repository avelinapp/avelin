import { getPrettyHostname } from '@/lib/utils'
import { useCodeRoom } from '@/providers/code-room-provider'
import { CopyIcon, LinkIcon } from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { CommandItem } from '@avelin/ui/command'
import { useCopyToClipboard } from '@avelin/ui/hooks'
import { toast } from '@avelin/ui/sonner'
import { useMemo } from 'react'

interface Props {
  closeMenu: () => void
}

export function CopyRoomUrlCommand({ closeMenu }: Props) {
  const { room } = useCodeRoom()
  const [, copy] = useCopyToClipboard()
  const roomUrl = useMemo(
    () => `${process.env.NEXT_PUBLIC_APP_URL}/${room?.slug}`,
    [room?.slug],
  )

  const handleCopy = (notify?: boolean) => {
    copy(roomUrl)

    if (notify) {
      toast('Room link copied to your clipboard - share it!', {
        description: roomUrl,
        action: (
          <Button
            size="xs"
            variant="ghost"
            className="p-1.5 h-fit rounded-md ml-auto"
            onClick={() => handleCopy(false)}
          >
            <CopyIcon className="size-4 shrink-0" />
          </Button>
        ),
      })
    }
  }

  return (
    <CommandItem
      keywords={['room', 'link', 'url', 'share', 'copy']}
      onSelect={() => {
        handleCopy(true)
        closeMenu()
      }}
    >
      <LinkIcon />
      <span className="text-color-text-quaternary">Copy room link...</span>
      <span>{`${getPrettyHostname()}/${room?.slug}`}</span>
    </CommandItem>
  )
}
