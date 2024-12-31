'use client'

import { useCodeRoom } from '@/providers/code-room-provider'
import { cn } from '@avelin/ui/cn'
import { Input } from '@avelin/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@avelin/ui/tooltip'
import { memo, useEffect, useRef, useState } from 'react'

export const RoomTitle = memo(function RoomTitle() {
  const { roomTitle, setRoomTitle } = useCodeRoom()
  const [value, setValue] = useState(roomTitle)
  const ref = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setValue(roomTitle)
  }, [roomTitle])

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <Input
          ref={(node) => {
            ref.current = node
          }}
          className={cn(
            'font-medium text-base text-center transition-all border-transparent hover:border-color-border-subtle',
            'focus-visible:border-color-border-subtle overflow-ellipsis',
          )}
          placeholder='Room title...'
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          size='xs'
          onBlur={(e) => {
            setRoomTitle(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              ref.current?.blur()
            }
          }}
        />
      </TooltipTrigger>
      <TooltipContent
        className={cn(
          'text-xs border-color-border-subtle',
          'ease-out data-[side=bottom]:slide-out-to-top-1 data-[side=left]:slide-out-to-right-1 data-[side=right]:slide-out-to-left-1 data-[side=top]:slide-out-to-bottom-1',
        )}
      >
        Room title <span className='font-medium'>(click to edit)</span>
      </TooltipContent>
    </Tooltip>
  )
})
