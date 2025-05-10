'use client'

import { inArray } from '@/lib/utils'
import { useCommandMenu } from '@/providers/command-menu-provider'
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
import { useFocusRestore } from '@avelin/ui/hooks'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { type AnimationSequence, animate } from 'motion'
import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CopyRoomUrlCommand } from './commands/copy-room-url'
import {
  ChangeEditorLanguageCommands,
  ChangeEditorLanguageRootCommand,
} from './commands/editor-language'
import {
  ChangeInterfaceThemeCommands,
  ChangeInterfaceThemeRootCommand,
} from './commands/interface-theme'
import { RoomDeleteCommand } from './commands/room-delete'
import {
  EditRoomTitleCommand,
  RoomTitleRootCommand,
} from './commands/room-title'

const menuPulse: AnimationSequence = [
  [
    '.cmdk-container',
    { scale: [1, 0.9, 1] },
    { duration: 0.1, ease: 'easeInOut' },
  ],
]

export default function CommandMenu() {
  const { isOpen, open, close, toggle } = useCommandMenu()

  useFocusRestore(isOpen)
  const [pages, setPages] = useState<Array<string>>([])
  const [search, setSearch] = useState('')
  const page = useMemo(() => pages[pages.length - 1], [pages])

  const pathname = usePathname()
  const isCodeRoom = pathname.startsWith('/rooms/')
  const isUserInputCommand = useMemo(
    () => inArray(page, ['room-title']),
    [page],
  )

  const goToPage = useCallback((pages: Array<string>) => {
    setPages(pages)
    animate(menuPulse)
  }, [])

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
        <DialogOverlay className="bg-gray-12/20 dark:bg-gray-1/20 backdrop-blur-[1px]" />
        <DialogPrimitiveContent
          forceMount
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
              setSearch('')
              setPages((pages) => pages.slice(0, -1))
              animate(menuPulse)
            }
          }}
          className={cn(
            'fixed left-0 right-0 top-[25%] mx-auto z-50 grid w-full max-w-lg gap-4 bg-popover-bg p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg',
            'max-h-[500px] p-0 border border-color-border-subtle',
            'cmdk-container',
          )}
        >
          <motion.div>
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
                  className="dark:border-gray-12 text-lg px-2 py-8"
                  showSearchIcon={false}
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
                  {page !== 'room-title' && (
                    <CommandEmpty>No results found.</CommandEmpty>
                  )}
                  {!page && isCodeRoom && (
                    <CommandGroup heading="Code Rooms">
                      <>
                        {isCodeRoom && (
                          <ChangeEditorLanguageRootCommand
                            onSelect={() => {
                              goToPage([...pages, 'editor-language'])
                              setSearch('')
                            }}
                          />
                        )}
                        {!!search && (
                          <ChangeEditorLanguageCommands closeMenu={closeMenu} />
                        )}
                        {isCodeRoom && (
                          <CopyRoomUrlCommand closeMenu={closeMenu} />
                        )}
                        {isCodeRoom && (
                          <RoomTitleRootCommand
                            onSelect={() => {
                              goToPage([...pages, 'room-title'])
                            }}
                          />
                        )}
                        {isCodeRoom && (
                          <RoomDeleteCommand closeMenu={closeMenu} />
                        )}
                      </>
                    </CommandGroup>
                  )}
                  {page === 'editor-language' && isCodeRoom && (
                    <CommandGroup>
                      <ChangeEditorLanguageCommands closeMenu={closeMenu} />
                    </CommandGroup>
                  )}
                  {page === 'room-title' && isCodeRoom && (
                    <CommandGroup className={cn(!search && 'hidden')}>
                      <EditRoomTitleCommand
                        closeMenu={closeMenu}
                        search={search}
                        setSearch={setSearch}
                      />
                    </CommandGroup>
                  )}
                  {!page && (
                    <CommandGroup heading="User Preferences">
                      <ChangeInterfaceThemeRootCommand
                        onSelect={() => {
                          goToPage([...pages, 'interface-theme'])
                          setSearch('')
                        }}
                      />
                    </CommandGroup>
                  )}
                  {!isUserInputCommand &&
                    (page === 'interface-theme' || !!search) && (
                      <CommandGroup heading="Interface theme">
                        <ChangeInterfaceThemeCommands closeMenu={closeMenu} />
                      </CommandGroup>
                    )}
                </CommandList>
              </Command>
            </AnimatedSizeContainer>
          </motion.div>
        </DialogPrimitiveContent>
      </DialogPortal>
    </Dialog>
  )
}
