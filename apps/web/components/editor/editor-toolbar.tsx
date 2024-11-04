'use client'

// eslint-disable-next-line
import { Input } from '@avelin/ui/input'
import { Button } from '@avelin/ui/button'
import { CopyIcon } from '@avelin/icons'
import { EditorLanguageCombobox } from './editor-language-combobox'
import { UsersList } from './editor-users-list'

// eslint-disable-next-line
function CopyRoomURL() {
  return (
    <Button
      variant='secondary'
      size='xs'
      className='text-secondary-text'
    >
      <CopyIcon
        className='size-4 shrink-0 text-color-text-secondary'
        strokeWidth={2.25}
      />
      Copy URL
    </Button>
  )
}

export function EditorToolbar() {
  return (
    <div className='flex items-center m-2 drop-shadow-sm py-2 px-2 max-w-full bg-white rounded-lg border border-color-border-subtle'>
      <div className='w-full grid grid-cols-3'>
        <div className='flex items-center gap-4 place-self-start'>
          <UsersList />
          {/* <CopyRoomURL /> */}
        </div>
        <div className='place-self-center'>
          {/* <Input */}
          {/*   size='xs' */}
          {/*   className='font-medium' */}
          {/* /> */}
        </div>
        <div className='place-self-end'>
          <EditorLanguageCombobox />
        </div>
      </div>
    </div>
  )
}
