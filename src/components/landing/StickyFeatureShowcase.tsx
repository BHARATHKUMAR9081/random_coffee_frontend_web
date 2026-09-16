import { useState, useRef, useEffect } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion'
import { GlobalMeshCanvas3D } from './GlobalMeshCanvas3D'
import { InteractiveDotGrid } from './InteractiveDotGrid'
import { OrbitalCoffeeMatch3D } from './OrbitalCoffeeMatch3D'

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
    footnote: 'Ultra-low latency mesh routing connects global founders with tier-1 strategic partners.',
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
  return <OrbitalCoffeeMatch3D />
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
    <div className="relative w-full h-[520px] sm:h-[540px] rounded-2xl bg-[#080D18] border border-slate-800 shadow-2xl p-4 sm:p-5 text-white select-none overflow-hidden flex flex-col justify-between">
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 text-xs font-sans shrink-0">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          Encrypted 1:1 Executive Room
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-medium text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
            {formatTimer(seconds)} Remaining
          </div>
          <span className="hidden sm:inline text-slate-400 text-[11px]">Direct E2EE P2P</span>
        </div>
      </div>

      {/* Main Center Display Stage */}
      <div className="relative w-full flex-1 my-2.5 rounded-xl overflow-hidden bg-[#060913] border border-slate-800/60 p-3 sm:p-4 flex flex-col justify-between min-h-0">
        {/* Center HUD Latency Watermark */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 px-2.5 py-0.5 rounded-full bg-slate-950/85 border border-slate-800 font-sans text-[10px] text-slate-400 flex items-center gap-1.5 shadow-md">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Direct P2P · 14ms Latency · Zero-Cloud Proxy</span>
        </div>

        {/* Video Feeds Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 pt-6 pb-2 min-h-0">
          {/* Stream 1: Founder (You) */}
          <div className="relative rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-amber-500/30 p-3.5 sm:p-4 flex flex-col justify-between shadow-lg overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Stream Top Header */}
            <div className="flex items-center justify-between text-xs font-sans z-10">
              <span className="text-amber-400 font-medium flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Founder (You)
              </span>
              <span className="text-amber-300 text-[10px] px-2 py-0.5 rounded-full bg-amber-950/40 border border-amber-500/30 font-medium">
                Verified Profile
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
              <h5 className="mt-2 text-sm sm:text-base font-display font-medium text-white">Subash S.</h5>
              <p className="text-xs text-amber-200/80 font-sans">Founder & CEO · Seed AI</p>
            </div>

            {/* Stream Bottom Controls & Waveform */}
            <div className="flex items-center justify-between z-10 pt-2 border-t border-slate-800/70">
              {/* Mic & Cam toggleable pills */}
              <div className="flex items-center gap-1.5 font-sans text-[10px]">
                <button
                  type="button"
                  onClick={() => setMicMuted(!micMuted)}
                  className={`px-2.5 py-0.5 rounded-md cursor-pointer font-medium transition ${
                    micMuted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {micMuted ? 'Mic Off' : 'Mic On'}
                </button>
                <button
                  type="button"
                  onClick={() => setCamMuted(!camMuted)}
                  className={`px-2.5 py-0.5 rounded-md cursor-pointer font-medium transition ${
                    camMuted ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {camMuted ? 'Cam Off' : '1080p HD'}
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
            <div className="flex items-center justify-between text-xs font-sans z-10">
              <span className="text-cyan-400 font-medium flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Matched Executive
              </span>
              <span className="text-emerald-300 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 font-medium">
                Executive Member
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
              <h5 className="mt-2 text-sm sm:text-base font-display font-medium text-white">Michael R.</h5>
              <p className="text-xs text-cyan-200/80 font-sans">Managing Partner · Tier-1 Venture</p>
            </div>

            {/* Stream Bottom Controls & Waveform */}
            <div className="flex items-center justify-between z-10 pt-2 border-t border-slate-800/70">
              <span className="text-[10px] font-sans text-slate-400 uppercase tracking-wider font-medium">Speaker Active</span>

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
        <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between font-sans shrink-0">
          <div className="text-xs text-slate-300">
            {exchanged
              ? '✓ Cards exchanged! Direct LinkedIn, email & WhatsApp unlocked.'
              : 'Auto-destruct timer active. Swap cards before room expires.'}
          </div>
          <button
            type="button"
            onClick={() => setExchanged(!exchanged)}
            className={`px-4 py-1.5 text-xs font-semibold tracking-wider uppercase rounded-lg transition-all duration-300 cursor-pointer ${
              exchanged
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
            }`}
          >
            {exchanged ? 'Cards Exchanged ✓' : 'Exchange Cards ⚡'}
          </button>
        </div>
      </div>

      {/* Bottom Details Drawer */}
      <div className="pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-xs font-sans shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-amber-400 font-semibold">Double-Blind Exchange</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-300 text-[11.5px]">
            Zero spam or unconsented data sales. Contact details unlock only if both parties agree.
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          Encrypted P2P · Guard Active
        </div>
      </div>
    </div>
  )
}

const PANELS = [BenchmarkPanel, GlobePanel, VideoPanel]

// ─── Mobile stacked fallback ───────────────────────────────────────────────────

function MobileLayout() {
  return (
    <section className="md:hidden relative bg-white text-slate-900 shadow-[0_-25px_50px_-25px_rgba(0,0,0,0.06)] border-t border-slate-200 rounded-t-[3.5rem] px-6 sm:px-10 pt-12 pb-20 overflow-hidden">
      {/* Interactive Separating Dot Grid Canvas on White */}
      <InteractiveDotGrid
        dotColor="rgba(30, 41, 59, 0.16)"
        glowColor="rgba(217, 119, 6, 0.95)"
      />

      {/* Subtle Warm Amber Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mb-8 pb-6 border-b border-slate-200">
        <span className="font-sans text-[11px] font-semibold tracking-wider text-amber-700 uppercase">WHY RANDOMCOFFEE</span>
        <h2 className="font-display font-medium text-2xl text-slate-900 mt-2 leading-tight">
          Executive speed without the networking complexity
        </h2>
      </div>
      <div className="relative z-10 space-y-14">
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
                <span className="font-sans text-xs font-semibold px-2.5 py-1 rounded bg-amber-500 text-black">{f.num} / 03</span>
                <span className="font-sans text-xs tracking-wider uppercase text-amber-700 font-semibold">{f.tag}</span>
              </div>
              <h3 className="font-display font-semibold text-2xl text-slate-900 leading-tight">{f.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans">{f.desc}</p>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200">
                {f.metrics.map(m => (
                  <div key={m.label}>
                    <div className="font-display font-semibold text-slate-900 text-xl">{m.value}</div>
                    <div className="font-sans text-[10px] text-slate-500 tracking-wider uppercase mt-0.5 font-medium">{m.label}</div>
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

  // sectionRef on the outer runway
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // ── 1. Idea 1: Apple-Style Opaque Stacking Deck (Right Column) ─────────────
  // Card 0: Base card. Scales down slightly & dims as Card 1 slides over it.
  const cardScale0 = useTransform(scrollYProgress, [0.18, 0.44], [1, shouldReduceMotion ? 1 : 0.95])
  const cardY0 = useTransform(scrollYProgress, [0.18, 0.44], [0, shouldReduceMotion ? 0 : -18])
  const cardDim0 = useTransform(scrollYProgress, [0.18, 0.44], [0, 0.45])

  // Card 1: Slides UP from y: 540px to 0px, solid opaque, covering Card 0.
  const cardY1 = useTransform(
    scrollYProgress,
    [0, 0.18, 0.44, 0.58, 0.84],
    [540, 540, 0, 0, shouldReduceMotion ? 0 : -18]
  )
  const cardScale1 = useTransform(scrollYProgress, [0.58, 0.84], [1, shouldReduceMotion ? 1 : 0.95])
  const cardDim1 = useTransform(scrollYProgress, [0.58, 0.84], [0, 0.45])

  // Card 2: Slides UP from y: 540px to 0px, solid opaque, covering Card 1.
  const cardY2 = useTransform(
    scrollYProgress,
    [0, 0.58, 0.84, 1],
    [540, 540, 0, 0]
  )

  // ── 2. Non-Overlapping Vertical Reel Track (Left Column) ───────────────────
  // Translates each slide cleanly out of view so text NEVER overlaps in place
  const reelY = useTransform(
    scrollYProgress,
    [0, 0.18, 0.44, 0.58, 0.84, 1],
    [0, 0, -360, -360, -720, -720]
  )

  const slideOpacity0 = useTransform(scrollYProgress, [0, 0.18, 0.42], [1, 1, 0.05])
  const slideOpacity1 = useTransform(scrollYProgress, [0.20, 0.44, 0.58, 0.82], [0.05, 1, 1, 0.05])
  const slideOpacity2 = useTransform(scrollYProgress, [0.60, 0.84, 1], [0.05, 1, 1])

  const slideOpacities = [slideOpacity0, slideOpacity1, slideOpacity2]

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    let next = 0
    if (v >= 0.58) {
      next = 2
    } else if (v >= 0.22) {
      next = 1
    } else {
      next = 0
    }
    setActiveStep(prev => (prev !== next ? next : prev))
  })

  function scrollToStep(i: number) {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const scrollTop = window.scrollY + rect.top
    const scrollableHeight = sectionRef.current.offsetHeight - window.innerHeight
    const targetPercent = i === 0 ? 0.06 : i === 1 ? 0.51 : 0.94
    window.scrollTo({
      top: scrollTop + targetPercent * scrollableHeight,
      behavior: 'smooth',
    })
  }

  return (
    <>
      {/* ── Mobile layout ── */}
      <MobileLayout />

      {/* ── Desktop layout ── */}
      <section
        ref={sectionRef}
        id="capabilities-section"
        className="scroll-story-section hidden md:block"
        style={{
          position: 'relative',
          height: '380vh',
          width: '100%',
          backgroundColor: 'transparent',
        }}
      >
        <div
          className="scroll-story-screen text-slate-900 rounded-t-[3.5rem] shadow-[0_-25px_50px_-25px_rgba(0,0,0,0.06)] border-t border-slate-200"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            overflow: 'hidden',
            backgroundColor: '#FFFFFF',
            zIndex: 30,
          }}
        >
          {/* Subtle Warm Ambient Glow behind the dots */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-100/35 rounded-full blur-3xl pointer-events-none" />

          {/* Interactive Separating Dot Grid Canvas on White */}
          <InteractiveDotGrid
            dotColor="rgba(30, 41, 59, 0.16)"
            glowColor="rgba(217, 119, 6, 0.95)"
          />

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
                borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                    <span style={{ height: 7, width: 7, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: '#b45309', textTransform: 'uppercase' }}>
                      WHY RANDOMCOFFEE
                    </span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(1.15rem, 1.6vw, 1.45rem)', color: '#0f172a', lineHeight: 1.25, margin: 0 }}>
                    Executive speed without the networking complexity
                  </h2>
                </div>

                {/* Progress indicator: 01 02 03 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                  {FEATURES.map((f, i) => (
                    <button
                      key={f.num}
                      type="button"
                      onClick={() => scrollToStep(i)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3,
                        opacity: i === activeStep ? 1 : 0.4,
                        transition: 'opacity 0.3s, transform 0.2s',
                        background: 'none',
                        border: 'none',
                        padding: '4px 6px',
                        cursor: 'pointer',
                      }}
                      className="hover:scale-105"
                      aria-label={`Jump to step ${f.num}: ${f.subtitle}`}
                    >
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 13,
                        fontWeight: 700,
                        color: i === activeStep ? '#d97706' : '#94a3b8',
                        transition: 'color 0.3s',
                      }}>
                        {f.num}
                      </span>
                      <span style={{
                        height: 2.5,
                        width: i === activeStep ? 24 : 8,
                        borderRadius: 99,
                        background: i === activeStep ? '#f59e0b' : i < activeStep ? '#fcd34d' : '#e2e8f0',
                        transition: 'all 0.4s',
                        display: 'block',
                      }} />
                      <span style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 9,
                        fontWeight: 500,
                        letterSpacing: '0.06em',
                        color: '#64748b',
                        textTransform: 'uppercase',
                        display: i === activeStep ? 'block' : 'none',
                      }}>
                        {f.subtitle}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Two-column body ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '2.5rem', alignItems: 'center' }}>

                {/* LEFT COLUMN — vertical reel track (never overlaps in place) */}
                <div style={{ position: 'relative', width: '100%', height: 360, overflow: 'hidden' }}>
                  <motion.div
                    style={{
                      y: reelY,
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      willChange: 'transform',
                    }}
                  >
                    {FEATURES.map((f, idx) => (
                      <motion.div
                        key={f.num}
                        style={{
                          height: 360,
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          padding: '6px 0',
                          boxSizing: 'border-box',
                          opacity: slideOpacities[idx],
                        }}
                      >
                        {/* Step tag */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: 11,
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: '#f59e0b',
                            color: '#000',
                          }}>
                            {f.num} / 03
                          </span>
                          <span style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: 11,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: '#b45309',
                            fontWeight: 600,
                          }}>
                            {f.tag}
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
                            {f.title}
                          </h3>
                          <p style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 13,
                            color: '#b45309',
                            fontWeight: 500,
                            margin: '4px 0 0',
                          }}>
                            {f.subtitle}
                          </p>
                        </div>

                        {/* Description */}
                        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0, fontFamily: 'var(--font-sans)' }}>
                          {f.desc}
                        </p>

                        {/* Metrics */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: 8,
                          paddingTop: 12,
                          borderTop: '1px solid #e2e8f0',
                        }}>
                          {f.metrics.map(m => (
                            <div key={m.label}>
                              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.05rem, 1.5vw, 1.35rem)', color: '#0f172a' }}>
                                {m.value}
                              </div>
                              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 9.5, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 2, fontWeight: 500 }}>
                                {m.label}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Footnote */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 11.5, color: '#64748b', fontFamily: 'var(--font-sans)' }}>
                          <span style={{ height: 7, width: 7, marginTop: 3, borderRadius: '50%', background: '#22c55e', flexShrink: 0, animation: 'pulse 2s infinite' }} />
                          <span>{f.footnote}</span>
                        </div>

                        {/* Scroll hint */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 2 }}>
                          {FEATURES.map((_, i) => (
                            <span key={i} style={{
                              height: 2.5,
                              width: i === idx ? 22 : i < idx ? 12 : 5,
                              borderRadius: 99,
                              background: i === idx ? '#f59e0b' : i < idx ? '#fcd34d' : '#e2e8f0',
                              transition: 'all 0.5s',
                              display: 'inline-block',
                            }} />
                          ))}
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, color: '#94a3b8', marginLeft: 4 }}>
                            {idx === 2 ? '3 / 3 — explore room' : `${idx + 1} / 3 — scroll ↓`}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* RIGHT COLUMN — Apple-Style Opaque Stacking Deck */}
                <div className="w-full h-[520px] sm:h-[540px] relative rounded-2xl overflow-hidden shadow-2xl bg-[#080D18]">
                  {/* Card 0: Benchmark (Base layer) */}
                  <motion.div
                    style={{
                      y: cardY0,
                      scale: cardScale0,
                      position: 'absolute',
                      inset: 0,
                      zIndex: 10,
                      pointerEvents: activeStep === 0 ? 'auto' : 'none',
                      willChange: 'transform',
                    }}
                    className="w-full h-full"
                  >
                    <BenchmarkPanel />
                    {/* Ambient depth dimming when Card 1 covers it */}
                    <motion.div
                      style={{ opacity: cardDim0 }}
                      className="absolute inset-0 bg-black/60 pointer-events-none rounded-2xl z-20"
                    />
                  </motion.div>

                  {/* Card 1: Globe / Mesh (Slides up over Card 0) */}
                  <motion.div
                    style={{
                      y: cardY1,
                      scale: cardScale1,
                      position: 'absolute',
                      inset: 0,
                      zIndex: 20,
                      boxShadow: '0 -25px 50px -12px rgba(0,0,0,0.85)',
                      pointerEvents: activeStep === 1 ? 'auto' : 'none',
                      willChange: 'transform',
                    }}
                    className="w-full h-full rounded-2xl overflow-hidden"
                  >
                    <GlobePanel />
                    {/* Ambient depth dimming when Card 2 covers it */}
                    <motion.div
                      style={{ opacity: cardDim1 }}
                      className="absolute inset-0 bg-black/60 pointer-events-none rounded-2xl z-20"
                    />
                  </motion.div>

                  {/* Card 2: Video Room (Slides up over Card 1) */}
                  <motion.div
                    style={{
                      y: cardY2,
                      position: 'absolute',
                      inset: 0,
                      zIndex: 30,
                      boxShadow: '0 -25px 50px -12px rgba(0,0,0,0.85)',
                      pointerEvents: activeStep === 2 ? 'auto' : 'none',
                      willChange: 'transform',
                    }}
                    className="w-full h-full rounded-2xl overflow-hidden"
                  >
                    <VideoPanel />
                  </motion.div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  )
}
