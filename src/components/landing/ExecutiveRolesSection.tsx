import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { InteractiveDotGrid } from './InteractiveDotGrid'

interface SatelliteCardData {
  tag: string
  img: string
  alt: string
}

interface RoleStory {
  id: string
  label: string
  title: string
  description: string
  centerImage: string
  centerAlt: string
  satellites: {
    topRight: SatelliteCardData
    midLeft: SatelliteCardData
    bottomLeft: SatelliteCardData
    bottomRight: SatelliteCardData
  }
}

const ROLE_STORIES: RoleStory[] = [
  {
    id: 'founders',
    label: 'Founders',
    title: 'Founders',
    description:
      'Pitch work that wins the round. Direct access to active angel syndicates and tier-1 investors. The same canvas does both — rapid 120-second introductions and automatic mutual contact exchange at the speed of your round.',
    centerImage: '/images/founder-video-meeting.jpg',
    centerAlt: 'Startup Founder in 1:1 Pitch Meeting',
    satellites: {
      topRight: {
        tag: 'Campaign Variants',
        img: '/images/enterprise-demo.jpg',
        alt: 'Campaign Variants - Analytics Demo',
      },
      midLeft: {
        tag: 'Concept Boards',
        img: '/images/coffee-meeting.jpg',
        alt: 'Concept Boards - 1:1 Coffee Pitch',
      },
      bottomLeft: {
        tag: 'Treatment Decks',
        img: '/images/partner-conference.jpg',
        alt: 'Treatment Decks - VC Partner Review',
      },
      bottomRight: {
        tag: 'Spec Ads',
        img: '/images/partnership-handshake.jpg',
        alt: 'Spec Ads - Deal Handshake',
      },
    },
  },
  {
    id: 'investors',
    label: 'Investors',
    title: 'Investors',
    description:
      'Proprietary deal flow screened at pitch pace. Filter high-growth startup founders across AI, SaaS, and infrastructure without cold email noise or intermediary brokerage fees.',
    centerImage: '/images/investor-portrait.jpg',
    centerAlt: 'Venture Capital Partner Reviewing Deals',
    satellites: {
      topRight: {
        tag: 'Term Sheet',
        img: '/images/term-sheet.jpg',
        alt: 'Term Sheet & Cap Table Review',
      },
      midLeft: {
        tag: '1:1 Pitch',
        img: '/images/coffee-meeting.jpg',
        alt: 'Founder Pitch Meeting',
      },
      bottomLeft: {
        tag: 'Partner Review',
        img: '/images/partner-conference.jpg',
        alt: 'Venture Board Review',
      },
      bottomRight: {
        tag: 'Allocation Closed',
        img: '/images/contract-signing.jpg',
        alt: 'Signed Seed Allocation',
      },
    },
  },
  {
    id: 'buyers',
    label: 'Enterprise Buyers',
    title: 'Enterprise Buyers',
    description:
      'Evaluate cutting-edge software and developer tools in 2-minute zero-commitment briefing rooms. Direct access to technical founders who build the software.',
    centerImage: '/images/buyer-portrait.jpg',
    centerAlt: 'Enterprise VP of Procurement & Tech',
    satellites: {
      topRight: {
        tag: 'Architecture Pilot',
        img: '/images/cyber-compliance.jpg',
        alt: 'Cyber Compliance Architecture',
      },
      midLeft: {
        tag: 'Demo Brief',
        img: '/images/enterprise-demo.jpg',
        alt: 'Software Capability Demo',
      },
      bottomLeft: {
        tag: 'Security Scope',
        img: '/images/founder-video-meeting.jpg',
        alt: 'Technical Founder Briefing',
      },
      bottomRight: {
        tag: 'Vendor Signed',
        img: '/images/contract-signing.jpg',
        alt: 'Vendor Pilot Agreement',
      },
    },
  },
  {
    id: 'partners',
    label: 'Partners',
    title: 'Strategic Partners',
    description:
      'Connect with verified executives who have declared active project intent and immediate budget. Turn casual coffee breaks into genuine pipeline with mutual interest.',
    centerImage: '/images/partner-portrait.jpg',
    centerAlt: 'B2B Strategic Alliance Leader',
    satellites: {
      topRight: {
        tag: 'Joint Alliance',
        img: '/images/partnership-handshake.jpg',
        alt: 'Co-Selling Alliance',
      },
      midLeft: {
        tag: 'Deal Discovery',
        img: '/images/coffee-meeting.jpg',
        alt: 'Strategic Discovery Call',
      },
      bottomLeft: {
        tag: 'Integration Pilot',
        img: '/images/enterprise-demo.jpg',
        alt: 'Integration Scoping',
      },
      bottomRight: {
        tag: 'Commercial Agreement',
        img: '/images/contract-signing.jpg',
        alt: 'Signed Commercial Agreement',
      },
    },
  },
]

