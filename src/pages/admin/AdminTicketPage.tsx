import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AdminRefreshButton } from '../../components/admin/AdminRefreshButton'
import { Button } from '../../components/ui/Button'
import { ApiError } from '../../services/http'
import { resolveMediaUrl } from '../../services/profileService'
import { addStaffTicketComment, fetchStaffTicket, updateStaffTicket, type StaffTicket } from '../../services/staffService'
import { formatAdminTime, statusLabel } from './adminFormat'

function isResolved(status: string) {
  return status === 'resolved' || status === 'closed'
}

export function AdminTicketPage() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState<StaffTicket | null>(null)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [updating, setUpdating] = useState(false)

  async function refresh() {
    if (!ticketId) return
    const row = await fetchStaffTicket(ticketId)
    setTicket(row)
  }

  useEffect(() => {
    if (!ticketId) {
      navigate('/admin/tickets', { replace: true })
      return
    }
    void refresh().catch((err) => {
      setError(err instanceof ApiError ? err.message : 'Could not load this ticket.')
    })
  }, [ticketId, navigate])

  async function handleSend(event: React.FormEvent) {
    event.preventDefault()
    if (!ticketId || !draft.trim()) return
    setSending(true)
    setError(null)
    try {
      await addStaffTicketComment(ticketId, draft.trim())
      setDraft('')
      await refresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send that reply.')
    } finally {
      setSending(false)
    }
  }

  async function setResolved(resolved: boolean) {
    if (!ticket) return
    setUpdating(true)
    setError(null)
    try {
      const row = await updateStaffTicket(ticket.id, { status: resolved ? 'resolved' : 'open' })
      setTicket(row)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update this ticket.')
    } finally {
      setUpdating(false)
    }
  }

  const resolved = ticket ? isResolved(ticket.status) : false

  return (
    <div>
      <Link to="/admin/tickets" className="text-sm font-medium text-navy-900/55 hover:text-navy-950">
        ← Support tickets
      </Link>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy-950">{ticket?.subject || 'Ticket'}</h1>
          <p className="text-sm text-navy-900/55">
            {ticket ? `${ticket.requesterName} · ${ticket.requesterEmail}` : 'Loading…'}
          </p>
        </div>
        <AdminRefreshButton
          onClick={() =>
            void refresh().catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load this ticket.'))
          }
        />
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {ticket && (
        <section className="mt-6 rounded-2xl border border-navy-900/8 bg-white p-6 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)]">
          <p className="whitespace-pre-wrap text-sm">{ticket.body}</p>
          {ticket.imageUrl && (
            <a href={resolveMediaUrl(ticket.imageUrl) ?? ticket.imageUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-medium text-gold-600 hover:underline">
              View screenshot
            </a>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-navy-900/10 bg-navy-950/[0.03] px-4 py-3">
            {resolved ? (
              <div>
                <p className="text-sm font-semibold text-navy-950">Resolved</p>
                <p className="mt-0.5 text-xs text-navy-900/55">
                  Resolved by {ticket.resolvedBy || 'staff'}
                  {ticket.resolvedAt ? ` · ${formatAdminTime(ticket.resolvedAt)}` : ''}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-navy-950">Open</p>
                <p className="mt-0.5 text-xs text-navy-900/55">{statusLabel(ticket.status)}</p>
              </div>
            )}
            {resolved ? (
              <Button size="sm" variant="secondary" disabled={updating} onClick={() => void setResolved(false)}>
                {updating ? 'Updating…' : 'Reopen'}
              </Button>
            ) : (
              <Button size="sm" disabled={updating} onClick={() => void setResolved(true)}>
                {updating ? 'Updating…' : 'Mark as resolved'}
              </Button>
            )}
          </div>

          <div className="mt-5 space-y-3">
            {(ticket.comments ?? []).length === 0 ? (
              <p className="text-sm text-navy-900/50">No replies yet.</p>
            ) : (
              (ticket.comments ?? []).map((row) => (
                <div key={row.id} className={`flex ${row.authorType === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${row.authorType === 'admin' ? 'bg-gold-500 text-navy-950' : 'bg-navy-900/10'}`}>
                    <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
                      {row.authorType === 'admin' ? 'Staff' : ticket.requesterName}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap break-words">{row.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={(event) => void handleSend(event)} className="mt-4 border-t border-navy-900/10 pt-3">
            <textarea
              className="min-h-20 w-full rounded-xl border border-navy-900/15 px-3 py-2 text-sm"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Reply to the user"
              disabled={resolved}
            />
            <Button type="submit" className="mt-3" disabled={sending || resolved}>
              {sending ? 'Sending…' : 'Send reply'}
            </Button>
          </form>
        </section>
      )}
    </div>
  )
}
