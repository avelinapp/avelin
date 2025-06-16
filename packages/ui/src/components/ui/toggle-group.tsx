'use client'

import { cn } from '@avelin/ui/cn'
import { toggleVariants } from '@avelin/ui/toggle'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import type { VariantProps } from 'class-variance-authority'
import * as React from 'react'

type ToggleGroupVariantProps = VariantProps<typeof toggleVariants> & {
  spacing?: 'default' | 'none'
}

const ToggleGroupContext = React.createContext<ToggleGroupVariantProps>({
  size: 'default',
  variant: 'default',
  spacing: 'default',
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    ToggleGroupVariantProps
>(
  (
    { className, variant, size, spacing = 'default', children, ...props },
    ref,
  ) => (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn(
        'flex items-center justify-center gap-1',
        spacing === 'none' &&
          'gap-0 [&>*:first-child]:rounded-l-md [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:last-child]:rounded-r-md',
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, spacing }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  ),
)

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    ToggleGroupVariantProps
>(({ className, children, variant, size, spacing, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
