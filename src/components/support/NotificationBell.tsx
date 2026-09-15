import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type AppNotification,
} from '../../services/notificationService'

function timeLabel(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<AppNotification[]>([])
  const [unread, setUnread] = useState(0)
  const panelRef = useRef<HTMLDivElement | null>(null)

  async function refresh() {
    const data = await listNotifications()
    setItems(data.notifications)
    setUnread(data.unreadCount)
  }

  useEffect(() => {
    void refresh().catch(() => undefined)
    const timer = window.setInterval(() => void refresh().catch(() => undefined), 12000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!panelRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  async function openItem(item: AppNotification) {
    if (!item.read) {
      await markNotificationRead(item.id).catch(() => undefined)
      setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, read: true } : row)))
      setUnread((count) => Math.max(0, count - 1))
    }
    setOpen(false)
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-navy-900/60 hover:bg-navy-900/5 hover:text-navy-950"
        aria-label="Notifications"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-gold-500 px-1 text-center text-[10px] font-semibold text-navy-950">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-[0_16px_40px_-20px_rgba(10,22,40,0.35)]">
          <div className="flex items-center justify-between border-b border-navy-900/10 px-3 py-2">
            <p className="text-sm font-semibold text-navy-950">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                className="text-[11px] font-semibold text-gold-600 hover:underline"
                onClick={() => {
                  void markAllNotificationsRead()
                    .then(() => {
                      setItems((prev) => prev.map((row) => ({ ...row, read: true })))
                      setUnread(0)
                    })
                    .catch(() => undefined)
                }}
              >
                Mark all read
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <p className="px-3 py-4 text-xs text-navy-900/50">No notifications yet.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.link || '/dashboard'}
                    onClick={() => void openItem(item)}
                    className={`block px-3 py-2.5 hover:bg-navy-900/[0.04] ${item.read ? '' : 'bg-gold-500/8'}`}
                  >
                    <p className="text-sm font-medium text-navy-950">{item.title}</p>
                    {item.body && <p className="mt-0.5 text-xs text-navy-900/55">{item.body}</p>}
                    <p className="mt-1 text-[10px] text-navy-900/35">{timeLabel(item.createdAt)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
