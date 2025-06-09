import { CheckIcon, CopyIcon } from '@avelin/icons'
import { Button, type ButtonProps } from '@avelin/ui/button'
import { cn } from '@avelin/ui/cn'
import { useCopyToClipboard } from '@avelin/ui/hooks'
import { useState } from 'react'

type CopyCodeButtonProps = ButtonProps & {
  content: string
}

export function CopyCodeButton({
  content,
  className,
  ...props
}: CopyCodeButtonProps) {
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
      className={cn('hover-expand-4 text-secondary-text/80', className)}
      size="xs"
      variant="secondary"
      tooltip={{
        content: 'Copy code',
      }}
      onClick={handleCopyCode}
      {...props}
    >
      {copied ? (
        <CheckIcon className="size-4" />
      ) : (
        <CopyIcon className="size-4" />
      )}
    </Button>
  )
}
