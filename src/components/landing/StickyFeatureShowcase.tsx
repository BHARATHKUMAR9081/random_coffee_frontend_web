import { useState, useRef, useEffect } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
  type Transition,
} from 'framer-motion'
import { GlobalMeshCanvas3D } from './GlobalMeshCanvas3D'

// ─── Feature data ─────────────────────────────────────────────────────────────

const FEATURES = [
  {
    num: '01',
    tag: 'SUB-SECOND MATCHING',
    subtitle: 'Fast business matching',
    title: '18s Match Latency',
    desc: 'Deterministic pairing vector matching executives instantly, eliminating weeks of cold outreach.',
    metrics: [
      { label: 'DISCOVERY SPEED', value: '2–4s' },
      { label: 'CONFIDENCE', value: '99.2%' },
      { label: 'COLD CALLS', value: '0' },
    ],
    footnote: '94.2% of matched calls result in follow-up pipeline activity within 48 hours.',
  },
  {
    num: '02',
    tag: 'WORLDWIDE REACH',
    subtitle: 'Verified executive network',
    title: 'Global Executive Mesh',
    desc: 'Instant access to verified decision makers across San Francisco, London, Dubai, Bangalore, and Singapore.',
    metrics: [
      { label: 'VERIFIED PEERS', value: '3,500+' },
      { label: 'TOP HUBS', value: '8 Cities' },
      { label: 'GLOBAL LATENCY', value: '<50ms' },
    ],
    footnote: 'Ultra-low latency mesh routing connects global founders with tier-1 enterprise partners.',
  },
  {
    num: '03',
    tag: 'ZERO-DOWNLOAD WEBRTC',
    subtitle: 'Measurable business connections',
    title: '2-Min Encrypted Video Rooms',
    desc: 'Browser-native peer-to-peer WebRTC video rooms with mutual contact exchange and auto-close timer.',
    metrics: [
      { label: 'CALL DURATION', value: '120s' },
      { label: 'ENCRYPTION', value: 'E2EE' },
      { label: 'CONTACT SWAP', value: '1-Tap' },
    ],
    footnote: 'Double-blind contact sharing guarantees zero unsolicited spam or unconsented data sales.',
  },
] as const

// ─── Right-side visual panels ──────────────────────────────────────────────

