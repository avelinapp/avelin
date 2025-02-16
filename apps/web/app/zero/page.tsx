'use client'

import type { ZeroSchema } from '@avelin/zero'
import { useQuery, useZero } from '@rocicorp/zero/react'

export default function Page() {
  const z = useZero<ZeroSchema>()

  // Get all rooms where either:
  // The room creator is the current user
  // The current user is a participant in the room

  const q = z.query.rooms.where('creatorId', '=', z.userID)

  const [rooms] = useQuery(q)

  return (
    <div>
      <h1>Zero</h1>
      <div className="flex flex-col gap-2">
        {rooms.map((room) => (
          <div key={room.id} className="flex items-center gap-2">
            <span>{!room.title ? 'Untitled' : room.title}</span>
            <span>{room.editorLanguage}</span>
          </div>
        ))}
      </div>
      {/* <pre>{JSON.stringify(rooms, null, '\t')}</pre> */}
    </div>
  )
}
