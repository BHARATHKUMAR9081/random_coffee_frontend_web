import { Link } from 'react-router-dom'
import { SweepingRibbons3D } from './SweepingRibbons3D'
import { ScrollReveal } from './ScrollReveal'

interface BottomCtaSectionProps {}

export function BottomCtaSection({}: BottomCtaSectionProps = {}) {
  return (
    <section className="relative z-20 bg-[#06080F] text-white pt-10 sm:pt-14 lg:pt-16 pb-6 sm:pb-8 px-6 sm:px-12 lg:px-16 overflow-hidden">
      {/* Ambient Deep Glow in Top-Right Background */}
      <div className="absolute top-10 right-10 w-[450px] h-[450px] bg-gradient-to-br from-amber-500/10 via-gold-500/5 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-20 left-10 w-[380px] h-[380px] bg-gradient-to-tr from-amber-600/8 via-amber-400/4 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* ============================================================ */}
        {/* 1. EXECUTIVE CALL TO ACTION (2-COLUMN GRID)                  */}
        {/* ============================================================ */}
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center pb-8 sm:pb-10">
            {/* Left Column (Cols 1-7): Headline, Copy & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[10.5px] font-sans font-medium tracking-wider text-gold-400 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                Deterministic Deal Flow
              </div>

              <h2 className="font-display font-light text-2xl sm:text-4xl lg:text-[2.65rem] text-white tracking-[-0.025em] leading-[1.12]">
                Start verified 1:1 coffee chats today.
              </h2>

              <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-xl leading-relaxed">
                Connect with verified founders, angel investors, and business leaders for focused 2-minute video chats — zero cold emails, zero spam, pure serendipity.
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/register"
                  className="px-6 py-3 text-xs font-mono font-bold tracking-wider uppercase text-black bg-gradient-to-r from-amber-200 via-gold-400 to-amber-500 rounded-sm shadow-[0_0_24px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.65)] hover:brightness-110 transition-all transform hover:-translate-y-0.5"
                >
                  GET STARTED
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 text-xs font-mono font-semibold tracking-wider uppercase text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 rounded-sm backdrop-blur-md transition-all transform hover:-translate-y-0.5"
                >
                  SIGN IN
                </Link>
              </div>

              <div className="flex items-center gap-4 text-[11.5px] text-zinc-400 pt-1 font-sans">
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
            <div className="lg:col-span-5 h-[270px] sm:h-[310px] lg:h-[330px] w-full relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-4 flex items-center justify-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {/* Subtle inner radial backlight */}
              <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />

              {/* Top badge inside 3D card */}
              <div className="absolute top-3.5 left-4 flex items-center gap-2 font-sans text-[10.5px] font-medium text-zinc-400 tracking-wider uppercase z-10 pointer-events-none">
                <span className="h-2 w-2 rounded-full bg-gold-400 shadow-[0_0_8px_#d4af37] animate-pulse" />
                Live 1:1 Audio Steam
              </div>

              {/* 3D Audio Steam Canvas */}
              <SweepingRibbons3D />

              {/* Bottom stats inside 3D card */}
              <div className="absolute bottom-3.5 inset-x-4 flex items-center justify-between font-sans text-[11px] text-zinc-400 border-t border-white/[0.06] pt-1.5 z-10 pointer-events-none">
                <span>Audio: 48kHz HD Lossless</span>
                <span className="text-gold-400 font-medium">Dual-Channel Telemetry</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ============================================================ */}
        {/* 2. FOOTER: NAVIGATION LINKS, BRAND & COPYRIGHT               */}
        {/* ============================================================ */}
        <footer className="pt-8 sm:pt-10 border-t border-white/[0.08]">
          <ScrollReveal delay={0.1}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 sm:pb-8">
              {/* Left Column: Brand & Description */}
              <div className="flex flex-col items-start gap-2.5 text-left max-w-md">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/brand-logo.jpg"
                    alt="RandomCoffee"
                    className="h-7 w-7 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.4)] object-cover"
                  />
                  <span className="font-display font-medium text-base tracking-tight text-white">
                    Random<span className="text-gold-400">Coffee</span>
                  </span>
                </div>

                <p className="text-[11.5px] text-zinc-400 font-sans leading-relaxed">
                  The deterministic matchmaking infrastructure for verified founders, angel investors, and business leaders.
                </p>
              </div>

              {/* Right Column: Legal & Policies */}
              <div className="flex flex-col items-start md:items-end gap-2.5 text-left md:text-right">
                <span className="text-[11px] font-mono font-semibold tracking-wider text-white uppercase">
                  Legal & Policies
                </span>
                <nav className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] text-zinc-400">
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
            <div className="pt-4 pb-4 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3 text-zinc-500 text-[11px] font-sans">
              <span>© {new Date().getFullYear()} RandomCoffee Inc. All rights reserved.</span>
              <div className="flex items-center gap-2 font-mono text-[10.5px] text-zinc-400">
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
