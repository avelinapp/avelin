'use client'

import { Separator } from '@avelin/ui/separator'
import { LogoAvelin } from '@avelin/icons'
import { EditorLanguageCombobox } from './editor-language-combobox'
import { UsersList } from './editor-users-list'
import { useCodeRoom } from '@/providers/code-room-provider'
import { NetworkStatusBadge } from './network-status'
import { CopyRoomURL } from './copy-room-url'

export function EditorToolbar() {
  const { room } = useCodeRoom()
  return (
    <div className='flex items-center m-2 drop-shadow-sm py-2 px-2 max-w-full bg-white rounded-lg border border-color-border-subtle'>
      <div className='w-full grid grid-cols-3'>
        <div className='flex items-center place-self-start'>
          <div className='flex items-center h-6'>
            <LogoAvelin className='size-6 shrink-0' />
            <NetworkStatusBadge className='ml-2' />
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
