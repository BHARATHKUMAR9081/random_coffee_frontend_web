import { useEffect, useRef, memo } from 'react'

/**
 * Interface representing an individual particle dot on the canvas grid
 */
interface GridDot {
  /** Initial equilibrium anchor point (origin) */
  originX: number
  originY: number
  /** Current instantaneous position */
  x: number
  y: number
  /** Current instantaneous velocity vector */
  vx: number
  vy: number
  /** Base rendering radius in CSS pixels */
  baseRadius: number
  /** Target visual highlight factor [0, 1] */
  glowFactor: number
}

/**
 * Component configuration options for the interactive physics grid
 */
export interface InteractiveDotGridProps {
  /** Optional custom CSS classes applied to container */
  className?: string
  /** Distance between adjacent grid vertices in pixels (default: 28) */
  gridSpacing?: number
  /** Radius of cursor influence R_influence in pixels (default: 140) */
  influenceRadius?: number
  /** Maximum repulsion force magnitude F_max (default: 3.8) */
  maxRepulsion?: number
  /** Hooke's spring stiffness constant k (default: 0.085) */
  springK?: number
  /** Velocity damping coefficient c (default: 0.16) */
  dampingC?: number
  /** Default resting dot color (default: warm amber gold) */
  dotColor?: string
  /** Accent glow color when repelled (default: bright radiant amber) */
  glowColor?: string
}

/**
 * InteractiveDotGrid
 *
 * A high-performance HTML5 Canvas component that renders an interactive dot grid
 * powered by a real-time 2D physics engine.
 *
 * Mathematical Foundations:
 * 1. Mouse Repulsion Force:
 *    F_repulsion = (r / |r|) * (1 - |r| / R_influence) * F_max   (for |r| < R_influence)
 *
 * 2. Restoring Spring Force (Hooke's Law with Viscous Damping):
 *    F_spring = -k * (x - x_origin) - c * v
 *
 * 3. Numerical Integration (Semi-Implicit Euler):
 *    a = F_repulsion + F_spring
 *    v = v + a
 *    x = x + v
 */
