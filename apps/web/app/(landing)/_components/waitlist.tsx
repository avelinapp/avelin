import { AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import WaitlistConfirmation from './waitlist-confirmation'
import { WaitlistForm } from './waitlist-form'

export function Waitlist() {
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')
  const [showPostSignup, setShowPostSignup] = useState(false)

  useEffect(() => {
    if (status === 'success') {
      setTimeout(() => {
        setShowPostSignup(true)
      }, 1500)
    }
  }, [status])

  return (
    <AnimatePresence mode="popLayout">
      {!showPostSignup ? (
        <WaitlistForm status={status} setStatus={setStatus} />
      ) : (
        <WaitlistConfirmation />
      )}
    </AnimatePresence>
  )
}
