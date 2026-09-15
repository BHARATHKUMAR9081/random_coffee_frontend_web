import { useEffect, useRef, useState } from 'react'

interface HubData {
  id: string
  name: string
  region: string
  activeCount: string
  role: string
  x: number // percentage 0 - 100 based on 950x620 world projection
  y: number // percentage 0 - 100 based on 950x620 world projection
}

const GLOBAL_HUBS: HubData[] = [
  {
    id: 'sf',
    name: 'Silicon Valley',
    region: 'US-WEST',
    activeCount: '450+',
    role: 'Seed & Series A Founders',
    x: 15.3,
    y: 31.3,
  },
  {
    id: 'nyc',
    name: 'New York City',
    region: 'US-EAST',
    activeCount: '380+',
    role: 'Venture Partners & Angels',
    x: 27.2,
    y: 31.6,
  },
  {
    id: 'sao-paulo',
    name: 'São Paulo',
    region: 'SA-EAST',
    activeCount: '280+',
    role: 'AgriTech & Logistics VPs',
    x: 35.4,
    y: 69.7,
  },
  {
    id: 'london',
    name: 'London',
    region: 'EU-WEST',
    activeCount: '850+',
    role: 'Enterprise Procurement VPs',
    x: 47.4,
    y: 27.7,
  },
  {
    id: 'dubai',
    name: 'Dubai',
    region: 'ME-CENTRAL',
    activeCount: '700+',
    role: 'Sovereign & Family Offices',
    x: 62.9,
    y: 42.7,
  },
  {
    id: 'bangalore',
    name: 'Bangalore & Mumbai',
    region: 'AP-SOUTH',
    activeCount: '950+',
    role: 'High-Growth Tech Founders',
    x: 69.7,
    y: 46.1,
  },
  {
    id: 'singapore',
    name: 'Singapore',
    region: 'AP-SOUTHEAST',
    activeCount: '550+',
    role: 'FinTech & Trade Directors',
    x: 78.3,
    y: 53.9,
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    region: 'AP-NORTHEAST',
    activeCount: '410+',
    role: 'Hardware & Auto Execs',
    x: 86.1,
    y: 33.1,
  },
  {
    id: 'sydney',
    name: 'Sydney',
    region: 'AP-OCEANIA',
    activeCount: '320+',
    role: 'Biotech & Cloud Directors',
    x: 87.9,
    y: 75.5,
  },
]

// Network connection routes between real geographic hubs
const NETWORK_ROUTES: [string, string][] = [
  ['sf', 'nyc'],
  ['sf', 'sao-paulo'],
  ['nyc', 'london'],
  ['nyc', 'sao-paulo'],
  ['london', 'dubai'],
  ['london', 'bangalore'],
  ['dubai', 'bangalore'],
  ['bangalore', 'singapore'],
  ['singapore', 'tokyo'],
  ['singapore', 'sydney'],
]

