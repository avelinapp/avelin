import { Button } from '@avelin/ui/button'
import { EmptyDashboardIcon } from './empty-state-icon'

interface Props {
  handleCreateRoom: () => void
  disabled?: boolean
}

export default function EmptyRooms({ handleCreateRoom, disabled }: Props) {
  return (
    <div className="flex items-center gap-8 m-auto">
      <EmptyDashboardIcon className="size-32 stroke-gray-8 stroke-1" />
      <div className="space-y-4">
        <p className="font-medium">Create or join a code room</p>
        <div>
          <p>Your code rooms will be available to you from this dashboard.</p>
          <p>You can get started by creating a code room.</p>
        </div>
        <Button onClick={handleCreateRoom} disabled={disabled}>
          Create room
        </Button>
      </div>
    </div>
  )
}
