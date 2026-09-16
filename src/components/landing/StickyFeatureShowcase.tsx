import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlobalMeshCanvas3D } from './GlobalMeshCanvas3D'
import { InteractiveDotGrid } from './InteractiveDotGrid'

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
  return (
    <div className="relative w-full h-[520px] sm:h-[540px] rounded-2xl bg-[#080D18] border border-slate-800 shadow-2xl p-4 sm:p-5 text-white select-none overflow-hidden flex flex-col justify-between">
      {/* Top Status Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80 text-xs font-sans shrink-0">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          Sub-Second Match Engine
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span>Benchmark: 1,420 Execs Tested</span>
          <span className="hidden sm:inline text-emerald-400 font-medium">• Latency: 18.4s</span>
        </div>
      </div>

      {/* Main Center Display Stage */}
      <div className="relative w-full flex-1 my-2.5 rounded-xl overflow-hidden bg-[#060913] border border-slate-800/60 p-3 sm:p-3.5 flex flex-col justify-between min-h-0">
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
        <div className="relative z-10 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 p-2.5 sm:p-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-amber-300 font-display font-medium text-xs sm:text-sm tracking-tight">
                RandomCoffee Deterministic Engine
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-sans font-semibold tracking-wide">
                99.8% Faster
              </span>
            </div>
            <div className="text-right">
              <span className="text-amber-400 font-display font-semibold text-lg sm:text-xl tracking-tight">
                18.4s
              </span>
              <span className="text-slate-400 text-[9.5px] font-sans block">Median time to partner</span>
            </div>
          </div>

          {/* Animated Glowing Progress Bar */}
          <div className="relative h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-amber-500/40 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-200 rounded-full transition-all duration-700 relative shadow-[0_0_16px_rgba(245,158,11,0.8)]"
              style={{ width: '16%' }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_#ffffff]" />
            </div>
          </div>
        </div>

        {/* Comparison Channel Rows */}
        <div className="relative z-10 space-y-1.5 my-auto">
          {[
            {
              channel: 'LinkedIn Cold InMail',
              stat: '14 Days (1.2M sec)',
              note: '4.8% response rate · $99/mo subscription',
              width: '52%',
            },
            {
              channel: 'Industry Summits & Conferences',
              stat: '21 Days + $4,200',
              note: 'Ticket, flight & hotel · High friction',
              width: '74%',
            },
            {
              channel: 'Retained Executive Headhunter',
              stat: '60 Days avg cycle',
              note: '30% first-year placement compensation',
              width: '98%',
            },
          ].map((row) => (
            <div
              key={row.channel}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between text-xs font-sans mb-1 gap-1">
                <span className="text-slate-200 font-medium text-[11px] sm:text-xs">{row.channel}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[10px] sm:text-[11px]">{row.note}</span>
                  <span className="text-slate-200 font-semibold text-[11px] sm:text-xs">{row.stat}</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
                <div
                  className="h-full bg-slate-600/70 rounded-full transition-all duration-500"
                  style={{ width: row.width }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Metrics HUD Strip inside center stage */}
        <div className="relative z-10 grid grid-cols-3 gap-2 pt-1.5 border-t border-slate-800/70 text-center">
          <div className="bg-slate-950/70 rounded-lg py-1 border border-slate-800/60">
            <div className="text-amber-400 font-display font-semibold text-xs sm:text-sm">184 Hrs</div>
            <div className="text-[9px] text-slate-400 font-sans tracking-normal">Saved / Exec / Yr</div>
          </div>
          <div className="bg-slate-950/70 rounded-lg py-1 border border-slate-800/60">
            <div className="text-amber-400 font-display font-semibold text-xs sm:text-sm">0%</div>
            <div className="text-[9px] text-slate-400 font-sans tracking-normal">Cold Outreach Waste</div>
          </div>
          <div className="bg-slate-950/70 rounded-lg py-1 border border-slate-800/60">
            <div className="text-amber-400 font-display font-semibold text-xs sm:text-sm">94.2%</div>
            <div className="text-[9px] text-slate-400 font-sans tracking-normal">Pipeline Conversion</div>
          </div>
        </div>
      </div>

      {/* Bottom Details Drawer */}
      <div className="pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-xs font-sans shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-amber-400 font-semibold">Audited ROI</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-300 text-[11.5px]">
            94.2% of matched executive calls convert to active deal pipeline in 48 hours.
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium shrink-0">
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
  const [isPaused, setIsPaused] = useState(false)

  // Subtle auto-advance every 7 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % FEATURES.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [isPaused])

  const activeFeature = FEATURES[activeStep]

  return (
    <>
      {/* ── Mobile layout ── */}
      <MobileLayout />

      {/* ── Desktop layout (Natural scroll flow, no scroll hijacking) ── */}
      <section
        id="capabilities-section"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="hidden md:block relative bg-white text-slate-900 rounded-t-[3.5rem] shadow-[0_-25px_50px_-25px_rgba(0,0,0,0.06)] border-t border-slate-200 py-16 lg:py-20 px-6 sm:px-10 lg:px-14 overflow-hidden"
      >
        {/* Subtle Warm Ambient Glow */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-100/35 rounded-full blur-3xl pointer-events-none" />

        {/* Interactive Separating Dot Grid Canvas on White */}
        <InteractiveDotGrid
          dotColor="rgba(30, 41, 59, 0.16)"
          glowColor="rgba(217, 119, 6, 0.95)"
        />

        <div className="relative z-10 max-w-7xl mx-auto space-y-8">
          {/* ── Top Header Bar ── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-slate-200/80 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                <span className="font-sans text-xs font-semibold tracking-wider text-amber-700 uppercase">
                  WHY RANDOMCOFFEE
                </span>
              </div>
              <h2 className="font-display font-medium text-2xl lg:text-3xl text-slate-900 leading-tight">
                Executive speed without the networking complexity
              </h2>
            </div>

            {/* Step Counter Pills */}
            <div className="flex items-center gap-2 text-xs font-sans text-slate-500 shrink-0">
              <span>Feature</span>
              <span className="font-bold text-slate-900">{activeStep + 1}</span>
              <span>of</span>
              <span className="font-bold text-slate-900">{FEATURES.length}</span>
            </div>
          </div>

          {/* ── 3-Tab Segmented Selector ── */}
          <div className="grid grid-cols-3 gap-3 p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/90 shadow-inner">
            {FEATURES.map((f, i) => {
              const isCurrent = activeStep === i
              return (
                <button
                  key={f.num}
                  type="button"
                  onClick={() => setActiveStep(i)}
                  className={`relative flex items-center justify-between p-3.5 rounded-xl text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                    isCurrent
                      ? 'bg-white text-slate-950 font-semibold shadow-md border border-amber-500/40 ring-1 ring-amber-500/20'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`font-sans text-[11px] font-bold px-2 py-0.5 rounded transition-colors shrink-0 ${
                        isCurrent ? 'bg-amber-500 text-black shadow-sm' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {f.num}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-display font-semibold truncate">
                        {f.title}
                      </div>
                      <div className="text-[10.5px] font-sans text-slate-400 truncate">
                        {f.tag}
                      </div>
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 ml-2 animate-pulse" />
                  )}

                  {/* Subtle auto-advance progress timer line on active tab */}
                  {isCurrent && !isPaused && (
                    <motion.div
                      key={`timer-${activeStep}`}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 7, ease: 'linear' }}
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-500"
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* ── Two-Column Command Showcase ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            {/* LEFT COLUMN: Feature Information */}
            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${activeStep}`}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 14 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="rounded-3xl bg-slate-50/60 border border-slate-200/80 p-6 sm:p-7 shadow-sm space-y-5"
                >
                  {/* Step Tag */}
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-[11px] font-bold px-2.5 py-0.5 rounded bg-amber-500 text-black">
                      {activeFeature.num} / 03
                    </span>
                    <span className="font-sans text-[11px] tracking-wider uppercase font-semibold text-amber-700">
                      {activeFeature.tag}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-display font-semibold text-2xl sm:text-3xl text-slate-900 leading-tight">
                      {activeFeature.title}
                    </h3>
                    <p className="font-display font-medium text-sm text-amber-700 mt-1">
                      {activeFeature.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed font-sans">
                    {activeFeature.desc}
                  </p>

                  {/* 3 Metrics */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
                    {activeFeature.metrics.map((m) => (
                      <div key={m.label}>
                        <div className="font-display font-bold text-slate-900 text-lg sm:text-xl">
                          {m.value}
                        </div>
                        <div className="font-sans text-[10px] text-slate-500 tracking-wider uppercase mt-0.5 font-medium">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footnote */}
                  <div className="flex items-start gap-2 text-xs text-slate-500 font-sans pt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5 animate-pulse" />
                    <span>{activeFeature.footnote}</span>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                    <div className="flex items-center gap-1.5">
                      {FEATURES.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveStep(i)}
                          className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            activeStep === i ? 'w-6 bg-amber-500' : 'w-2 bg-slate-300 hover:bg-slate-400'
                          }`}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveStep((prev) => (prev > 0 ? prev - 1 : FEATURES.length - 1))
                        }
                        className="px-3 py-1 rounded-lg text-xs font-medium font-sans bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition cursor-pointer shadow-sm"
                      >
                        ← Prev
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveStep((prev) => (prev + 1) % FEATURES.length)}
                        className="px-3 py-1 rounded-lg text-xs font-medium font-sans bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer shadow-sm"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT COLUMN: Interactive Visual Stage */}
            <div className="lg:col-span-7">
              <div className="w-full h-[520px] sm:h-[540px] relative rounded-2xl overflow-hidden shadow-2xl bg-[#080D18] border border-slate-800">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`panel-${activeStep}`}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full"
                  >
                    {activeStep === 0 && <BenchmarkPanel />}
                    {activeStep === 1 && <GlobePanel />}
                    {activeStep === 2 && <VideoPanel />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
