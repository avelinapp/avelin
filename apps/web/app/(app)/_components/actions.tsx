'use client'

import { useAuth } from '@/providers/auth-provider'
import { LayoutGroup, motion } from 'motion/react'
import { AuthenticatedActions, UnauthenticatedActions } from './auth-actions'
import CreateRoomButton from './create-room-button'

export function Actions() {
  const { isAuthenticated, isAnonymous, isPending, user } = useAuth()

  return (
    <LayoutGroup id="actions">
      <motion.div layout className="inline-flex items-center gap-4 mt-4">
        <motion.div layout="position">
          <CreateRoomButton />
        </motion.div>
        {isPending ? null : isAuthenticated && !isAnonymous ? (
          <AuthenticatedActions user={user!} />
        ) : (
          <UnauthenticatedActions />
        )}
      </motion.div>
    </LayoutGroup>
  )
}
