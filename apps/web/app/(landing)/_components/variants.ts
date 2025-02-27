import type { Variants } from 'motion/react'

export const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.5,
    },
  },
}

export const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.99,
    translateY: 5,
    filter: 'blur(2px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    translateY: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.75,
      ease: 'easeOut',
    },
  },
}
