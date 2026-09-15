import { Link } from 'react-router-dom'
import { SweepingRibbons3D } from './SweepingRibbons3D'
import { ScrollReveal } from './ScrollReveal'

interface BottomCtaSectionProps {
  onDemoClick: () => void
}

export function BottomCtaSection({ onDemoClick }: BottomCtaSectionProps) {
  return (
    <section className="relative z-20 bg-[#06080F] text-white pt-36 sm:pt-48 lg:pt-52 pb-12 sm:pb-16 px-6 sm:px-12 lg:px-16 overflow-hidden">
      {/* Ambient Deep Glow in Top-Right Background */}
      <div className="absolute top-24 right-10 w-[550px] h-[550px] bg-gradient-to-br from-amber-500/10 via-gold-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-48 left-10 w-[450px] h-[450px] bg-gradient-to-tr from-amber-600/8 via-amber-400/4 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* ============================================================ */}
        {/* 1. EXECUTIVE CALL TO ACTION (2-COLUMN GRID)                  */}
        {/* ============================================================ */}
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-center pb-20 sm:pb-28">
            {/* Left Column (Cols 1-7): Monumental Headline, Copy & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono tracking-widest text-gold-400 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                DETERMINISTIC DEAL FLOW
              </div>

              <h2 className="font-display font-light text-3xl sm:text-5xl lg:text-6xl text-white tracking-[-0.025em] leading-[1.08]">
                Start verified 1:1 coffee chats today or talk to our enterprise team.
              </h2>

              <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-xl leading-relaxed">
                Connect with verified founders, tier-1 angel investors, and enterprise decision-makers for focused 2-minute video chats — zero cold emails, zero spam, pure serendipity.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/register"
                  className="px-7 py-3.5 text-xs font-mono font-bold tracking-wider uppercase text-black bg-gradient-to-r from-amber-200 via-gold-400 to-amber-500 rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(212,175,55,0.65)] hover:brightness-110 transition-all transform hover:-translate-y-0.5"
                >
                  GET STARTED
                </Link>
                <button
                  type="button"
                  onClick={onDemoClick}
                  className="px-7 py-3.5 text-xs font-mono font-semibold tracking-wider uppercase text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 rounded-sm backdrop-blur-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  BOOK A DEMO
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs text-zinc-500 pt-2 font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> No credit card required
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> Profile-based access
                </span>
              </div>
            </div>

            {/* Right Column (Cols 8-12): Dedicated 3D Interactive Gyro Match Engine */}
            <div className="lg:col-span-5 h-[340px] sm:h-[420px] w-full relative rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-4 flex items-center justify-center overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              {/* Subtle inner radial backlight */}
              <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />

              {/* Top badge inside 3D card */}
              <div className="absolute top-4 left-5 flex items-center gap-2 font-mono text-[10px] text-zinc-400 tracking-wider uppercase z-10 pointer-events-none">
                <span className="h-2 w-2 rounded-full bg-gold-400 shadow-[0_0_8px_#d4af37]" />
                ORBITAL MATCH PROTOCOL
              </div>

              {/* 3D Gyro Engine Canvas */}
              <SweepingRibbons3D />

              {/* Bottom stats inside 3D card */}
              <div className="absolute bottom-4 inset-x-5 flex items-center justify-between font-mono text-[10px] text-zinc-500 border-t border-white/[0.06] pt-2 z-10 pointer-events-none">
                <span>Latency: 18ms</span>
                <span className="text-gold-400">Deterministic Pair</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ============================================================ */}
        {/* 2. FOOTER: NAVIGATION LINKS, BRAND & COPYRIGHT               */}
        {/* ============================================================ */}
        <footer className="pt-16 sm:pt-20 border-t border-white/[0.08]">
          <ScrollReveal delay={0.1}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 sm:pb-16">
              {/* Left Column: Brand & Description */}
              <div className="flex flex-col items-start gap-3 text-left max-w-md">
                <div className="flex items-center gap-3">
                  <img
                    src="/brand-logo.jpg"
                    alt="RandomCoffee"
                    className="h-8 w-8 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.4)] object-cover"
                  />
                  <span className="font-display font-medium text-lg tracking-tight text-white">
                    Random<span className="text-gold-400">Coffee</span>
                  </span>
                </div>

                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  The deterministic matchmaking infrastructure for verified founders, enterprise buyers, and angel investors.
                </p>
              </div>

              {/* Right Column: Legal & Policies */}
              <div className="flex flex-col items-start md:items-end gap-3 text-left md:text-right">
                <span className="text-xs font-mono font-semibold tracking-wider text-white uppercase">
                  Legal & Policies
                </span>
                <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-400">
                  <Link to="/community-guidelines" className="hover:text-gold-400 transition">
                    Community Guidelines
                  </Link>
                  <span className="text-zinc-700 hidden sm:inline">·</span>
                  <Link to="/privacy-policy" className="hover:text-gold-400 transition">
                    Privacy Policy
                  </Link>
                  <span className="text-zinc-700 hidden sm:inline">·</span>
                  <Link to="/terms" className="hover:text-gold-400 transition">
                    Terms of Service
                  </Link>
                  <span className="text-zinc-700 hidden sm:inline">·</span>
                  <Link to="/refund-policy" className="hover:text-gold-400 transition">
                    Refund & Cancellation Policy
                  </Link>
                </nav>
              </div>
            </div>

            {/* Bottom Small Copyright Line */}
            <div className="pt-6 pb-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-xs font-sans">
              <span>© {new Date().getFullYear()} RandomCoffee Inc. All rights reserved.</span>
              <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                <span>Global Matchmaking Engine Active</span>
              </div>
            </div>
          </ScrollReveal>
        </footer>
      </div>
    </section>
  )
}
