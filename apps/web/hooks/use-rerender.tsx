'use client'

import { useEffect, useState } from 'react'

export const useRerender = ({ frequency = 1000 }: { frequency?: number }) => {
  const [_, setNow] = useState<number>(Date.now())

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, frequency)

    return () => clearInterval(interval)
  }, [])

  return <></>
}
