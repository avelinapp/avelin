'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-popover-bg group-[.toaster]:text-color-text-secondary group-[.toaster]:border-color-border-subtle group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg',
          description: 'group-[.toast]:text-secondary-text',
          actionButton:
            'group-[.toast]:bg-primary-bg group-[.toast]:text-primary-text',
          cancelButton:
            'group-[.toast]:bg-secondary-bg group-[.toast]:text-secondary-text',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
export { toast } from 'sonner'
