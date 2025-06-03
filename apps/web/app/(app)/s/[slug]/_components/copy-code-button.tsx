import { CheckIcon, CopyIcon } from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { useCopyToClipboard } from '@avelin/ui/hooks'
import { useState } from 'react'

interface CopyCodeButtonProps {
  content: string
}

export function CopyCodeButton({ content }: CopyCodeButtonProps) {
  const [, copy] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  function handleCopyCode() {
    setCopied(true)
    copy(content)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Button
      className="absolute top-0 right-8 hover-expand-4 bg-secondary-bg-subtle text-secondary-text/80"
      size="xs"
      variant="secondary"
      tooltip={{
        content: 'Copy code',
      }}
      onClick={handleCopyCode}
    >
      {copied ? (
        <CheckIcon className="size-4" />
      ) : (
        <CopyIcon className="size-4" />
      )}
    </Button>
  )
}