export function ExecutiveRolesSection() {
  const [pageIndex, setPageIndex] = useState<number>(0)

  const activeStory = ROLE_STORIES[pageIndex] || ROLE_STORIES[0]

  function handleTabSelect(idx: number) {
    if (idx === pageIndex) return
    setPageIndex(idx)
  }

  // Downward slide out on exit while next card enters and scales from the back stack
  const heroCardVariants: {
    enter: { x: number; y: number; scale: number; opacity: number; filter: string; zIndex: number }
    center: { x: number; y: number; scale: number; opacity: number; filter: string; zIndex: number; transition: { duration: number; ease: [number, number, number, number] } }
    exit: { x: number; y: number; scale: number; opacity: number; zIndex: number; transition: { duration: number; ease: [number, number, number, number] } }
  } = {
    enter: {
      x: 0,
      y: -24,
      scale: 0.91,
      opacity: 0.4,
      filter: 'blur(1px)',
      zIndex: 1,
    },
    center: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      zIndex: 10,
      transition: {
        duration: 0.42,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      x: 0,
      y: 130, // Slides smoothly downward!
      scale: 0.96,
      opacity: 0,
      zIndex: 20,
      transition: {
        duration: 0.36,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <section
      id="executive-roles"
      className="relative z-30 w-full min-h-screen min-h-[100dvh] overflow-hidden flex flex-col justify-center items-center py-6 sm:py-10 px-4 sm:px-6 lg:px-12 rounded-b-[3.5rem] border-b border-slate-200 shadow-[0_25px_60px_rgba(0,0,0,0.06)]"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Interactive Separating Dot Grid Canvas on White */}
      <InteractiveDotGrid
        dotColor="rgba(30, 41, 59, 0.16)"
        glowColor="rgba(217, 119, 6, 0.95)"
      />

      {/* Warm Orange Gradient Flare on Right Side (mirroring How It Works) */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col items-center justify-center my-auto">
        {/* ================================================================= */}
        {/* SECTION SEPARATION: EDITORIAL HEADING & TABLINES                  */}
        {/* ================================================================= */}
        <div className="w-full mb-3 sm:mb-5 pb-3 sm:pb-3.5 border-b border-slate-200/90 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] inline-block" />
              <span className="font-sans text-[11px] font-semibold tracking-wider text-amber-700 uppercase">
                EXECUTIVE ROLES
              </span>
            </div>
            <h2 className="font-display font-medium text-xl sm:text-2xl text-slate-900 tracking-tight leading-snug">
              Curated introductions built for your exact role
            </h2>
          </div>

          {/* Tablines: Role tabs directly on the separation line */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-0.5 -mb-3 sm:mb-0">
            {ROLE_STORIES.map((role, idx) => {
              const isSelected = pageIndex === idx
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleTabSelect(idx)}
                  className={`relative px-3.5 sm:px-4 py-2 text-xs font-sans transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'text-amber-700 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 font-medium'
                  }`}
                >
                  <span>{role.label}</span>
                  {isSelected && (
                    <motion.div
                      layoutId="active-role-tabline"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-500 shadow-[0_1px_6px_rgba(245,158,11,0.5)] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* CANVAS WORKSPACE: SCREEN-FILL VIEWPORT-ACCESSIBLE MOODBOARD       */}
        {/* ================================================================= */}
        <div className="relative w-full min-h-[500px] sm:min-h-[540px] lg:min-h-[570px] flex items-center justify-center">
          {/* ───────────────────────────────────────────────────────────── */}
          {/* SATELLITE 1: TOP-RIGHT (Compact Large: w-[205px] h-[195px])    */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="hidden lg:block absolute right-2 xl:right-8 top-[1%] z-20 w-[205px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`top-right-${activeStory.id}`}
                initial={{ opacity: 0, scale: 0.94, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 10 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-2xl bg-white p-2 shadow-[0_12px_32px_rgba(0,0,0,0.07)] border border-slate-200/90 group hover:scale-104 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-full h-[185px] rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={activeStory.satellites.topRight.img}
                    alt={activeStory.satellites.topRight.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-[#FFE600] text-black font-sans font-medium text-[10.5px] shadow-sm">
                    {activeStory.satellites.topRight.tag}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* SATELLITE 2: MID-LEFT (Compact Small: w-[155px] h-[145px])     */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="hidden lg:block absolute left-3 xl:left-10 top-[24%] z-20 w-[155px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`mid-left-${activeStory.id}`}
                initial={{ opacity: 0, scale: 0.94, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 10 }}
                transition={{ duration: 0.32, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-2xl bg-white p-2 shadow-[0_10px_28px_rgba(0,0,0,0.07)] border border-slate-200/90 group hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-full h-[145px] rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={activeStory.satellites.midLeft.img}
                    alt={activeStory.satellites.midLeft.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-[#FFE600] text-black font-sans font-medium text-[10px] shadow-sm">
                    {activeStory.satellites.midLeft.tag}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* SATELLITE 3: BOTTOM-RIGHT (Compact Medium: w-[160px] h-[155px])*/}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="hidden lg:block absolute right-3 xl:right-10 bottom-[3%] z-20 w-[160px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`bottom-right-${activeStory.id}`}
                initial={{ opacity: 0, scale: 0.94, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 10 }}
                transition={{ duration: 0.32, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-2xl bg-white p-2 shadow-[0_10px_28px_rgba(0,0,0,0.07)] border border-slate-200/90 group hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-full h-[155px] rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={activeStory.satellites.bottomRight.img}
                    alt={activeStory.satellites.bottomRight.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-[#FFE600] text-black font-sans font-medium text-[10px] shadow-sm">
                    {activeStory.satellites.bottomRight.tag}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* SATELLITE 4: BOTTOM-LEFT (Compact Medium: w-[160px] h-[155px]) */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="hidden lg:block absolute left-3 xl:left-10 bottom-[2%] z-20 w-[160px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`bottom-left-${activeStory.id}`}
                initial={{ opacity: 0, scale: 0.94, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 10 }}
                transition={{ duration: 0.32, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-2xl bg-white p-2 shadow-[0_10px_28px_rgba(0,0,0,0.07)] border border-slate-200/90 group hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-full h-[155px] rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={activeStory.satellites.bottomLeft.img}
                    alt={activeStory.satellites.bottomLeft.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-[#FFE600] text-black font-sans font-medium text-[10px] shadow-sm">
                    {activeStory.satellites.bottomLeft.tag}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* CENTER HERO STACKED CARD DECK (COMPACT TALL PORTRAIT FORMAT)  */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="relative w-full max-w-[340px] sm:max-w-[370px] min-h-[400px] sm:min-h-[435px] z-10 flex flex-col items-center justify-center my-auto">
            {/* Stacked Back Card Layer 3 (Highest, peeking ~28px above) */}
            <div className="absolute -top-7 inset-x-8 h-16 rounded-t-2xl bg-white border border-slate-300/80 shadow-sm -z-30 transform scale-[0.90] overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-amber-200/35 via-rose-200/35 to-slate-100" />
            </div>

            {/* Stacked Back Card Layer 2 (Middle, peeking ~16px above with subtle color) */}
            <div className="absolute -top-4 inset-x-5 h-16 rounded-t-2xl bg-white border border-slate-300/90 shadow-sm -z-20 transform scale-[0.95] overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-400/20" />
            </div>

            {/* Stacked Back Card Layer 1 (Just behind main card, peeking ~7px) */}
            <div className="absolute -top-2 inset-x-2.5 h-14 rounded-t-2xl bg-white border border-slate-200 shadow-sm -z-10 transform scale-[0.98]" />

            {/* MAIN FRONT HERO CARD: CAROUSEL WITH DOWNWARD SLIDE OUT & BACK-SIDE ENTRANCE */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={activeStory.id}
                variants={heroCardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden text-left select-none"
              >
                {/* Top Media Stage */}
                <div className="relative w-full h-[270px] sm:h-[300px] overflow-hidden bg-slate-900">
                  <img
                    src={activeStory.centerImage}
                    alt={activeStory.centerAlt}
                    className="w-full h-full object-cover pointer-events-none"
                  />

                  {/* Left vertical brand label running up the side (Melius style) */}
                  <div className="absolute top-1/2 left-2.5 -translate-y-1/2 -rotate-90 origin-left text-[8.5px] font-sans font-semibold tracking-[0.2em] text-white/80 uppercase pointer-events-none select-none">
                    RANDOMCOFFEE
                  </div>

                  {/* In-Call HUD Overlays: Meeting status tag */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 border border-white/20 backdrop-blur-md text-[10px] font-sans text-emerald-400 font-medium flex items-center gap-1.5 shadow-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>1:1 Meeting in Progress</span>
                  </div>
                </div>

                {/* Bottom Editorial Copy */}
                <div className="p-4 sm:p-5 text-left bg-white">
                  <h3 className="font-display font-medium text-2xl sm:text-[26px] text-slate-900 tracking-[-0.02em] leading-tight mb-1.5">
                    {activeStory.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed font-sans line-clamp-3">
                    {activeStory.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Satellite Cards Grid (Visible on smaller screens below lg) */}
        <div className="grid grid-cols-2 gap-2.5 lg:hidden mt-3 mb-4 w-full max-w-sm">
          {[
            activeStory.satellites.topRight,
            activeStory.satellites.midLeft,
            activeStory.satellites.bottomLeft,
            activeStory.satellites.bottomRight,
          ].map((item) => (
            <div
              key={item.tag}
              className="rounded-xl bg-white p-1.5 border border-slate-200/90 shadow-sm text-left"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 mb-1">
                <img src={item.img} alt={item.tag} className="w-full h-full object-cover" />
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#FFE600] text-black font-sans font-medium text-[8.5px] shadow-sm">
                  {item.tag}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
