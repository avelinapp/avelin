import { CopyIcon, LinkIcon } from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { CommandItem } from '@avelin/ui/command'
import { useCopyToClipboard } from '@avelin/ui/hooks'
import { toast } from '@avelin/ui/sonner'
import { useMemo } from 'react'
import { env } from '@/lib/env'
import { getPrettyHostname } from '@/lib/utils'
import { useCodeRoomStore } from '@/providers/code-room-provider'

interface Props {
  closeMenu: () => void
}

export function CopyRoomUrlCommand({ closeMenu }: Props) {
  const [room] = useCodeRoomStore((state) => [state.room])
  const [, copy] = useCopyToClipboard()
  const roomUrl = useMemo(
    () => `${env.NEXT_PUBLIC_APP_URL}/${room?.slug}`,
    [room?.slug],
  )
  const roomStaticUrl = useMemo(
    () => `${env.NEXT_PUBLIC_APP_URL}/s/${room?.staticSlug}`,
    [room?.staticSlug],
  )

  const handleCopy = (urlType: 'live' | 'static', notify?: boolean) => {
    const url = urlType === 'live' ? roomUrl : roomStaticUrl
    copy(url)

    if (notify) {
      toast('Room link copied to your clipboard - share it!', {
        description: url,
        action: (
          <Button
            size="xs"
            variant="ghost"
            className="p-1.5 h-fit rounded-md ml-auto"
            onClick={() => handleCopy(urlType, false)}
          >
            <CopyIcon className="size-4 shrink-0" />
          </Button>
        ),
      })
    }
  }

  return (
    <>
      <CommandItem
        keywords={['room', 'link', 'url', 'share', 'copy', 'live']}
        onSelect={() => {
          handleCopy('live', true)
          closeMenu()
        }}
      >
        <LinkIcon />
        <span className="text-color-text-quaternary">Copy room link...</span>
        <span>{`${getPrettyHostname()}/${room?.slug}`}</span>
      </CommandItem>
      <CommandItem
        keywords={['room', 'link', 'url', 'share', 'copy', 'static']}
        onSelect={() => {
          handleCopy('static', true)
          closeMenu()
        }}
      >
        <LinkIcon />
        <span className="text-color-text-quaternary">
          Copy static room link...
        </span>
        <span>{`${getPrettyHostname()}/s/${room?.staticSlug}`}</span>
      </CommandItem>
    </>
  )
}
