'use client'

import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@avelin/ui/cn'
import { forwardRef } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

const buttonVariants = cva(
  'inline-flex items-center select-none justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-color-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-color-border-subtle focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary-bg text-primary-text hover:bg-primary-hover',
        destructive: 'bg-red-9 text-destructive-foreground hover:bg-red-10',
        outline:
          'border text-color-secondary border-color-border-subtle bg-background hover:bg-secondary-bg hover:border-color-border-strong',
        secondary:
          'bg-secondary-bg text-secondary-text hover:bg-secondary-hover',
        ghost: 'hover:bg-secondary-bg text-color-text-secondary',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-8 rounded-md px-2.5',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonTooltipProps = {
  className?: string
  content: React.ReactNode | string
  delayDuration?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  collisionPadding?: number
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  tooltip?: ButtonTooltipProps
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, tooltip, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    if (tooltip) {
      return (
        <Tooltip delayDuration={tooltip.delayDuration ?? 500}>
          <TooltipTrigger asChild>
            <Comp
              className={cn(buttonVariants({ variant, size, className }))}
              ref={ref}
              {...props}
            />
          </TooltipTrigger>
          <TooltipContent
            className={cn(
              'text-xs border-color-border-subtle',
              'ease-out data-[side=bottom]:slide-out-to-top-1 data-[side=left]:slide-out-to-right-1 data-[side=right]:slide-out-to-left-1 data-[side=top]:slide-out-to-bottom-1',
              tooltip.className,
            )}
            side={tooltip.side}
            align={tooltip.align}
            collisionPadding={tooltip.collisionPadding}
          >
            {tooltip.content}
          </TooltipContent>
        </Tooltip>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
