'use client'

import { useFps } from 'react-fps'

export function FPSMeter() {
  const { currentFps } = useFps(1)

  return (
    <div className="flex items-center gap-2 tabular-nums px-2 font-medium font-mono w-[8ch]">
      <div className="w-full whitespace-nowrap">
        <span className="text-color-text-quaternary -mr-0.5">FPS:</span>{' '}
        {currentFps ?? 0}
      </div>
    </div>
  )
}
