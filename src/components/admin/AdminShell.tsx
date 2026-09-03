import { useEffect, useState, type ReactNode, type SVGProps } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { fetchStaffOverview } from '../../services/staffService'

function Icon({ path, ...props }: SVGProps<SVGSVGElement> & { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden {...props}>
      <path d={path} />
    </svg>
  )
}

const nav = [
  { to: '/admin', label: 'Dashboard', end: true, path: 'M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z' },
  { to: '/admin/users', label: 'Users', path: 'M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM20 19v-1a3.5 3.5 0 0 0-2.5-3.35M17.5 7.15a3 3 0 0 1 0 5.7' },
  { to: '/admin/team', label: 'Team members', superOnly: true, path: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  { to: '/admin/tickets', label: 'Support tickets', path: 'M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3v-3H6a2 2 0 0 1-2-2z' },
  { to: '/admin/reports', label: 'Reports', path: 'M12 9v4M12 17h.01M10.3 4.3 2.8 17.5A2 2 0 0 0 4.5 20.5h15a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z' },
  { to: '/admin/sessions', label: 'Sessions', path: 'M15 10l4.55-2.1A1 1 0 0 1 21 8.8v6.4a1 1 0 0 1-1.45.9L15 14M4 7h11a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z' },
  { to: '/admin/audit', label: 'Audit log', path: 'M8 7h8M8 12h8M8 17h5M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z' },
  { to: '/admin/plans', label: 'Plans', superOnly: true, path: 'M4 7h16M4 12h16M4 17h10' },
  { to: '/admin/usage', label: 'Usage logs', path: 'M4 19V5h4l3 6 3-6h4v14' },
  { to: '/admin/settings', label: 'Settings', path: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 13a7.7 7.7 0 0 0 .1-2l2-1.5-2-3.5-2.4 1a7.6 7.6 0 0 0-1.7-1L15 3h-6l-.4 2.5a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7.7 7.7 0 0 0 .1 2l-2 1.5 2 3.5 2.4-1a7.6 7.6 0 0 0 1.7 1L9 21h6l.4-2.5a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.5z' },
]

function NavItems({
  isSuper,
  openTickets,
  onNavigate,
}: {
  isSuper: boolean
  openTickets: number
  onNavigate?: () => void
}) {
  return (
    <nav className="flex flex-col gap-1">
      {nav
        .filter((item) => !item.superOnly || isSuper)
        .map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-gold-500/15 text-navy-950' : 'text-navy-900/60 hover:bg-navy-950/[0.04] hover:text-navy-950'
              }`
            }
          >
            <Icon path={item.path} />
            <span className="flex-1">{item.label}</span>
            {item.to === '/admin/tickets' && openTickets > 0 && (
              <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">{openTickets}</span>
            )}
          </NavLink>
        ))}
    </nav>
  )
}

export function AdminShell({ children }: { children?: ReactNode }) {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const isSuper = admin?.role === 'super_admin'
  const [openTickets, setOpenTickets] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    void fetchStaffOverview()
      .then((row) => setOpenTickets(row.openTickets))
      .catch(() => undefined)
  }, [])

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-cream-50 text-navy-950">
      <aside className="hidden h-full w-64 shrink-0 flex-col overflow-hidden border-r border-navy-900/10 bg-white lg:flex">
        <Link to="/admin" className="shrink-0 border-b border-navy-900/10 px-5 py-4 font-semibold">
          <span className="text-gold-500">Random</span>Coffee
          <span className="mt-1 block text-[11px] font-medium uppercase tracking-wide text-navy-900/40">
            {isSuper ? 'Super admin' : 'Staff'}
          </span>
        </Link>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          <NavItems isSuper={isSuper} openTickets={openTickets} />
        </div>
        <div className="shrink-0 border-t border-navy-900/10 p-4">
          <p className="truncate text-sm font-medium">{admin?.name || 'Staff'}</p>
          <p className="truncate text-xs text-navy-900/50">{admin?.email}</p>
          <button type="button" onClick={handleLogout} className="mt-3 text-sm font-medium text-navy-900/60 hover:text-navy-950">
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-navy-900/10 bg-white px-4 py-3 lg:hidden">
          <Link to="/admin" className="font-semibold">
            <span className="text-gold-500">Random</span>Coffee
          </Link>
          <button
            type="button"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-navy-900/70 hover:bg-navy-950/5"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </button>
        </header>
        {menuOpen && (
          <div className="shrink-0 overflow-y-auto border-b border-navy-900/10 bg-white px-3 py-3 lg:hidden">
            <NavItems isSuper={isSuper} openTickets={openTickets} onNavigate={() => setMenuOpen(false)} />
            <button type="button" onClick={handleLogout} className="mt-3 px-3 text-sm font-medium text-navy-900/60">
              Log out
            </button>
          </div>
        )}
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-8 sm:px-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  )
}
