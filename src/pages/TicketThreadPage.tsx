import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { ApiError } from '../services/http'
import { resolveMediaUrl } from '../services/profileService'
import { addTicketComment, fetchTicket, type SupportTicket, type TicketComment } from '../services/ticketService'

function statusLabel(status: string) {
  if (status === 'in_progress') return 'In progress'
  if (status === 'waiting_on_user') return 'Waiting on you'
  if (status === 'resolved') return 'Resolved'
  if (status === 'closed') return 'Closed'
  return 'Open'
}

function formatTime(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
}

export function TicketThreadPage() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState<SupportTicket | null>(null)
  const [comments, setComments] = useState<TicketComment[]>([])
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!ticketId) {
      navigate('/help', { replace: true })
      return
    }
    const id = ticketId

    let cancelled = false

    async function load() {
      try {
        const row = await fetchTicket(id)
        if (cancelled) return
        setTicket(row)
        setComments(row.comments ?? [])
        setError(null)
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Could not load this ticket.')
      }
    }

    void load()
    const timer = window.setInterval(() => void load(), 5000)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [navigate, ticketId])

  async function handleSend(event: React.FormEvent) {
    event.preventDefault()
    if (!ticketId || ticket?.status === 'closed') return
    const body = draft.trim()
    if (!body) return
    setSending(true)
    setError(null)
    try {
      const comment = await addTicketComment(ticketId, body)
      setComments((prev) => (prev.some((row) => row.id === comment.id) ? prev : [...prev, comment]))
      setDraft('')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send that reply.')
    } finally {
      setSending(false)
    }
  }

  const closed = ticket?.status === 'closed'

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div>
        <Link to="/help" className="text-xs text-navy-900/50 hover:text-navy-950">
          Back to help
        </Link>
            <h1 className="mt-1 break-words text-xl font-semibold text-navy-950 sm:text-2xl">{ticket?.subject || 'Ticket'}</h1>
        <p className="text-sm text-navy-900/55">{ticket ? statusLabel(ticket.status) : 'Loading…'}</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <section className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
        {ticket && (
          <div className="border-b border-navy-900/10 pb-4">
            <p className="whitespace-pre-wrap text-sm">{ticket.body}</p>
            {ticket.imageUrl && (
              <a href={resolveMediaUrl(ticket.imageUrl) ?? ticket.imageUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-medium text-gold-600 hover:underline">
                View screenshot
              </a>
            )}
            <p className="mt-2 text-[10px] text-navy-900/45">{formatTime(ticket.createdAt)}</p>
          </div>
        )}

        <div className="mt-4 space-y-3">
          {comments.length === 0 ? (
            <p className="text-sm text-navy-900/50">No replies yet. An admin can answer here.</p>
          ) : (
            comments.map((row) => (
              <div key={row.id} className={`flex ${row.mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${row.mine ? 'bg-gold-500 text-navy-950' : 'bg-navy-900/10'}`}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
                    {row.authorType === 'admin' ? 'RandomCoffee' : 'You'}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap break-words">{row.body}</p>
                  <p className="mt-1 text-[10px] opacity-60">{formatTime(row.createdAt)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={(event) => void handleSend(event)} className="mt-4 border-t border-navy-900/10 pt-3">
          <div className="flex gap-2">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value.slice(0, 2000))}
              disabled={sending || closed || !ticket}
              rows={2}
              placeholder={closed ? 'This ticket is closed' : 'Write a reply'}
              className="min-h-12 w-full resize-none rounded-xl border border-navy-900/15 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30 disabled:bg-navy-900/5"
            />
            <Button type="submit" disabled={sending || closed || !draft.trim()}>
              {sending ? 'Sending…' : 'Reply'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}
