'use client'

import { Language, languages } from '@/lib/constants'
import { useCreateRoom, useDeleteRoom } from '@/lib/mutations'
import { getQueryClient, queries } from '@/lib/queries'
import { Room } from '@avelin/database'
import {
  LinkIcon,
  PlusIcon,
  SquareArrowUpRightIcon,
  TrashIcon,
} from '@avelin/icons'
import { Button } from '@avelin/ui/button'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  const { data, error, isPending } = useQuery(queries.rooms.all())

  const createRoom = useCreateRoom()

  async function handleCreateRoom() {
    const data = await createRoom.mutateAsync()

    router.push(`/${data.slug}`)
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='space-y-2'>
        <h1 className='text-2xl font-semibold tracking-tight'>Code Rooms</h1>
        <p className='text-color-text-quaternary'>
          All your code rooms - past, present, and future.
        </p>
      </div>
      <div>
        <Button onClick={handleCreateRoom}>
          <PlusIcon className='size-fit' />
          Create
        </Button>
      </div>
      <div>
        {isPending ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : (
          <div className='flex flex-col gap-1'>
            {data.map((room) => (
              <CodeRoomListItem
                key={room.id}
                room={room}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const CodeRoomListItem = ({
  room,
}: {
  room: Omit<Room, 'ydoc'> & { lastAccessedAt: Date }
}) => {
  const queryClient = getQueryClient()
  const deleteRoom = useDeleteRoom({ roomId: room.id }, { queryClient })

  const language = languages.find(
    (l) => l.value === (room.editorLanguage as Language['value']),
  )!

  const LanguageIcon = language.logo!

  return (
    <div className='group/item first:border-t hover:bg-color-background-2 border-b border-color-border-subtle px-4 h-12 flex items-center gap-2 justify-between'>
      <div className='flex items-center gap-2'>
        {!!language?.logo && <LanguageIcon className='size-5 shrink-0' />}
        <span className='font-medium'>
          {room.title && room.title.length >= 1 ? room.title : 'Untitled room'}
        </span>
        {/* <span>{room.editorLanguage}</span> */}
      </div>
      <div className='hidden group-hover/item:flex items-center gap-1'>
        <Button
          size='sm'
          asChild
          tooltip={{
            content: 'Open code room',
          }}
        >
          <Link href={`/${room.slug}`}>
            <SquareArrowUpRightIcon className='size-fit' />
          </Link>
        </Button>
        <Button
          size='sm'
          variant='secondary'
          tooltip={{
            content: 'Copy URL',
          }}
        >
          <LinkIcon className='size-fit' />
        </Button>
        <Button
          size='sm'
          variant='destructive'
          tooltip={{
            content: 'Delete code room',
          }}
          onClick={() => {
            deleteRoom.mutate()
          }}
        >
          <TrashIcon className='size-4 shrink-0' />
        </Button>
      </div>
    </div>
  )
}
