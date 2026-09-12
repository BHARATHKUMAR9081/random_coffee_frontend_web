import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { VerificationBadges } from '../components/ui/VerificationBadges'
import { ApiError } from '../services/http'
import {
  acceptConnection,
  cancelConnection,
  declineConnection,
  listConnections,
  type ConnectionRecord,
} from '../services/connectionService'

function ConnectionCard({
  row,
  onAccept,
  onDecline,
  onCancel,
  busyId,
}: {
  row: ConnectionRecord
  onAccept?: (id: string) => void
  onDecline?: (id: string) => void
  onCancel?: (id: string) => void
  busyId: string | null
}) {
  const other = row.otherUser
  const busy = busyId === row.id
  return (
    <li className="flex flex-col gap-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar src={other.profilePhotoUrl} name={other.name || 'Unknown'} size="md" />
        <div className="min-w-0">
        {other.accountId ? (
          <Link to={`/people/${other.accountId}`} className="hover:underline">
            <p className="truncate font-medium">{other.name || 'Unknown'}</p>
            <p className="truncate text-xs text-navy-900/50">
              {other.companyName || 'No company'}
              {other.city ? ` · ${other.city}` : ''}
            </p>
          </Link>
        ) : (
          <>
            <p className="truncate font-medium">{other.name || 'Unknown'}</p>
            <p className="truncate text-xs text-navy-900/50">
              {other.companyName || 'No company'}
              {other.city ? ` · ${other.city}` : ''}
            </p>
          </>
        )}
        {row.status === 'accepted' && row.lastMessagePreview && (
          <p className="mt-1 max-w-full truncate text-xs text-navy-900/60 sm:max-w-xs">{row.lastMessagePreview}</p>
        )}
        <VerificationBadges className="mt-1" business={other.isProfileVerified} identity={other.isIdentityVerified} />
        </div>
      </div>
      {row.canAccept ? (
        <div className="flex w-full gap-2 sm:w-auto">
          <Button className="flex-1 sm:flex-none" disabled={busy} onClick={() => onAccept?.(row.id)}>
            {busy ? 'Saving…' : 'Accept'}
          </Button>
          <Button className="flex-1 sm:flex-none" variant="secondary" disabled={busy} onClick={() => onDecline?.(row.id)}>
            Decline
          </Button>
        </div>
      ) : row.status === 'accepted' ? (
        <div className="flex w-full items-center gap-2 sm:w-auto">
          {(row.unreadCount ?? 0) > 0 && (
            <span className="rounded-full bg-gold-500 px-2 py-0.5 text-xs font-semibold text-navy-950">
              {row.unreadCount}
            </span>
          )}
          <Link to={`/connections/${row.id}`} className="min-w-0 flex-1 sm:flex-none">
            <Button className="w-full">Open chat</Button>
          </Link>
        </div>
      ) : row.canCancel ? (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <span className="rounded-full bg-navy-900/10 px-2.5 py-0.5 text-center text-xs font-semibold text-navy-900/60">
            Waiting for them
          </span>
          <Button variant="secondary" className="w-full sm:w-auto" disabled={busy} onClick={() => onCancel?.(row.id)}>
            {busy ? 'Cancelling…' : 'Cancel'}
          </Button>
        </div>
      ) : (
        <span className="rounded-full bg-navy-900/10 px-2.5 py-0.5 text-xs font-semibold text-navy-900/60">
          {row.status}
        </span>
      )}
    </li>
  )
}

export function ConnectionsPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState<ConnectionRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function refresh() {
    if (user.id === 'demo') {
      setRows([])
      return
    }
    const data = await listConnections()
    setRows(data.connections)
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        if (user.id === 'demo') {
          if (!cancelled) setRows([])
          return
        }
        const data = await listConnections()
        if (!cancelled) {
          setRows(data.connections)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Could not load connections.')
        }
      }
    }
    void load()
    const timer = window.setInterval(() => void load(), 8000)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [user.id])

  async function runAction(id: string, action: () => Promise<unknown>, fallback: string) {
    setBusyId(id)
    try {
      await action()
      await refresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : fallback)
    } finally {
      setBusyId(null)
    }
  }

  const incoming = rows.filter((row) => row.status === 'pending' && row.direction === 'received')
  const outgoing = rows.filter((row) => row.status === 'pending' && row.direction === 'sent')
  const accepted = rows.filter((row) => row.status === 'accepted')
  const declined = rows.filter((row) => row.status === 'declined')

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-950">Connections</h1>
        <p className="mt-1 text-sm text-navy-900/55">One person sends a request. Chat unlocks when the other accepts.</p>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => void refresh().catch(() => undefined)}
            className="font-medium underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}

      {user.id === 'demo' && (
        <p className="rounded-2xl border border-navy-900/10 bg-white px-4 py-3 text-sm text-navy-900/70">
          Demo mode does not send real connection requests. Sign in with an account to use this.
        </p>
      )}

      <section className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
        <h2 className="text-sm font-semibold text-navy-900">Requests for you</h2>
        {incoming.length === 0 ? (
          <p className="mt-2 text-sm text-navy-900/50">No pending requests.</p>
        ) : (
          <ul className="mt-2 divide-y divide-navy-900/10">
            {incoming.map((row) => (
              <ConnectionCard
                key={row.id}
                row={row}
                busyId={busyId}
                onAccept={(id) => void runAction(id, () => acceptConnection(id), 'Could not accept this request.')}
                onDecline={(id) => void runAction(id, () => declineConnection(id), 'Could not decline this request.')}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
        <h2 className="text-sm font-semibold text-navy-900">Sent by you</h2>
        {outgoing.length === 0 ? (
          <p className="mt-2 text-sm text-navy-900/50">You have not sent any requests yet.</p>
        ) : (
          <ul className="mt-2 divide-y divide-navy-900/10">
            {outgoing.map((row) => (
              <ConnectionCard
                key={row.id}
                row={row}
                busyId={busyId}
                onCancel={(id) => void runAction(id, () => cancelConnection(id), 'Could not cancel this request.')}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
        <h2 className="text-sm font-semibold text-navy-900">Connected — ready to chat</h2>
        {accepted.length === 0 ? (
          <p className="mt-2 text-sm text-navy-900/50">No accepted connections yet.</p>
        ) : (
          <ul className="mt-2 divide-y divide-navy-900/10">
            {accepted.map((row) => (
              <ConnectionCard key={row.id} row={row} busyId={busyId} />
            ))}
          </ul>
        )}
      </section>

      {declined.length > 0 && (
        <section className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
          <h2 className="text-sm font-semibold text-navy-900">Declined</h2>
          <ul className="mt-2 divide-y divide-navy-900/10">
            {declined.map((row) => (
              <ConnectionCard key={row.id} row={row} busyId={busyId} />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
