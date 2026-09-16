import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FullScene3D } from '../components/landing/FullScene3D'
import { StickyFeatureShowcase } from '../components/landing/StickyFeatureShowcase'
import { ExecutiveRolesSection } from '../components/landing/ExecutiveRolesSection'
import { BottomCtaSection } from '../components/landing/BottomCtaSection'
import { Navbar } from '../components/landing/Navbar'
import { BackgroundGradients } from '../components/landing/BackgroundGradients'
import { StaggerContainer, StaggerItem } from '../components/landing/StaggerContainer'

export function LandingPage() {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true })
    }
  }, [isLoggedIn, navigate])

  function handleNavigateSection(section: 'how-it-works' | 'roles') {
    if (section === 'roles') {
      const el = document.getElementById('executive-roles')
      if (el) {
        const targetTop = el.getBoundingClientRect().top + window.scrollY - 36
        window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
      }
      return
    }

    const isMobile = window.innerWidth < 768
    if (isMobile) {
      const el = document.getElementById('mobile-feature-0')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    const sectionEl = document.getElementById('capabilities-section')
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#06080F] text-white selection:bg-gold-500 selection:text-black font-sans relative">
      {/* Background Movement: Subtle Gradients & Grid Lines driven by CSS transform */}
      <BackgroundGradients />

      {/* Header: Fixed top navbar with transparent top and blur/border on scroll */}
      <Navbar onNavigateSection={handleNavigateSection} />

      {/* ============================================================ */}
      {/* CHAPTER 1: DARK OBSIDIAN & COFFEE-GOLD 3D REVOLVING GLOBE HERO */}
      {/* ============================================================ */}
      <div ref={heroRef} className="h-screen h-[100dvh] relative flex flex-col justify-end overflow-hidden select-none bg-[#06080F]">
        {/* Full-Screen Three.js Revolving 3D Globe Engine */}
        <FullScene3D />

        {/* Hero Copy & Headline with Staggered Scroll Animation */}
        <main className="relative flex flex-col justify-end px-6 sm:px-12 lg:px-16 pb-10 sm:pb-14 z-20 pointer-events-none w-full max-w-7xl mx-auto">
          <StaggerContainer className="w-full grid items-end gap-x-8 gap-y-10 sm:grid-cols-12" staggerDelay={0.09}>
            {/* Left Column (Cols 1-7): Monumental Editorial Headline */}
            <StaggerItem className="sm:col-start-1 sm:col-end-8 text-left pointer-events-auto">
              <h1 className="font-display font-light text-4xl sm:text-6xl md:text-7xl lg:text-[4.5rem] xl:text-[5.5rem] text-white tracking-[-0.025em] leading-[1.04] select-none">
                Connect with
                <br />
                business leaders within a
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-gold-400 to-amber-500 font-normal">
                  cup of coffee
                </span>
              </h1>
            </StaggerItem>

            {/* Right Column (Cols 8-12): Copy & Action Buttons */}
            <StaggerItem className="sm:col-start-8 sm:col-end-13 lg:col-start-9 lg:col-end-13 flex flex-col gap-6 max-w-[360px] ml-auto text-left pointer-events-auto pb-1">
              <p className="text-sm sm:text-[15px] text-zinc-300/90 leading-relaxed font-normal">
                Turn your coffee break into high-value partnerships. RandomCoffee connects verified founders, investors, and business leaders for focused 2-minute 1:1 video chats — zero cold outreach, zero spam, pure serendipity.
              </p>

              <div className="flex items-center gap-3.5">
                <Link
                  to="/register"
                  className="px-6 py-3 text-xs font-mono font-semibold tracking-wider uppercase text-black bg-gradient-to-r from-amber-200 via-gold-400 to-amber-500 rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.65)] transition-all transform hover:-translate-y-0.5"
                >
                  TRY IT NOW
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 text-xs font-mono font-medium tracking-wider uppercase text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-sm backdrop-blur-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  SIGN IN
                </Link>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </main>
      </div>

      {/* ============================================================ */}
      {/* CHAPTER 2: LIGHT ARCHITECTURAL SHOWCASE (Sticky Desktop / Stacked Mobile) */}
      {/* ============================================================ */}
      <StickyFeatureShowcase />

      {/* ============================================================ */}
      {/* CHAPTER 3: TARGETED EXECUTIVE INTRODUCTIONS & ROLES          */}
      {/* ============================================================ */}
      <ExecutiveRolesSection />

      {/* ============================================================ */}
      {/* CHAPTER 4: DARK OBSIDIAN & COFFEE GOLD 3D FINALE & FOOTER    */}
      {/* ============================================================ */}
      <BottomCtaSection />
    </div>
  )
}
