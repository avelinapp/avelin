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
