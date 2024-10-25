'use client'

import { cn } from '@avelin/ui/cn'
import { useEffect, useState } from 'react'
import { useScramble } from 'use-scramble'

export default function Title() {
  const texts = ['code?', 'develop?', 'share?', 'work?']
  const [index, setIndex] = useState(0)

  const { ref: titleRef } = useScramble({
    text: texts[index],
    overflow: true,
    speed: 0.75,
    scramble: 6,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((index + 1) % 3)
    }, 3000)

    return () => clearInterval(timer)
  })

  return (
    <h1
      className={cn(
        'h-12 w-full p-1 text-center text-4xl font-bold tracking-tighter sm:h-24 sm:text-7xl',
        'bg-gradient-to-t from-gray-12/85 to-gray-12 bg-clip-text text-transparent',
      )}
    >
      Ready to <span ref={titleRef} />
    </h1>
  )
}
