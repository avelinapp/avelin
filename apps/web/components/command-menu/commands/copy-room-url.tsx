import { CopyIcon, ExternalLinkIcon, LinkIcon } from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { CommandItem } from '@avelin/ui/command'
import { useCopyToClipboard, useIsHoldingCmdKey } from '@avelin/ui/hooks'
import { toast } from '@avelin/ui/sonner'
import { useMemo } from 'react'
import { env } from '@/lib/env'
import { useCodeRoomStore } from '@/providers/code-room-provider'

interface Props {
  closeMenu: () => void
}

export function CopyRoomUrlCommand({ closeMenu }: Props) {
  const [room] = useCodeRoomStore((state) => [state.room])
  const isHoldingCmdKey = useIsHoldingCmdKey()
  const [, copy] = useCopyToClipboard()
  const roomUrl = useMemo(
    () => `${env.NEXT_PUBLIC_APP_URL}/${room?.slug}`,
    [room?.slug],
  )
  const roomStaticUrl = useMemo(
    () => `${env.NEXT_PUBLIC_APP_URL}/s/${room?.staticSlug}`,
    [room?.staticSlug],
  )

  function handleStaticRoomSelect() {
    if (isHoldingCmdKey) {
      window.open(roomUrl, '_blank')
      toast('Static room link opened in a new tab.')
    } else {
      handleCopy('static', true)
      closeMenu()
    }
  }

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
        value="Copy room link"
        keywords={['room', 'link', 'url', 'share', 'copy', 'live']}
        onSelect={() => {
          handleCopy('live', true)
          closeMenu()
        }}
      >
        <LinkIcon />
        <span className="text-color-text-quaternary">Copy room link</span>
      </CommandItem>
      <CommandItem
        className="group"
        value="Copy static room link"
        keywords={['room', 'link', 'url', 'share', 'copy', 'static']}
        onSelect={handleStaticRoomSelect}
      >
        <LinkIcon />
        <span className="text-color-text-quaternary">
          {isHoldingCmdKey
            ? 'Open static room in a new tab'
            : 'Copy static room link'}
        </span>
        <span className="ml-auto opacity-0 group-data-[selected=true]:opacity-100 transition-opacity duration-75 ease-out text-color-text-quaternary/75">
          {isHoldingCmdKey ? <ExternalLinkIcon /> : '⌘ + Enter to open'}
        </span>
      </CommandItem>
    </>
  )
}
