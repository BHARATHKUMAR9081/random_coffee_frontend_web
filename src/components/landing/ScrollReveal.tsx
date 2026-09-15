import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  yOffset?: number
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  yOffset = 30,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: shouldReduceMotion ? 0 : yOffset,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: shouldReduceMotion ? 0.1 : duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98] as const,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
