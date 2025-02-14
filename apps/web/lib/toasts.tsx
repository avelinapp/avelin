import { toast } from '@avelin/ui/sonner'

export const dashboardComingSoonToast = () =>
  toast('Dashboard is coming soon...', {
    id: 'dashboard-navigation-incomplete',
    icon: '👀',
  })

export const preferencesComingSoonToast = () =>
  toast('Preferences are coming soon...', {
    id: 'preferences-navigation-incomplete',
    icon: '👀',
  })

const rooms = {
  create: {
    success: (roomId: string) =>
      toast('Room created.', {
        description: `Room ID: ${roomId}`,
      }),
    error: (error: Error) =>
      toast.error('Failed to create room.', {
        description: (
          <div>
            <p>Error: {error.message}</p>
          </div>
        ),
      }),
  },
  delete: {
    success: (roomId: string) =>
      toast('Room deleted.', {
        description: `${roomId}`,
      }),
    error: (roomId: string, error: Error) =>
      toast.error('Failed to delete room.', {
        description: (
          <div>
            <p>Room ID: {roomId}</p>
            <p>Error: {error.message}</p>
          </div>
        ),
      }),
  },
} as const

export const toasts = {
  rooms,
  misc: {
    dashboardComingSoonToast,
    preferencesComingSoonToast,
  },
}
