'use client'

import { animate } from 'motion/react'
import { useAnimate } from 'motion/react-mini'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
// import ZeroProvider from './zero-provider'

const ZeroProvider = dynamic(() => import('./zero-provider'), { ssr: false })

export default function ZeroRootProvider({
  jwt,
  children,
}: { jwt?: string; children: React.ReactNode }) {
  const [scope, animate] = useAnimate()
  const [zeroMounted, setZeroMounted] = useState(false)

  useEffect(() => {
    if (zeroMounted) {
      animate(
        scope.current,
        { opacity: 1, filter: 'blur(0px)', scale: 1 },
        { ease: 'easeOut', duration: 0.2 },
      )
    }
  }, [zeroMounted, scope.current, animate])

  return (
    <div ref={scope} style={{ opacity: 0, filter: 'blur(2px)', scale: 0.995 }}>
      <ZeroProvider setMounted={setZeroMounted} jwt={jwt}>
        {children}
      </ZeroProvider>
    </div>
  )
}
