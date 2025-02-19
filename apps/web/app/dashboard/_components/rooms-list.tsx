'use client'

import { PostHogFeature } from 'posthog-js/react'
import RoomsListNetwork from './rooms-list.network'
import RoomsListZero from './rooms-list.zero'

export default function RoomsList() {
  return (
    <div className="flex-1 flex flex-col gap-4 h-full">
      <PostHogFeature
        className="flex-1 flex flex-col"
        flag="zero"
        match={false}
      >
        <RoomsListNetwork />
      </PostHogFeature>
      <PostHogFeature className="flex-1 flex flex-col" flag="zero" match={true}>
        <RoomsListZero />
      </PostHogFeature>
    </div>
  )
}