export function GlobalMeshCanvas3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // Default to Singapore (550+) matching Cerebrium screenshot
  const [activeHub, setActiveHub] = useState<HubData>(GLOBAL_HUBS[6])
  const [hoveredHub, setHoveredHub] = useState<HubData | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = 0
    let height = 0

    function updateSize() {
      if (!canvas || !canvas.parentElement) return
      const rect = canvas.parentElement.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx?.setTransform(1, 0, 0, 1, 0, 0)
      ctx?.scale(dpr, dpr)
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    // Generate random seed offsets for data pulses
    const pulseSeeds = NETWORK_ROUTES.map((_, i) => ({
      speed: 0.18 + (i % 4) * 0.04,
      offset: (i * 0.23) % 1,
    }))

    let time = 0

    function render() {
      if (!ctx || width === 0 || height === 0) return
      time += 0.015
      ctx.clearRect(0, 0, width, height)

      const currentHub = hoveredHub || activeHub

      // 1. Draw concentric radar range circles around hubs
      GLOBAL_HUBS.forEach((hub) => {
        const hx = (hub.x / 100) * width
        const hy = (hub.y / 100) * height
        const isCurrent = currentHub?.id === hub.id

        // Static subtle range rings
        ctx.strokeStyle = isCurrent ? 'rgba(245, 158, 11, 0.25)' : 'rgba(212, 175, 55, 0.08)'
        ctx.lineWidth = 1

        ctx.beginPath()
        ctx.arc(hx, hy, 18, 0, Math.PI * 2)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(hx, hy, 34, 0, Math.PI * 2)
        ctx.stroke()

        // Dynamic expanding ping ripple for active/hovered hub
        if (isCurrent) {
          const ping = (time * 1.6) % 1
          const pingRadius = 10 + ping * 36
          const pingAlpha = Math.max(0, 1 - ping) * 0.7

          ctx.strokeStyle = `rgba(245, 158, 11, ${pingAlpha})`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(hx, hy, pingRadius, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Core glowing node dot
        ctx.fillStyle = isCurrent ? '#fde047' : '#f59e0b'
        ctx.shadowColor = '#f59e0b'
        ctx.shadowBlur = isCurrent ? 12 : 5
        ctx.beginPath()
        ctx.arc(hx, hy, isCurrent ? 4 : 2.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // 2. Draw curved geodesic network connection arcs
      NETWORK_ROUTES.forEach(([fromId, toId], idx) => {
        const h1 = GLOBAL_HUBS.find((h) => h.id === fromId)
        const h2 = GLOBAL_HUBS.find((h) => h.id === toId)
        if (!h1 || !h2) return

        const x1 = (h1.x / 100) * width
        const y1 = (h1.y / 100) * height
        const x2 = (h2.x / 100) * width
        const y2 = (h2.y / 100) * height

        // Calculate arched midpoint
        const mx = (x1 + x2) / 2
        const my = (y1 + y2) / 2
        const dist = Math.hypot(x2 - x1, y2 - y1)
        const curveLift = Math.min(dist * 0.22, height * 0.22)
        const cx = mx
        const cy = my - curveLift

        const isHighlighted =
          currentHub?.id === fromId || currentHub?.id === toId

        // Arc path
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.quadraticCurveTo(cx, cy, x2, y2)

        if (isHighlighted) {
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.65)'
          ctx.lineWidth = 1.8
          ctx.shadowColor = '#f59e0b'
          ctx.shadowBlur = 8
        } else {
          ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)'
          ctx.lineWidth = 1.0
          ctx.shadowBlur = 0
        }
        ctx.setLineDash([4, 4])
        ctx.stroke()
        ctx.setLineDash([])
        ctx.shadowBlur = 0

        // Traveling photon data packet along the arc
        const { speed, offset } = pulseSeeds[idx]
        const t = (time * speed + offset) % 1
        const bx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2
        const by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2

        // Photon glow
        ctx.beginPath()
        ctx.arc(bx, by, isHighlighted ? 3 : 2, 0, Math.PI * 2)
        ctx.fillStyle = isHighlighted ? '#ffffff' : '#fde047'
        ctx.shadowColor = '#f59e0b'
        ctx.shadowBlur = isHighlighted ? 12 : 6
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', updateSize)
    }
  }, [activeHub, hoveredHub])

  return (
    <div className="relative w-full rounded-2xl bg-[#080D18] border border-slate-800 shadow-2xl p-4 sm:p-5 text-white select-none overflow-hidden flex flex-col justify-between">
      {/* Top Telemetry Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 font-mono text-[10px]">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          CAPACITY : 3,500+ VERIFIED
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-[10px] tracking-widest">
          <span>REGIONS : US-EAST, EU-WEST, ME-CENTRAL, AP-SOUTH</span>
          <span className="hidden sm:inline text-emerald-400/90 font-semibold">• MESH SYNC: 14ms</span>
        </div>
      </div>

      {/* Real World Map Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[950/560] min-h-[260px] sm:min-h-[320px] md:min-h-[380px] my-2.5 rounded-xl overflow-hidden bg-[#060913] border border-slate-800/60"
      >
        {/* Subtle Latitude / Longitude Navigation Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute left-1/4 top-0 bottom-0 border-r border-dashed border-slate-700" />
          <div className="absolute left-2/4 top-0 bottom-0 border-r border-dashed border-slate-700" />
          <div className="absolute left-3/4 top-0 bottom-0 border-r border-dashed border-slate-700" />
          <div className="absolute top-1/3 left-0 right-0 border-b border-dashed border-slate-700" />
          <div className="absolute top-2/3 left-0 right-0 border-b border-dashed border-slate-700" />
        </div>

        {/* Real World Continent SVG Map Asset */}
        <img
          src="/textures/world-map.svg"
          alt="Real World Network Map"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none opacity-85"
        />

        {/* Dynamic Curved Arcs, Photons, and Radar Ripple Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[5]" />

        {/* Global Hub Floating Badges matching Cerebrium screenshot */}
        {GLOBAL_HUBS.map((hub) => {
          const isSelected = activeHub.id === hub.id
          const isHovered = hoveredHub?.id === hub.id
          const isActive = isSelected || isHovered

          return (
            <button
              key={hub.id}
              type="button"
              onClick={() => setActiveHub(hub)}
              onMouseEnter={() => setHoveredHub(hub)}
              onMouseLeave={() => setHoveredHub(null)}
              style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-tight transition-all duration-200 z-10 flex items-center gap-1.5 cursor-pointer shadow-lg ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 scale-110 shadow-[0_0_20px_rgba(245,158,11,0.6)] ring-2 ring-white/70'
                  : 'bg-slate-950/90 hover:bg-slate-900 text-amber-300 border border-amber-500/30 hover:border-amber-400/60 hover:scale-105'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive ? 'bg-black animate-pulse' : 'bg-amber-400'
                }`}
              />
              {hub.activeCount}
            </button>
          )
        })}
      </div>

      {/* Bottom Hub Details Telemetry Drawer */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-[11px] font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-amber-400 font-bold">{activeHub.name}</span>
          <span className="text-slate-500 font-medium">[{activeHub.region}]</span>
          <span className="text-slate-300 font-sans text-[11px]">{activeHub.role}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-semibold shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          Avg Match Speed: 14.2s
        </div>
      </div>
    </div>
  )
}
