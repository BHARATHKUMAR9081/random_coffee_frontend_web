import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { profileDisplayName } from '../../types'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../ui/Avatar'

export function ProfileMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const displayName = profileDisplayName(user.profile) || 'Your account'

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!panelRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full py-0.5 pl-0.5 pr-2 text-sm text-navy-900/70 hover:bg-navy-900/5 hover:text-navy-950"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <Avatar src={user.profile.profilePhotoUrl} name={displayName} size="sm" />
        <span className="hidden max-w-[140px] truncate sm:inline">{displayName}</span>
        <svg viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 text-navy-900/40 transition ${open ? 'rotate-180' : ''}`} aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-2xl border border-navy-900/10 bg-white py-1 shadow-[0_16px_40px_-20px_rgba(10,22,40,0.35)]"
        >
          <Link
            to="/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-3 py-2.5 text-sm text-navy-900 hover:bg-navy-900/[0.04]"
          >
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            className="block w-full px-3 py-2.5 text-left text-sm font-medium text-navy-950 hover:bg-navy-900/[0.04]"
            onClick={() => {
              setOpen(false)
              logout()
              navigate('/login')
            }}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
