import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { NotificationBell } from '../support/NotificationBell'
import { ProfileMenu } from './ProfileMenu'

const nav = [
  { to: '/dashboard', label: 'Home' },
  { to: '/connections', label: 'Connections' },
  { to: '/help', label: 'Support' },
  { to: '/pricing', label: 'Pricing' },
]

export function AppShell({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  if (!isLoggedIn && location.pathname === '/') {
    return <>{children}</>
  }

  return (
    <div className="min-h-dvh bg-cream-50 text-navy-950">
      <header className="sticky top-0 z-40 border-b border-navy-900/10 bg-white/95 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className={`mx-auto flex items-center justify-between gap-3 px-4 py-3 ${isLoggedIn ? 'max-w-6xl' : 'max-w-5xl'}`}>
          <Link to={isLoggedIn ? '/dashboard' : '/'} className="min-w-0 shrink-0 font-semibold text-navy-950">
            <span className="text-gold-500">Random</span>Coffee
          </Link>
          {isLoggedIn && (
            <div className="flex min-w-0 items-center gap-1 sm:gap-3">
              <nav className="hidden items-center gap-4 text-sm md:flex">
                {nav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      isActive ? 'font-medium text-navy-950' : 'text-navy-900/60 hover:text-navy-950'
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <NotificationBell />
              <ProfileMenu />
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-navy-900/70 hover:bg-navy-900/5 hover:text-navy-950 md:hidden"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                {menuOpen ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
                    <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
                    <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
        {isLoggedIn && menuOpen && (
          <div className="border-t border-navy-900/10 bg-white px-4 py-3 md:hidden">
            <nav className="mx-auto flex max-w-6xl flex-col">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-3 text-base font-medium ${
                      isActive ? 'bg-gold-500/15 text-navy-950' : 'text-navy-900/80 hover:bg-navy-900/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-3 text-base font-medium ${
                    isActive ? 'bg-gold-500/15 text-navy-950' : 'text-navy-900/80 hover:bg-navy-900/5'
                  }`
                }
              >
                Profile
              </NavLink>
            </nav>
          </div>
        )}
      </header>
      <main
        className={`mx-auto px-4 py-5 sm:py-8 ${isLoggedIn ? 'max-w-6xl' : 'max-w-5xl'} pb-[max(1.25rem,env(safe-area-inset-bottom))]`}
      >
        {children}
      </main>
    </div>
  )
}
