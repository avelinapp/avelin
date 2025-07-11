import { cn } from '@avelin/ui/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

export const inputVariants = cva(
  'flex w-full rounded-md border border-color-border-subtle bg-popover-bg text-sm placeholder:text-color-text-primary/50 ring-offset-color-background transition-shadow duration-150 ease-out focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-color-border-subtle focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-10 px-3 py-2',
        sm: 'h-9 px-3 py-2',
        xs: 'h-8 px-2 py-1.5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
