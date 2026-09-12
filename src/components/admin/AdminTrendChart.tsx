import { useMemo, useState } from 'react'

export type TrendPoint = {
  label: string
  value: number
}

function niceMax(value: number, emptyMax: number) {
  if (value <= 0) return emptyMax
  const padded = value * 1.25
  const power = 10 ** Math.floor(Math.log10(padded))
  let max = Math.ceil(padded / power) * power
  if (max % 2 !== 0) max += 1
  return Math.max(max, emptyMax)
}

const WIDTH = 400
const HEIGHT = 168
const PAD = { t: 12, b: 24, l: 0, r: 0 }

export function AdminTrendChart({
  title,
  subtitle,
  points,
  formatValue,
  kind = 'area',
  tone = 'gold',
  emptyMax = 4,
}: {
  title: string
  subtitle?: string
  points: TrendPoint[]
  formatValue: (value: number) => string
  kind?: 'area' | 'bar'
  tone?: 'gold' | 'navy'
  emptyMax?: number
}) {
  const [active, setActive] = useState<number | null>(null)
  const innerW = WIDTH
  const innerH = HEIGHT - PAD.t - PAD.b
  const max = useMemo(
    () => niceMax(Math.max(0, ...points.map((point) => point.value)), emptyMax),
    [points, emptyMax],
  )
  const shownIndex = active ?? (points.length ? points.length - 1 : 0)
  const hover = points[shownIndex]
  const previous = shownIndex > 0 ? points[shownIndex - 1] : undefined
  const delta = hover && previous ? hover.value - previous.value : 0
  const slot = points.length ? innerW / points.length : innerW
  const ticks = [1, 0.5, 0]

  const coords = points.map((point, index) => {
    const x = (index + 0.5) * slot
    const y = PAD.t + innerH - (point.value / max) * innerH
    return { ...point, x, y, index }
  })

  const area = coords.length
    ? `M ${coords[0].x} ${PAD.t + innerH} ${coords.map((point) => `L ${point.x} ${point.y}`).join(' ')} L ${coords[coords.length - 1].x} ${PAD.t + innerH} Z`
    : ''
  const line = coords.map((point) => `${point.x},${point.y}`).join(' ')
  const barW = slot * 0.46
  const stroke = tone === 'gold' ? '#d4a13d' : '#204364'
  const fill = tone === 'gold' ? 'rgba(212,161,61,0.22)' : 'rgba(32,67,100,0.16)'

  function onMove(event: React.MouseEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * WIDTH
    let nearest = 0
    let best = Infinity
    for (const point of coords) {
      const distance = Math.abs(point.x - x)
      if (distance < best) {
        best = distance
        nearest = point.index
      }
    }
    setActive(nearest)
  }

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-navy-900/10">
      <div className="grid min-h-[4.5rem] grid-cols-[minmax(0,1fr)_6.5rem] items-center gap-3 border-b border-navy-900/8 bg-navy-950/[0.03] px-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold uppercase tracking-wide text-navy-900/50">{title}</h3>
          {subtitle && <p className="mt-0.5 truncate text-xs text-navy-900/45">{subtitle}</p>}
        </div>
        <div className="text-right tabular-nums">
          <p className="text-lg font-semibold leading-none text-navy-950">{hover ? formatValue(hover.value) : '—'}</p>
          <p
            className={`mt-1 text-[11px] leading-none ${
              delta > 0 ? 'text-green-700' : delta < 0 ? 'text-red-600' : 'text-navy-900/40'
            }`}
          >
            {delta > 0 ? '+' : ''}
            {formatValue(delta)} vs last month
          </p>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-[3.25rem_minmax(0,1fr)] items-stretch px-3 pb-2 pt-2">
        <div className="relative">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="absolute right-2 -translate-y-1/2 text-[10px] tabular-nums text-navy-900/40"
              style={{ top: `${((PAD.t + innerH * (1 - tick)) / HEIGHT) * 100}%` }}
            >
              {formatValue(Math.round(max * tick))}
            </span>
          ))}
        </div>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-48 w-full"
          onMouseMove={onMove}
          onMouseLeave={() => setActive(null)}
          role="img"
          aria-label={title}
        >
          {ticks.map((tick) => {
            const y = PAD.t + innerH * (1 - tick)
            return <line key={tick} x1={0} x2={WIDTH} y1={y} y2={y} stroke="rgba(10,22,40,0.08)" />
          })}
          {kind === 'area' && (
            <>
              <path d={area} fill={fill} />
              <polyline points={line} fill="none" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
              {coords.map((point) => (
                <circle
                  key={point.index}
                  cx={point.x}
                  cy={point.y}
                  r={active === point.index ? 4.5 : 3}
                  fill={stroke}
                  stroke="#fff"
                  strokeWidth="1.5"
                />
              ))}
            </>
          )}
          {kind === 'bar' &&
            coords.map((point) => {
              const h = Math.max(2, PAD.t + innerH - point.y)
              return (
                <rect
                  key={point.index}
                  x={point.x - barW / 2}
                  y={point.y}
                  width={barW}
                  height={h}
                  rx="3"
                  fill={active === point.index || active == null ? stroke : fill}
                />
              )
            })}
          {coords.map((point) => (
            <text
              key={`l-${point.index}`}
              x={point.x}
              y={HEIGHT - 6}
              textAnchor="middle"
              className="fill-navy-900/45"
              fontSize="10"
            >
              {point.label}
            </text>
          ))}
        </svg>
      </div>
    </section>
  )
}
