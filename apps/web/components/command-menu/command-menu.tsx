'use client'

import { AnimatedSizeContainer } from '@avelin/ui/animated-size-container'
import { cn } from '@avelin/ui/cn'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
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
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ChangeEditorLanguageCommands,
  ChangeEditorLanguageRootCommand,
} from './commands/editor-language'
import { CopyRoomUrlCommand } from './commands/copy-room-url'
import { useFocusRestore } from '@avelin/ui/hooks'
import {
  ChangeInterfaceThemeCommands,
  ChangeInterfaceThemeRootCommand,
} from './commands/interface-theme'
import { useCommandMenu } from '@/providers/command-menu-provider'
import { usePathname } from 'next/navigation'
import { ROOM_PATH_REGEX } from '@/lib/constants'

export default function CommandMenu() {
  const { isOpen, open, close, toggle } = useCommandMenu()

  useFocusRestore(isOpen)
  const [pages, setPages] = useState<Array<string>>([])
  const [search, setSearch] = useState('')
  const page = useMemo(() => pages[pages.length - 1], [pages])

  const pathname = usePathname()
  const isCodeRoom = pathname.match(ROOM_PATH_REGEX)

  const closeMenu = useCallback(() => {
    close()
    setTimeout(() => {
      setSearch('')
      setPages([])
    }, 200)
  }, [close])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Don't show the command menu on landing, login/signup pages
      if (pathname === '/login' || pathname === '/signup' || pathname === '/') {
        return
      }

      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [pathname, toggle])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        if (value) {
          open()
        } else {
          close()
        }
      }}
    >
      <DialogPortal>
        <DialogOverlay className='bg-gray-12/20 dark:bg-gray-1/20 backdrop-blur-[1px]' />
        <DialogPrimitiveContent
          onEscapeKeyDown={(e) => {
            e.preventDefault()
          }}
          onKeyDown={(e) => {
            // Escape closes menu when on the root page
            // Escape goes to previous page when on a nested page
            // Backspace goes to previous page when search is empty
            if (e.key === 'Escape' && !page) {
              return closeMenu()
            }

            if (e.key === 'Escape' || (e.key === 'Backspace' && !search)) {
              e.preventDefault()
              setPages((pages) => pages.slice(0, -1))
            }
          }}
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-popover-bg p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
            'max-h-[500px] p-0 border border-color-border-subtle',
          )}
        >
          <AnimatedSizeContainer
            height
            transition={{ ease: 'easeOut', duration: 0.15 }}
          >
            <VisuallyHidden>
              <DialogTitle />
              <DialogDescription />
            </VisuallyHidden>
            <Command
              loop
              className={cn(
                'h-full w-full ',
                '[&_[cmdk-item]]:px-4 [&_[cmdk-item]]:py-3 [&_[cmdk-item]]:transition-colors [&_[cmdk-item]]:ease-out [&_[cmdk-item]]:duration-75',
                '[&_[cmdk-item]_svg]:h-4 [&_[cmdk-item]_svg]:w-4 [&_[cmdk-item]_svg]:stroke-[2.25px] [&_[cmdk-item]_svg]:text-color-text-quaternary [&_[cmdk-item][data-selected=true]_svg]:text-color-text-primary',
              )}
            >
              <CommandInput
                value={search}
                onValueChange={setSearch}
                className='dark:border-gray-12'
                placeholder={
                  !page
                    ? 'Type a command or search...'
                    : page === 'editor-language'
                      ? 'Change the editor language...'
                      : page === 'interface-theme'
                        ? 'Change the interface theme...'
                        : ''
                }
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {!page && (
                  <CommandGroup heading='Code Rooms'>
                    <>
                      {isCodeRoom && (
                        <ChangeEditorLanguageRootCommand
                          onSelect={() => {
                            setPages([...pages, 'editor-language'])
                            setSearch('')
                          }}
                        />
                      )}
                      {!!search && (
                        <>
                          {isCodeRoom && (
                            <ChangeEditorLanguageCommands
                              closeMenu={closeMenu}
                            />
                          )}
                          <ChangeInterfaceThemeCommands closeMenu={closeMenu} />
                        </>
                      )}
                      {isCodeRoom && (
                        <CopyRoomUrlCommand closeMenu={closeMenu} />
                      )}
                      <ChangeInterfaceThemeRootCommand
                        onSelect={() => {
                          setPages([...pages, 'interface-theme'])
                          setSearch('')
                        }}
                      />
                    </>
                  </CommandGroup>
                )}
                {page === 'editor-language' && isCodeRoom && (
                  <CommandGroup>
                    <ChangeEditorLanguageCommands closeMenu={closeMenu} />
                  </CommandGroup>
                )}
                {page === 'interface-theme' && (
                  <CommandGroup>
                    <ChangeInterfaceThemeCommands closeMenu={closeMenu} />
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </AnimatedSizeContainer>
        </DialogPrimitiveContent>
      </DialogPortal>
    </Dialog>
  )
}
