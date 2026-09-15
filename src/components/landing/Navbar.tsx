import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

interface NavbarProps {
  onNavigateSection?: (section: 'how-it-works' | 'roles') => void
}

const HOW_IT_WORKS_PREVIEW = {
  step: '01 / 03',
  tag: 'DETERMINISTIC SPEED',
  title: 'Sub-Second Verified Matchmaking',
  desc: 'Algorithmic matching connecting founders, angel investors, and business leaders in seconds.',
  stats: '18.4s median time · 94.2% conversion',
}

type NavMode = 'hero' | 'curved' | 'footer'

export function Navbar({ onNavigateSection }: NavbarProps) {
  const [navMode, setNavMode] = useState<NavMode>('hero')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showHowItWorksPreview, setShowHowItWorksPreview] = useState(false)
  const leaveTimer = useRef<number | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY
      const capabilitiesEl =
        document.getElementById('capabilities-section') ||
        document.getElementById('mobile-feature-0')
      const rolesEl = document.getElementById('executive-roles')

      if (!capabilitiesEl || !rolesEl) {
        setNavMode(scrollY > 40 ? 'curved' : 'hero')
        return
      }

      const capRect = capabilitiesEl.getBoundingClientRect()
      const rolesRect = rolesEl.getBoundingClientRect()

      // When How It Works enters the screen (top <= 90px)
      // and until Roles section leaves the screen (bottom >= 70px):
      if (capRect.top <= 90 && rolesRect.bottom >= 70) {
        setNavMode('curved')
      } else if (rolesRect.bottom < 70) {
        // Scrolled down past Roles into Footer section:
        setNavMode('footer')
      } else {
        // At starting Hero section:
        setNavMode('hero')
      }
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

  const isCurved = navMode === 'curved'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isCurved
          ? 'pointer-events-none pt-3 sm:pt-4 px-3 sm:px-6'
          : navMode === 'footer'
          ? 'bg-[#06080F]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-3.5 px-6 sm:px-12 pointer-events-auto'
          : 'bg-transparent py-5 sm:py-6 px-6 sm:px-12 pointer-events-auto'
      }`}
    >
      <div
        className={`mx-auto transition-all duration-500 ease-out flex items-center justify-between relative ${
          isCurved
            ? 'max-w-6xl pointer-events-auto py-2 sm:py-2.5 px-4 sm:px-6'
            : 'w-full max-w-7xl pointer-events-auto py-0 px-0'
        }`}
      >
        {/* Floating Curved Glass Capsule Backdrop (Visible only when in Curved Dock mode) */}
        <div
          className={`absolute inset-0 rounded-full transition-opacity duration-500 pointer-events-none overflow-hidden ${
            isCurved
              ? 'opacity-100 border border-white/[0.14] bg-[#080C16]/90 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.7),0_0_24px_rgba(245,158,11,0.12)]'
              : 'opacity-0'
          }`}
        >
          {/* Ambient Top Glow Line inside the capsule */}
          <div className="absolute inset-x-12 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent pointer-events-none" />
          <div className="absolute inset-x-28 -top-8 h-12 bg-amber-500/15 blur-xl pointer-events-none rounded-full" />
        </div>

        {/* Left: Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-2.5 group relative z-10">
          <div className="relative">
            <img
              src="/brand-logo.jpg"
              alt="RandomCoffee"
              className={`object-cover transition-all duration-300 ${
                isCurved
                  ? 'h-7 w-7 sm:h-8 sm:w-8 rounded-xl shadow-[0_0_16px_rgba(212,175,55,0.45)] group-hover:scale-105'
                  : 'h-8 w-8 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:scale-105'
              }`}
            />
            {isCurved && (
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] ring-2 ring-[#080C16]" />
            )}
          </div>
          <span className="font-display font-medium text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
            Random<span className={isCurved ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-gold-400 to-amber-500' : 'text-gold-400'}>Coffee</span>
            {isCurved && (
              <span className="hidden lg:inline-flex text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-semibold tracking-wider">
                LIVE
              </span>
            )}
          </span>
        </Link>

        {/* Center: Navigation Pill Bar */}
        <div
          className="relative hidden md:block z-10"
          onMouseLeave={handleMouseLeave}
        >
          {isCurved ? (
            <nav className="flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono tracking-wider text-zinc-300 shadow-inner">
              <Link
                to="/login"
                className="px-3.5 py-1 rounded-full hover:text-amber-300 hover:bg-white/[0.06] transition-all uppercase"
              >
                PLATFORM
              </Link>
              <span className="text-zinc-600 select-none text-[10px]">·</span>
              <button
                type="button"
                onMouseEnter={handleMouseEnter}
                onClick={() => handleSectionClick('how-it-works')}
                className={`px-3.5 py-1 rounded-full hover:text-amber-300 hover:bg-white/[0.06] transition-all uppercase cursor-pointer flex items-center gap-1.5 ${
                  showHowItWorksPreview ? 'text-amber-300 bg-white/[0.08] shadow-[0_0_12px_rgba(245,158,11,0.25)]' : ''
                }`}
              >
                <span>HOW IT WORKS</span>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              </button>
              <span className="text-zinc-600 select-none text-[10px]">·</span>
              <button
                type="button"
                onClick={() => handleSectionClick('roles')}
                className="px-3.5 py-1 rounded-full hover:text-amber-300 hover:bg-white/[0.06] transition-all uppercase cursor-pointer"
              >
                ROLES
              </button>
              <span className="text-zinc-600 select-none text-[10px]">·</span>
              <Link
                to="/pricing"
                className="px-3.5 py-1 rounded-full hover:text-amber-300 hover:bg-white/[0.06] transition-all uppercase"
              >
                PRICING
              </Link>
              <span className="ml-1 mr-0.5 flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 select-none">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                ACTIVE
              </span>
            </nav>
          ) : (
            <nav className="flex items-center gap-6 text-[11px] font-tech tracking-[0.18em] text-zinc-300 glass-pill px-7 py-2.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <Link to="/login" className="hover:text-gold-400 transition-colors uppercase">
                PLATFORM
              </Link>
              <span className="text-zinc-600">·</span>
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
          )}

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
        <div className="flex items-center gap-2 sm:gap-2.5 z-10">
          <Link
            to="/login"
            className={
              isCurved
                ? 'hidden sm:inline-flex items-center px-4 py-1.5 text-xs font-mono font-medium tracking-wider text-zinc-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-amber-400/40 rounded-full transition-all duration-300 shadow-sm'
                : 'hidden sm:inline-flex items-center px-4 py-1.5 text-xs font-tech font-medium tracking-wider text-zinc-200 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-sm transition'
            }
          >
            LOG IN
          </Link>
          <Link
            to="/register"
            className={
              isCurved
                ? 'group px-4.5 py-1.5 text-xs font-mono font-bold tracking-wider text-black bg-gradient-to-r from-amber-200 via-gold-400 to-amber-500 hover:from-amber-100 hover:via-gold-300 hover:to-amber-400 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.45)] hover:shadow-[0_0_30px_rgba(212,175,55,0.7)] transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] flex items-center gap-1.5'
                : 'px-4 py-1.5 text-xs font-tech font-bold tracking-wider text-black bg-gradient-to-r from-amber-200 via-gold-400 to-amber-500 rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.65)] transition-all transform hover:-translate-y-0.5'
            }
          >
            <span>SIGN UP</span>
            {isCurved && (
              <span className="text-xs transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className={`md:hidden p-1.5 text-zinc-400 hover:text-white cursor-pointer transition ${
              isCurved ? 'rounded-full hover:bg-white/10' : ''
            }`}
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
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 text-center text-xs font-tech font-semibold rounded-lg bg-white/5 text-white cursor-pointer"
            >
              SIGN IN
            </Link>
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