export const InteractiveDotGrid = memo(function InteractiveDotGrid({
  className = '',
  gridSpacing = 28,
  influenceRadius = 140,
  maxRepulsion = 3.8,
  springK = 0.085,
  dampingC = 0.16,
  dotColor = 'rgba(212, 175, 55, 0.28)', // Elegant coffee gold
  glowColor = 'rgba(245, 158, 11, 0.95)', // Radiant active amber
}: InteractiveDotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Cursor state tracked outside React render cycles for zero-latency 60fps updates
  const mouseStateRef = useRef<{
    x: number
    y: number
    active: boolean
  }>({
    x: -1000,
    y: -1000,
    active: false,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let dots: GridDot[] = []
    let canvasWidth = 0
    let canvasHeight = 0

    /**
     * Initializes and positions dots evenly in a grid, scaled for high-DPI Retina screens
     */
    function setupGrid() {
      if (!canvas || !container || !ctx) return

      const rect = container.getBoundingClientRect()
      canvasWidth = rect.width
      canvasHeight = rect.height

      if (canvasWidth === 0 || canvasHeight === 0) return

      // Device Pixel Ratio scaling for crystal sharp rendering on Retina displays
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(canvasWidth * dpr)
      canvas.height = Math.floor(canvasHeight * dpr)

      // Normalize canvas coordinates to standard CSS pixels
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)

      // Calculate column and row count based on gridSpacing
      const cols = Math.ceil(canvasWidth / gridSpacing) + 1
      const rows = Math.ceil(canvasHeight / gridSpacing) + 1

      // Center grid within canvas bounds
      const offsetX = (canvasWidth - (cols - 1) * gridSpacing) / 2
      const offsetY = (canvasHeight - (rows - 1) * gridSpacing) / 2

      dots = []
      dots.length = cols * rows

      let index = 0
      for (let r = 0; r < rows; r++) {
        const y = offsetY + r * gridSpacing
        for (let c = 0; c < cols; c++) {
          const x = offsetX + c * gridSpacing
          dots[index++] = {
            originX: x,
            originY: y,
            x,
            y,
            vx: 0,
            vy: 0,
            baseRadius: 1.35,
            glowFactor: 0,
          }
        }
      }
    }

    setupGrid()

    /**
     * Mouse & Touch Event Handlers
     */
    function updateMousePosition(clientX: number, clientY: number) {
      if (!container) return
      const rect = container.getBoundingClientRect()
      mouseStateRef.current.x = clientX - rect.left
      mouseStateRef.current.y = clientY - rect.top
      mouseStateRef.current.active = true
    }

    function handleMouseMove(e: MouseEvent) {
      updateMousePosition(e.clientX, e.clientY)
    }

    function handleTouchMove(e: TouchEvent) {
      if (e.touches.length > 0) {
        updateMousePosition(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    function handleMouseLeave() {
      mouseStateRef.current.active = false
      mouseStateRef.current.x = -1000
      mouseStateRef.current.y = -1000
    }

    // Attach listeners to container and parent for smooth boundary interaction
    const interactiveTarget = container.parentElement || container
    interactiveTarget.addEventListener('mousemove', handleMouseMove, { passive: true })
    interactiveTarget.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    interactiveTarget.addEventListener('touchmove', handleTouchMove, { passive: true })
    interactiveTarget.addEventListener('touchend', handleMouseLeave, { passive: true })

    // ResizeObserver cleanly monitors container box dimension changes without layout thrashing
    const resizeObserver = new ResizeObserver(() => {
      setupGrid()
    })
    resizeObserver.observe(container)

    /**
     * Main Physics & Render Loop (60-120fps)
     */
    function physicsTick() {
      if (!ctx) return
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      const mouse = mouseStateRef.current
      const hasActiveCursor = mouse.active && mouse.x >= 0 && mouse.y >= 0
      const totalDots = dots.length

      for (let i = 0; i < totalDots; i++) {
        const dot = dots[i]

        // ------------------------------------------------------------------
        // 1. Mouse Repulsion Force Calculation
        // Formula: F_repulsion = (r / |r|) * (1 - |r| / R_influence) * F_max
        // ------------------------------------------------------------------
        let fxRepulsion = 0
        let fyRepulsion = 0
        let targetGlow = 0

        if (hasActiveCursor) {
          const rx = dot.x - mouse.x
          const ry = dot.y - mouse.y
          const distance = Math.hypot(rx, ry)

          if (distance < influenceRadius && distance > 0.001) {
            // Normalized direction vector r_hat = r / |r|
            const rHatX = rx / distance
            const rHatY = ry / distance

            // Linear decay factor: (1 - |r| / R_influence)
            const decay = 1 - distance / influenceRadius

            // Repulsion magnitude with smooth quadratic decay for organic repulsion feel
            const magnitude = decay * decay * maxRepulsion

            fxRepulsion = rHatX * magnitude
            fyRepulsion = rHatY * magnitude
            targetGlow = decay
          }
        }

        // ------------------------------------------------------------------
        // 2. Restoring Spring Force Calculation (Hooke's Law + Viscous Damping)
        // Formula: F_spring = -k * (x - x_origin) - c * v
        // ------------------------------------------------------------------
        const displacementX = dot.x - dot.originX
        const displacementY = dot.y - dot.originY

        const fxSpring = -springK * displacementX - dampingC * dot.vx
        const fySpring = -springK * displacementY - dampingC * dot.vy

        // ------------------------------------------------------------------
        // 3. Numerical Integration: a = F_total, v = v + a, x = x + v
        // ------------------------------------------------------------------
        const ax = fxRepulsion + fxSpring
        const ay = fyRepulsion + fySpring

        dot.vx += ax
        dot.vy += ay
        dot.x += dot.vx
        dot.y += dot.vy

        // Smooth glow interpolation
        dot.glowFactor += (targetGlow - dot.glowFactor) * 0.15

        // ------------------------------------------------------------------
        // 4. Render Dot
        // ------------------------------------------------------------------
        const radius = dot.baseRadius + dot.glowFactor * 1.1

        ctx.beginPath()
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2)

        if (dot.glowFactor > 0.06) {
          ctx.fillStyle = glowColor
          ctx.shadowColor = '#f59e0b'
          ctx.shadowBlur = dot.glowFactor * 7
          ctx.fill()
          ctx.shadowBlur = 0 // Reset shadow blur to avoid performance penalty on remaining dots
        } else {
          ctx.fillStyle = dotColor
          ctx.fill()
        }
      }

      animationFrameId = requestAnimationFrame(physicsTick)
    }

    animationFrameId = requestAnimationFrame(physicsTick)

    /**
     * Cleanup on component unmount
     */
    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      interactiveTarget.removeEventListener('mousemove', handleMouseMove)
      interactiveTarget.removeEventListener('mouseleave', handleMouseLeave)
      interactiveTarget.removeEventListener('touchmove', handleTouchMove)
      interactiveTarget.removeEventListener('touchend', handleMouseLeave)
    }
  }, [gridSpacing, influenceRadius, maxRepulsion, springK, dampingC, dotColor, glowColor])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
})
