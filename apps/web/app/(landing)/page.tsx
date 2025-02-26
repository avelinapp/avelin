'use client'

import '../globals.css'
import '@avelin/ui/globals.css'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Header } from './_components/header'
import { containerVariants } from './_components/variants'
import WaitlistConfirmation from './_components/waitlist-confirmation'
import { WaitlistForm } from './_components/waitlist-form'

export default function Landing() {
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
    <motion.div
      className="flex w-full flex-1 h-full flex-col items-center justify-center gap-12 p-4 select-none"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Header />
      <AnimatePresence mode="popLayout">
        {!showPostSignup ? (
          <WaitlistForm status={status} setStatus={setStatus} />
        ) : (
          <WaitlistConfirmation />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
