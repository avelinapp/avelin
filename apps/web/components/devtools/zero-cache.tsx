import { Button } from '@avelin/ui/button'
import { useZero } from '@rocicorp/zero/react'

export default function ZeroCache() {
  const z = useZero()

  function clearZeroCache() {
    console.log(`[ZERO] Clearing zero cache in IndexedDB database ${z.idbName}`)
    const tx = window.indexedDB.deleteDatabase(z.idbName)

    tx.onsuccess = () => {
      console.log('[ZERO] Zero cache cleared - reloading the page...')
      location.reload()
    }

    tx.onerror = (e) => {
      console.error('[ZERO] Error clearing zero cache.', e)
    }
  }

  return (
    <Button
      className="w-fit bg-transparent hover:bg-gray-3 rounded-none hover:text-color-text-primary text-color-text-quaternary px-3"
      onClick={clearZeroCache}
    >
      <span>Nuke Zero cache</span>
    </Button>
  )
}
