import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

interface NavbarProps {
  onNavigateSection?: (section: 'how-it-works' | 'roles') => void
  onDemoClick: () => void
}

const HOW_IT_WORKS_PREVIEW = {
  step: '01 / 03',
  tag: 'DETERMINISTIC SPEED',
  title: 'Sub-Second Verified Matchmaking',
  desc: 'Algorithmic matching connecting founders, angel investors, and enterprise buyers in seconds.',
  stats: '18.4s median time · 94.2% conversion',
}

export function Navbar({ onNavigateSection, onDemoClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showHowItWorksPreview, setShowHowItWorksPreview] = useState(false)
  const leaveTimer = useRef<number | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 24) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
      setShowHowItWorksPreview(false)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  function handleSectionClick(section: 'how-it-works' | 'roles') {
    setShowHowItWorksPreview(false)
    setMobileMenuOpen(false)

    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        onNavigateSection?.(section)
      }, 150)
    } else {
      onNavigateSection?.(section)
    }
  }

  function handleMouseEnter() {
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current)
      leaveTimer.current = null
    }
    setShowHowItWorksPreview(true)
  }

  function handleMouseLeave() {
    leaveTimer.current = window.setTimeout(() => {
      setShowHowItWorksPreview(false)
    }, 200)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#06080F]/80 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-3.5'
          : 'bg-transparent border-b border-transparent py-5 sm:py-6'
      }`}
    >
      <div className="px-6 sm:px-12 flex items-center justify-between w-full max-w-7xl mx-auto relative">
        {/* Left: Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/brand-logo.jpg"
            alt="RandomCoffee"
            className="h-8 w-8 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.4)] object-cover group-hover:scale-105 transition"
          />
          <span className="font-display font-medium text-base tracking-tight text-white">
            Random<span className="text-gold-400">Coffee</span>
          </span>
        </Link>

        {/* Center: Cerebrium Floating Glass Pill Bar */}
        <div
          className="relative hidden md:block"
          onMouseLeave={handleMouseLeave}
        >
          <nav className="flex items-center gap-6 text-[11px] font-tech tracking-[0.18em] text-zinc-300 glass-pill px-7 py-2.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {/* PLATFORM directly links to /login */}
            <Link
              to="/login"
              className="hover:text-gold-400 transition-colors uppercase"
            >
              PLATFORM
            </Link>
            <span className="text-zinc-600">·</span>

            {/* HOW IT WORKS opens preview on hover and scrolls to midsection on click */}
            <button
              type="button"
              onMouseEnter={handleMouseEnter}
              onClick={() => handleSectionClick('how-it-works')}
              className={`hover:text-gold-400 transition-colors uppercase cursor-pointer ${
                showHowItWorksPreview ? 'text-gold-400' : ''
              }`}
            >
              HOW IT WORKS
            </button>
            <span className="text-zinc-600">·</span>

            {/* ROLES scrolls to the targeted introductions section */}
            <button
              type="button"
              onClick={() => handleSectionClick('roles')}
              className="hover:text-gold-400 transition-colors uppercase cursor-pointer"
            >
              ROLES
            </button>
            <span className="text-zinc-600">·</span>

            <Link to="/pricing" className="hover:text-gold-400 transition-colors uppercase">
              PRICING
            </Link>
            <span className="text-gold-400/80 font-tech select-none">::</span>
          </nav>

          {/* Non-Intrusive Floating Preview Flyout for HOW IT WORKS */}
          {showHowItWorksPreview && (
            <div
              className="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-[350px] sm:w-[380px] p-4 rounded-2xl bg-[#090D18]/95 border border-gold-500/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-left transition-all z-50 animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
              onMouseEnter={() => {
                if (leaveTimer.current) {
                  window.clearTimeout(leaveTimer.current)
                  leaveTimer.current = null
                }
              }}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between font-mono text-[9px] mb-2 pb-1.5 border-b border-white/10">
                <span className="text-gold-400 font-semibold tracking-wider uppercase">
                  {HOW_IT_WORKS_PREVIEW.step} · {HOW_IT_WORKS_PREVIEW.tag}
                </span>
                <span className="text-zinc-500 font-sans">PHASE 1 MVP</span>
              </div>
              <h4 className="font-display font-semibold text-white text-base leading-snug">
                {HOW_IT_WORKS_PREVIEW.title}
              </h4>
              <p className="text-xs text-zinc-300 font-sans mt-1.5 leading-relaxed">
                {HOW_IT_WORKS_PREVIEW.desc}
              </p>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-400">{HOW_IT_WORKS_PREVIEW.stats}</span>
                <button
                  type="button"
                  onClick={() => handleSectionClick('how-it-works')}
                  className="px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>Explore Section</span>
                  <span className="text-amber-400">↓</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Dual Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center px-4 py-1.5 text-xs font-tech font-medium tracking-wider text-zinc-200 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-sm transition"
          >
            LOG IN
          </Link>
          <Link
            to="/register"
            className="px-4 py-1.5 text-xs font-tech font-bold tracking-wider text-black bg-gradient-to-r from-amber-200 via-gold-400 to-amber-500 rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.65)] transition-all transform hover:-translate-y-0.5"
          >
            SIGN UP
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="md:hidden p-1.5 text-zinc-400 hover:text-white cursor-pointer"
            aria-label="Toggle navigation"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-20 z-50 rounded-2xl border border-white/10 bg-[#090C14]/95 backdrop-blur-2xl p-5 md:hidden space-y-3 shadow-2xl">
          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-left w-full text-sm font-tech text-zinc-300 hover:text-gold-400 transition cursor-pointer"
          >
            PLATFORM
          </Link>
          <button
            type="button"
            onClick={() => handleSectionClick('how-it-works')}
            className="block text-left w-full text-sm font-tech text-zinc-300 hover:text-gold-400 transition cursor-pointer"
          >
            HOW IT WORKS
          </button>
          <button
            type="button"
            onClick={() => handleSectionClick('roles')}
            className="block text-left w-full text-sm font-tech text-zinc-300 hover:text-gold-400 transition cursor-pointer"
          >
            ROLES
          </button>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-tech text-zinc-300 hover:text-gold-400 transition"
          >
            PRICING
          </Link>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                onDemoClick()
                setMobileMenuOpen(false)
              }}
              className="w-full py-2 text-xs font-tech font-semibold rounded-lg bg-white/5 text-white cursor-pointer"
            >
              TRY DEMO MODE
            </button>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 text-center text-xs font-tech font-bold rounded-lg bg-gradient-to-r from-amber-200 to-gold-500 text-black"
            >
              SIGN UP FREE
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
