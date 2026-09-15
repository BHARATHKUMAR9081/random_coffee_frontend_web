import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

export function BackgroundGradients() {
  const shouldReduceMotion = useReducedMotion()
  const { scrollY } = useScroll()

  // Hardware-accelerated CSS transforms only (translate3d)
  const y1 = useTransform(scrollY, [0, 2000], [0, shouldReduceMotion ? 0 : 180])
  const y2 = useTransform(scrollY, [0, 2000], [0, shouldReduceMotion ? 0 : -140])
  const rotate1 = useTransform(scrollY, [0, 2000], [0, shouldReduceMotion ? 0 : 25])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Warm Champagne Gold Ambient Glow Blob Top-Right */}
      <motion.div
        style={{
          y: y1,
          rotate: rotate1,
        }}
        className="absolute -top-40 -right-40 h-[650px] w-[650px] rounded-full bg-gradient-to-br from-amber-500/10 via-gold-500/5 to-transparent blur-3xl will-change-transform"
      />

      {/* Warm Caramel Amber Glow Blob Center-Left */}
      <motion.div
        style={{
          y: y2,
        }}
        className="absolute top-[35%] -left-48 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-amber-600/8 via-amber-400/4 to-transparent blur-3xl will-change-transform"
      />

      {/* Subtle Architectural Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-70" />
    </div>
  )
}
