/******************************************************************************
 * This component is a modified version of the one found in the following repo:
 * https://github.com/midday-ai/midday/blob/main/packages/ui/src/components/animated-size-container.tsx
 *
 * The license for the original component can be found in the following file:
 * https://github.com/midday-ai/midday/blob/main/LICENSE
 ******************************************************************************/

import { cn } from '@avelin/ui/cn'
import { useResizeObserver } from '@avelin/ui/hooks'
import { motion } from 'motion/react'
import {
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
  forwardRef,
  useRef,
} from 'react'

type AnimatedSizeContainerProps = PropsWithChildren<{
  width?: boolean
  height?: boolean
}> &
  Omit<ComponentPropsWithoutRef<typeof motion.div>, 'animate' | 'children'>

/**
 * A container with animated width and height (each optional) based on children dimensions
 */
const AnimatedSizeContainer = forwardRef<
  HTMLDivElement,
  AnimatedSizeContainerProps
>(
  (
    {
      width = false,
      height = false,
      className,
      transition,
      children,
      ...rest
    }: AnimatedSizeContainerProps,
    forwardedRef,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null)
    // @ts-ignore
    const resizeObserverEntry = useResizeObserver(containerRef)

    return (
      <motion.div
        ref={forwardedRef}
        className={cn('overflow-visible', className)}
        animate={{
          width: width
            ? (resizeObserverEntry?.contentRect?.width ?? 'auto')
            : 'auto',
          height: height
            ? (resizeObserverEntry?.contentRect?.height ?? 'auto')
            : 'auto',
        }}
        transition={transition ?? { type: 'spring', duration: 0.3 }}
        {...rest}
      >
        <div
          ref={containerRef}
          className={cn(height && 'h-max', width && 'w-max')}
        >
          {children}
        </div>
      </motion.div>
    )
  },
)

AnimatedSizeContainer.displayName = 'AnimatedSizeContainer'

export { AnimatedSizeContainer }
