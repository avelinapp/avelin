'use client'

import { cn } from '@avelin/ui/cn'
import { useState, useEffect } from 'react'

interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

function FadeIn({ children, className, ...props }: FadeInProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className={
        (cn(mounted && 'animate-in fade-in-15 duration-300'), className)
      }
      {...props}
    >
      {children}
    </div>
  )
}

export default FadeIn