function BenchmarkPanel() {
  const [mode, setMode] = useState<'venture' | 'enterprise'>('venture')

  return (
    <div className="relative w-full rounded-2xl bg-[#080D18] border border-slate-800 shadow-2xl p-4 sm:p-5 text-white select-none overflow-hidden flex flex-col justify-between">
      {/* Top Telemetry Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 font-mono text-[10px]">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          BENCHMARK : TIME TO DECISION MAKER
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 bg-slate-900/90 border border-slate-800 rounded-lg text-[10px] font-mono">
            <button
              type="button"
              onClick={() => setMode('venture')}
              className={`px-2.5 py-0.5 rounded-md transition-all font-medium cursor-pointer ${
                mode === 'venture'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              VC & Seed
            </button>
            <button
              type="button"
              onClick={() => setMode('enterprise')}
              className={`px-2.5 py-0.5 rounded-md transition-all font-medium cursor-pointer ${
                mode === 'enterprise'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Enterprise
            </button>
          </div>
          <span className="hidden sm:inline text-slate-500 text-[10px]">SAMPLE: 4,200+ EXECS</span>
        </div>
      </div>

      {/* Main Center Display Stage */}
      <div className="relative w-full aspect-[950/560] min-h-[260px] sm:min-h-[320px] md:min-h-[380px] my-2.5 rounded-xl overflow-hidden bg-[#060913] border border-slate-800/60 p-3.5 sm:p-5 flex flex-col justify-between">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute left-1/4 top-0 bottom-0 border-r border-dashed border-slate-700" />
          <div className="absolute left-2/4 top-0 bottom-0 border-r border-dashed border-slate-700" />
          <div className="absolute left-3/4 top-0 bottom-0 border-r border-dashed border-slate-700" />
          <div className="absolute top-1/2 left-0 right-0 border-b border-dashed border-slate-700" />
        </div>

        {/* Ambient Gradient Flare */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Row: RandomCoffee Deterministic Speed */}
        <div className="relative z-10 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 p-3 sm:p-4">
          <div className="flex items-center justify-between font-mono mb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-amber-300 font-bold text-xs tracking-wide">
                RANDOMCOFFEE DETERMINISTIC ENGINE
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[9px] font-bold">
                99.8% FASTER
              </span>
            </div>
            <div className="text-right">
              <span className="text-amber-400 font-display font-bold text-lg sm:text-xl tracking-tight">
                {mode === 'venture' ? '18.4s' : '24.2s'}
              </span>
              <span className="text-slate-400 text-[9px] block">MEDIAN TIME TO PARTNER</span>
            </div>
          </div>

          {/* Animated Glowing Progress Bar */}
          <div className="relative h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-amber-500/40 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-200 rounded-full transition-all duration-700 relative shadow-[0_0_16px_rgba(245,158,11,0.8)]"
              style={{ width: mode === 'venture' ? '14%' : '18%' }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_#ffffff]" />
            </div>
          </div>
        </div>

        {/* Comparison Channel Rows */}
        <div className="relative z-10 space-y-2.5 my-auto">
          {[
            {
              channel: 'LINKEDIN COLD INMAIL',
              stat: '14 Days (1.2M sec)',
              note: '4.8% response rate · $99/mo subscription',
              width: '52%',
            },
            {
              channel: 'INDUSTRY SUMMITS & CONFERENCES',
              stat: '21 Days + $4,200',
              note: 'Ticket, flight & hotel · High friction',
              width: '74%',
            },
            {
              channel: 'RETAINED EXECUTIVE HEADHUNTER',
              stat: '60 Days avg cycle',
              note: '30% first-year placement compensation',
              width: '98%',
            },
          ].map((row) => (
            <div
              key={row.channel}
              className="p-2 sm:p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between text-[10px] font-mono mb-1 gap-1">
                <span className="text-slate-300 font-semibold">{row.channel}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[9px]">{row.note}</span>
                  <span className="text-slate-200 font-bold">{row.stat}</span>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
                <div
                  className="h-full bg-slate-600/70 rounded-full transition-all duration-500"
                  style={{ width: row.width }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Metrics HUD Strip inside center stage */}
        <div className="relative z-10 grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/70 text-center font-mono">
          <div className="bg-slate-950/70 rounded-md py-1 border border-slate-800/60">
            <div className="text-amber-400 font-bold text-xs">184 HRS</div>
            <div className="text-[8.5px] text-slate-400 tracking-wider uppercase">Saved / Exec / Yr</div>
          </div>
          <div className="bg-slate-950/70 rounded-md py-1 border border-slate-800/60">
            <div className="text-amber-400 font-bold text-xs">0%</div>
            <div className="text-[8.5px] text-slate-400 tracking-wider uppercase">Cold Outreach Waste</div>
          </div>
          <div className="bg-slate-950/70 rounded-md py-1 border border-slate-800/60">
            <div className="text-amber-400 font-bold text-xs">94.2%</div>
            <div className="text-[8.5px] text-slate-400 tracking-wider uppercase">Pipeline Conversion</div>
          </div>
        </div>
      </div>

      {/* Bottom Details Drawer */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-[11px] font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-amber-400 font-bold">Audited ROI</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-300 font-sans text-[11px]">
            94.2% of matched executive calls convert to active deal pipeline in 48 hours.
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-semibold shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          Verified ROI Engine
        </div>
      </div>
    </div>
  )
}

function GlobePanel() {
  return <GlobalMeshCanvas3D />
}


function VideoPanel() {
  const [exchanged, setExchanged] = useState(false)
  const [micMuted, setMicMuted] = useState(false)
  const [camMuted, setCamMuted] = useState(false)
  const [seconds, setSeconds] = useState(108) // 01:48

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 1 ? prev - 1 : 120))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `0${m}:${sec < 10 ? '0' : ''}${sec}`
  }

  return (
    <div className="relative w-full rounded-2xl bg-[#080D18] border border-slate-800 shadow-2xl p-4 sm:p-5 text-white select-none overflow-hidden flex flex-col justify-between">
      {/* Top Telemetry Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 font-mono text-[10px]">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          WEBRTC DEAL ROOM : #RC-48201
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
            {formatTimer(seconds)} REMAINING
          </div>
          <span className="hidden sm:inline text-slate-400 text-[10px]">E2EE AES-256 P2P</span>
        </div>
      </div>

      {/* Main Center Display Stage */}
      <div className="relative w-full aspect-[950/560] min-h-[260px] sm:min-h-[320px] md:min-h-[380px] my-2.5 rounded-xl overflow-hidden bg-[#060913] border border-slate-800/60 p-3 sm:p-4 flex flex-col justify-between">
        {/* Center HUD Latency Watermark */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 px-2.5 py-0.5 rounded bg-slate-950/85 border border-slate-800 font-mono text-[9px] text-slate-400 flex items-center gap-1.5 shadow-md">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>DIRECT P2P · 14ms LATENCY · ZERO-CLOUD PROXY</span>
        </div>

        {/* Video Feeds Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 pt-6 pb-2">
          {/* Stream 1: Founder (You) */}
          <div className="relative rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-amber-500/30 p-3.5 sm:p-4 flex flex-col justify-between shadow-lg overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Stream Top Header */}
            <div className="flex items-center justify-between text-[10px] font-mono z-10">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Founder (You)
              </span>
              <span className="text-amber-400 text-[9px] px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/30 font-semibold">
                VERIFIED PROFILE
              </span>
            </div>

            {/* Stream Center Avatar & Active Speaker Ring */}
            <div className="text-center py-2 z-10">
              <div className="relative inline-block">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-200 text-slate-950 font-bold text-lg sm:text-xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] ring-4 ring-amber-500/30">
                  S
                </div>
                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-[8px] font-bold text-black">
                  ✓
                </span>
              </div>
              <h5 className="mt-2 text-sm font-display font-semibold text-white">Subash S.</h5>
              <p className="text-[10px] text-amber-300/80 font-mono">Founder & CEO · Seed AI</p>
            </div>

            {/* Stream Bottom Controls & Waveform */}
            <div className="flex items-center justify-between z-10 pt-2 border-t border-slate-800/70">
              {/* Mic & Cam toggleable pills */}
              <div className="flex items-center gap-1.5 font-mono text-[9px]">
                <button
                  type="button"
                  onClick={() => setMicMuted(!micMuted)}
                  className={`px-2 py-0.5 rounded cursor-pointer transition ${
                    micMuted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {micMuted ? 'MIC OFF' : 'MIC ON'}
                </button>
                <button
                  type="button"
                  onClick={() => setCamMuted(!camMuted)}
                  className={`px-2 py-0.5 rounded cursor-pointer transition ${
                    camMuted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {camMuted ? 'CAM OFF' : '1080p'}
                </button>
              </div>

              {/* Animated Audio Equalizer Waveform */}
              <div className="flex items-center gap-0.5 h-3">
                {[45, 80, 95, 60, 85, 50, 90, 40, 75, 55, 30].map((h, i) => (
                  <span
                    key={i}
                    className="w-0.5 bg-amber-400 rounded-full animate-pulse"
                    style={{
                      height: micMuted ? '20%' : `${h}%`,
                      animationDelay: `${i * 90}ms`,
                      animationDuration: '0.8s',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Stream 2: Matched Partner */}
          <div className="relative rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-cyan-500/30 p-3.5 sm:p-4 flex flex-col justify-between shadow-lg overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Stream Top Header */}
            <div className="flex items-center justify-between text-[10px] font-mono z-10">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Matched Executive
              </span>
              <span className="text-emerald-400 text-[9px] px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40">
                EXECUTIVE MEMBER
              </span>
            </div>

            {/* Stream Center Avatar & Active Speaker Ring */}
            <div className="text-center py-2 z-10">
              <div className="relative inline-block">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-300 text-white font-bold text-lg sm:text-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] ring-4 ring-cyan-500/30">
                  M
                </div>
                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-[8px] font-bold text-black">
                  ✓
                </span>
              </div>
              <h5 className="mt-2 text-sm font-display font-semibold text-white">Michael R.</h5>
              <p className="text-[10px] text-cyan-300/80 font-mono">Managing Partner · Tier-1 Venture</p>
            </div>

            {/* Stream Bottom Controls & Waveform */}
            <div className="flex items-center justify-between z-10 pt-2 border-t border-slate-800/70">
              <span className="text-[9px] font-mono text-slate-400">SPEAKER ACTIVE</span>

              {/* Animated Audio Equalizer Waveform */}
              <div className="flex items-center gap-0.5 h-3">
                {[35, 60, 85, 45, 95, 70, 50, 85, 65, 40, 25].map((h, i) => (
                  <span
                    key={i}
                    className="w-0.5 bg-cyan-400 rounded-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${i * 110}ms`,
                      animationDuration: '0.9s',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Mutual Card Exchange Bar */}
        <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono">
          <div className="text-[10px] text-slate-400">
            {exchanged
              ? '✓ Cards exchanged! Direct LinkedIn, email & WhatsApp unlocked.'
              : 'Auto-destruct timer active. Swap cards before room expires.'}
          </div>
          <button
            type="button"
            onClick={() => setExchanged(!exchanged)}
            className={`px-3.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-lg transition-all duration-300 cursor-pointer ${
              exchanged
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
            }`}
          >
            {exchanged ? 'CARDS EXCHANGED ✓' : 'EXCHANGE CARDS ⚡'}
          </button>
        </div>
      </div>

      {/* Bottom Details Drawer */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-[11px] font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-amber-400 font-bold">Double-Blind Exchange</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-300 font-sans text-[11px]">
            Zero spam or unconsented data sales. Contact details unlock only if both parties agree.
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-semibold shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          Encrypted P2P · Guard Active
        </div>
      </div>
    </div>
  )
}

const PANELS = [BenchmarkPanel, GlobePanel, VideoPanel]

// ─── Animation config ──────────────────────────────────────────────────────────

const EASE = [0.21, 0.47, 0.32, 0.98] as const

const TEXT_TRANSITION: Transition = { duration: 0.4, ease: EASE }
const PANEL_TRANSITION: Transition = { duration: 0.4, ease: EASE }

// ─── Mobile stacked fallback ───────────────────────────────────────────────────

function MobileLayout() {
  return (
    <section className="md:hidden bg-[#F8FAFC] text-slate-900 shadow-[0_-25px_50px_-25px_rgba(0,0,0,0.6)] border-t border-slate-800/80 rounded-t-[2.5rem] px-6 sm:px-10 pt-12 pb-20">
      <div className="mb-8 pb-6 border-b border-slate-200">
        <span className="font-mono text-[10px] font-semibold tracking-widest text-slate-500 uppercase">WHY RANDOMCOFFEE</span>
        <h2 className="font-display font-medium text-2xl text-slate-900 mt-2 leading-tight">
          Executive speed without the networking complexity
        </h2>
      </div>
      <div className="space-y-14">
        {FEATURES.map((f, idx) => {
          const Panel = PANELS[idx]
          return (
            <motion.div
              key={f.num}
              id={`mobile-feature-${idx}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-5"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-amber-500 text-black">{f.num} / 04</span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-amber-600 font-semibold">{f.tag}</span>
              </div>
              <h3 className="font-display font-semibold text-2xl text-slate-900 leading-tight">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200">
                {f.metrics.map(m => (
                  <div key={m.label}>
                    <div className="font-display font-bold text-slate-900 text-xl">{m.value}</div>
                    <div className="font-mono text-[9px] text-slate-500 tracking-wider uppercase mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
              <Panel />
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

// ─── Main export ───────────────────────────────────────────────────────────────

export function StickyFeatureShowcase() {
  const [activeStep, setActiveStep] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  // sectionRef goes on the OUTER 450vh element — this provides the scroll timeline
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Map 0→1 into 3 equal stages (0–0.33, 0.33–0.66, 0.66–1.0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(2, Math.floor(v * 3))
    setActiveStep(prev => (prev !== next ? next : prev))
  })

  const feat = FEATURES[activeStep]
  const Panel = PANELS[activeStep]

  return (
    <>
      {/* ── Mobile layout ── */}
      <MobileLayout />

      {/* ── Desktop layout ── */}
      {/*
        STRUCTURE:
          <section .scroll-story-section>   ← 450vh, position:relative
            <div .scroll-story-screen>      ← sticky top:0, height:100vh, overflow:hidden
              <div .scroll-story-inner>     ← flex align-items:center, height:100%
                content...
              </div>
            </div>
          </section>

        The section ref tracks scroll. The screen stays pinned.
        No transform, no overflow:hidden on ancestors.
      */}
      <section
        ref={sectionRef}
        id="capabilities-section"
        className="scroll-story-section hidden md:block"
        style={{
          position: 'relative',
          height: '350vh',
          width: '100%',
          backgroundColor: '#F8FAFC',
        }}
      >
        <div
          className="scroll-story-screen text-slate-900 rounded-t-[3.5rem] shadow-[0_-25px_50px_-25px_rgba(0,0,0,0.6)] border-t border-slate-800/80"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
            backgroundColor: '#F8FAFC',
            zIndex: 30,
          }}
        >

          <div
            className="scroll-story-inner"
            style={{
              position: 'relative',
              zIndex: 10,
              paddingTop: '6rem',
              paddingBottom: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ width: '100%', maxWidth: '76rem', margin: '0 auto', padding: '0 3rem' }}>

              {/* ── Top header row ── */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                paddingBottom: '0.85rem',
                marginBottom: '1.25rem',
                borderBottom: '1px solid rgba(148,163,184,0.25)',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                    <span style={{ height: 7, width: 7, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: '#64748b', textTransform: 'uppercase' }}>
                      WHY RANDOMCOFFEE
                    </span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(1.15rem, 1.6vw, 1.45rem)', color: '#0f172a', lineHeight: 1.25, margin: 0 }}>
                    Executive speed without the networking complexity
                  </h2>
                </div>

                {/* Progress indicator: 01 02 03 04 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                  {FEATURES.map((f, i) => (
                    <div key={f.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, opacity: i === activeStep ? 1 : 0.25, transition: 'opacity 0.3s' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        fontWeight: 700,
                        color: i === activeStep ? '#d97706' : '#94a3b8',
                        transition: 'color 0.3s',
                      }}>
                        {f.num}
                      </span>
                      <span style={{
                        height: 2,
                        width: i === activeStep ? 24 : 8,
                        borderRadius: 99,
                        background: i === activeStep ? '#f59e0b' : i < activeStep ? '#fcd34d' : '#cbd5e1',
                        transition: 'all 0.5s',
                        display: 'block',
                      }} />
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 8,
                        letterSpacing: '0.08em',
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        display: i === activeStep ? 'block' : 'none',
                      }}>
                        {f.subtitle}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Two-column body ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '2.5rem', alignItems: 'center' }}>

                {/* LEFT COLUMN — text changes via AnimatePresence */}
                <div style={{ minHeight: 280 }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`text-${activeStep}`}
                      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -16 }}
                      transition={TEXT_TRANSITION}
                      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                    >
                      {/* Step tag */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: '#f59e0b',
                          color: '#000',
                        }}>
                          {feat.num} / 03
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#b45309',
                          fontWeight: 600,
                        }}>
                          {feat.tag}
                        </span>
                      </div>

                      {/* Title */}
                      <div>
                        <h3 style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 600,
                          fontSize: 'clamp(1.35rem, 2vw, 1.75rem)',
                          color: '#0f172a',
                          lineHeight: 1.2,
                          margin: 0,
                        }}>
                          {feat.title}
                        </h3>
                        <p style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 13,
                          color: '#b45309',
                          fontWeight: 500,
                          margin: '4px 0 0',
                        }}>
                          {feat.subtitle}
                        </p>
                      </div>

                      {/* Description */}
                      <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                        {feat.desc}
                      </p>

                      {/* Metrics */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 8,
                        paddingTop: 12,
                        borderTop: '1px solid #e2e8f0',
                      }}>
                        {feat.metrics.map(m => (
                          <div key={m.label}>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.05rem, 1.5vw, 1.35rem)', color: '#0f172a' }}>
                              {m.value}
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>
                              {m.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footnote */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 11.5, color: '#64748b' }}>
                        <span style={{ height: 7, width: 7, marginTop: 3, borderRadius: '50%', background: '#22c55e', flexShrink: 0, animation: 'pulse 2s infinite' }} />
                        <span>{feat.footnote}</span>
                      </div>

                      {/* Scroll hint */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 2 }}>
                        {FEATURES.map((_, i) => (
                          <span key={i} style={{
                            height: 2.5,
                            width: i === activeStep ? 22 : i < activeStep ? 12 : 5,
                            borderRadius: 99,
                            background: i === activeStep ? '#f59e0b' : i < activeStep ? '#fcd34d' : '#cbd5e1',
                            transition: 'all 0.5s',
                            display: 'inline-block',
                          }} />
                        ))}
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: '#94a3b8', marginLeft: 4 }}>
                          {activeStep + 1} / 3 — scroll ↓
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* RIGHT COLUMN — visual panel changes via AnimatePresence */}
                <div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`panel-${activeStep}`}
                      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.97, y: shouldReduceMotion ? 0 : 16 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.97, y: shouldReduceMotion ? 0 : -16 }}
                      transition={PANEL_TRANSITION}
                    >
                      <Panel />
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}
