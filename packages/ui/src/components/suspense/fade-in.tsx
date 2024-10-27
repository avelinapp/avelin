import { useState, useEffect } from 'react'

interface FadeInProps {
  children: React.ReactNode
}

function FadeIn({ children }: FadeInProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`${mounted ? 'animate-in fade-in-15 duration-300' : ''}`}>
      {children}
    </div>
  )
}

export default FadeIn
