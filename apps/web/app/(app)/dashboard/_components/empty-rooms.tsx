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
      <div className="space-y-6">
        <div className="space-y-4">
          <span>Create or join a code room</span>
          <div className="text-gray-11">
            <p>Your code rooms will be available to you from this dashboard.</p>
            <p>You can get started by creating a code room.</p>
          </div>
        </div>
        <Button onClick={handleCreateRoom} disabled={disabled}>
          Create room
        </Button>
      </div>
    </div>
  )
}
