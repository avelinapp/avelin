import { ExternalLinkIcon, LogoRaycast } from '@avelin/icons'
import { CommandItem } from '@avelin/ui/command'
import { useCopyToClipboard, useIsHoldingCmdKey } from '@avelin/ui/hooks'
import { toast } from '@avelin/ui/sonner'
import { AVELIN_TO_RAYSO_LANGUAGE_MAP } from '@/lib/constants'
import { useCodeRoomStore } from '@/providers/code-room-provider'

interface RoomDeleteCommandProps {
  closeMenu: () => void
}

export function RoomExportPngCommand({ closeMenu }: RoomDeleteCommandProps) {
  const [editorLanguage, ydoc] = useCodeRoomStore((state) => [
    state.editorLanguage,
    state.ydoc,
  ])
  const [, copy] = useCopyToClipboard()
  const isHoldingCmdKey = useIsHoldingCmdKey()

  function handleSelect() {
    const content = ydoc.getText('monaco').toJSON()

    const rayLanguageId =
      editorLanguage && AVELIN_TO_RAYSO_LANGUAGE_MAP[editorLanguage]

    const params = {
      padding: '64',
      code: btoa(content), // base64 encoded
      // only if the editor language is supported by Ray.so
      // Otherwise it'll fall back to language detection in Ray.so
      ...(editorLanguage && rayLanguageId && { language: rayLanguageId }),
    }

    const queryParams = new URLSearchParams(params)
    const url = `https://ray.so/#${queryParams.toString()}`

    closeMenu()

    if (isHoldingCmdKey) {
      // Open the link in a new tab
      window.open(url, '_blank')
      toast('Ray.so link opened in a new tab.')
    } else {
      copy(url)
      toast('Ray.so link copied to clipboard.', {
        description:
          'Visit the link to view your code in Ray.so, where you can export it as an image.',
        descriptionClassName: 'mt-2',
      })
    }
  }

  return (
    <CommandItem
      className="group"
      value="Copy Ray.so link"
      onSelect={handleSelect}
      keywords={[
        'room',
        'export',
        'png',
        'image',
        'svg',
        'ray.so',
        'export as image',
      ]}
    >
      <LogoRaycast className="grayscale-100 group-data-[selected=true]:grayscale-0 transition-[filter] duration-75 ease-out" />
      <span className="text-color-text-quaternary">
        {isHoldingCmdKey ? 'Open Ray.so in a new tab' : 'Copy Ray.so link'}
      </span>
      <span className="ml-auto opacity-0 group-data-[selected=true]:opacity-100 transition-opacity duration-75 ease-out text-color-text-quaternary/75">
        {isHoldingCmdKey ? <ExternalLinkIcon /> : '⌘ + Enter to open'}
      </span>
    </CommandItem>
  )
}
