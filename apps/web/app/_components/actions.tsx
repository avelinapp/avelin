'use client'

import AuthActions from './auth-actions'
import CreateRoomButton from './create-room-button'

export default function Actions() {
  return (
    <div className='inline-flex items-center gap-4 mt-4'>
      <CreateRoomButton />
      <AuthActions />
    </div>
  )
}
