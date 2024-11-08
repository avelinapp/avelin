import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@avelin/ui/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-1.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-bg text-primary-text hover:bg-primary-hover',
        secondary:
          'border-transparent bg-secondary-bg text-secondary-text hover:bg-secondary-hover',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  ref?: React.ForwardedRef<HTMLDivElement>
}

const Badge = React.forwardRef<
  HTMLDivElement,
  React.PropsWithoutRef<BadgeProps>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(badgeVariants({ variant }), className)}
    {...props}
  />
))

export { Badge, badgeVariants }
