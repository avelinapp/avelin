'use client'

import { ArrowRightIcon, ChevronRightIcon, CodeXmlIcon } from '@avelin/icons'
import { AnimatedSizeContainer } from '@avelin/ui/animated-size-container'
import { cn } from '@avelin/ui/cn'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@avelin/ui/command'
import {
  Dialog,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogPrimitiveContent,
  DialogTitle,
} from '@avelin/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { useEffect, useState } from 'react'

export default function CommandMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogPortal>
        <DialogOverlay className='bg-color-text-primary/20 backdrop-blur-[1px]' />
        <DialogPrimitiveContent
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-popover-bg p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
            'max-h-[500px] p-0 border-2 border-color-border-subtle',
          )}
        >
          <AnimatedSizeContainer
            height
            transition={{ ease: 'easeOut', duration: 0.1 }}
          >
            <VisuallyHidden>
              <DialogTitle />
              <DialogDescription />
            </VisuallyHidden>
            <Command
              className={cn(
                'h-full w-full ',
                '[&_[cmdk-item]]:px-4 [&_[cmdk-item]]:py-3',
                "[&_[cmdk-item]_svg]:h-4 [&_[cmdk-item]_svg]:w-4 [&_[cmdk-item]_svg]:stroke-[2.25px] [&_[cmdk-item]_svg]:opacity-75 [&_[cmdk-item]_svg]:data-[selected='true']:opacity-100",
              )}
            >
              <CommandInput placeholder='Type a command or search...' />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading='Code Rooms'>
                  <CommandItem>
                    <CodeXmlIcon />
                    Change editor language
                    <ChevronRightIcon className='mx-0' />
                  </CommandItem>
                  <CommandItem>
                    <ArrowRightIcon />
                    Copy room link
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </AnimatedSizeContainer>
        </DialogPrimitiveContent>
      </DialogPortal>
    </Dialog>
  )
}
