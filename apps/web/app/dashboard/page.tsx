'use client'

import { Language, languages } from '@/lib/constants'
import { queries } from '@/lib/queries'
import { useQuery } from '@tanstack/react-query'

export default function Page() {
  const { data, error, isPending } = useQuery(queries.rooms.all())

  if (data) {
    console.log(data.map((room) => room.id))
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='space-y-2'>
        <h1 className='text-2xl font-semibold tracking-tight'>Code Rooms</h1>
        <p className='text-color-text-quaternary'>
          All your code rooms - past, present, and future.
        </p>
      </div>
      <div></div>
      <div>
        {isPending ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : (
          <div className='flex flex-col gap-1'>
            {data.map((room) => {
              const language = languages.find(
                (l) => l.value === (room.editorLanguage as Language['value']),
              )!

              const LanguageIcon = language.logo!

              return (
                <div
                  key={room.id}
                  className='rounded-md border border-color-border-subtle px-4 py-2 flex items-center gap-2'
                >
                  {!!language?.logo && (
                    <LanguageIcon className='size-5 shrink-0' />
                  )}
                  <span className='font-medium'>
                    {room.title && room.title.length >= 1
                      ? room.title
                      : 'Untitled room'}
                  </span>
                  <span>{room.editorLanguage}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
