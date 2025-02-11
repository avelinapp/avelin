'use client'

import { type HTMLMotionProps, motion } from 'motion/react'

export function FadeInContainer({
  className,
  children,
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(2px)', scale: 0.99, translateY: 5 }}
      animate={{ opacity: 1, filter: 'blur(0px', scale: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
