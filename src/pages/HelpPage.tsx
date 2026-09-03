import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { SelectField, TextAreaField, TextField } from '../components/ui/Field'
import { ScreenshotField } from '../components/support/ScreenshotField'
import { ApiError } from '../services/http'
import { createTicket, listTickets, type SupportTicket, type TicketCategory } from '../services/ticketService'
import type { UploadedImage } from '../services/screenshotService'

const categories: { id: TicketCategory; label: string }[] = [
  { id: 'bug', label: 'Bug' },
  { id: 'payment', label: 'Payment' },
  { id: 'account', label: 'Account' },
  { id: 'call', label: 'Call issue' },
  { id: 'other', label: 'Other' },
]

function statusLabel(status: string) {
  if (status === 'in_progress') return 'In progress'
  if (status === 'waiting_on_user') return 'Waiting on you'
  if (status === 'resolved') return 'Resolved'
  if (status === 'closed') return 'Closed'
  return 'Open'
}

export function HelpPage() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [category, setCategory] = useState<TicketCategory>('bug')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [image, setImage] = useState<UploadedImage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function refresh() {
    if (user.id === 'demo') {
      setTickets([])
      return
    }
    const data = await listTickets()
    setTickets(data.tickets)
  }

  useEffect(() => {
    void refresh().catch((err) => {
      setError(err instanceof ApiError ? err.message : 'Could not load tickets.')
    })
  }, [user.id])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (user.id === 'demo') {
      setError('Demo mode does not create real tickets. Sign in with an account.')
      return
    }
    if (!subject.trim() || !body.trim()) {
      setError('Subject and details are required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await createTicket({
        category,
        subject: subject.trim(),
        body: body.trim(),
        imageUrl: image?.imageUrl,
        imagePath: image?.imagePath,
      })
      setSubject('')
      setBody('')
      setImage(null)
      await refresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create the ticket.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-950">Support tickets</h1>
        <p className="mt-1 text-sm text-navy-900/55">
          File a ticket and follow replies here. Safety reports of another person stay in Report, not here.
        </p>
      </div>

      {user.id === 'demo' && (
        <p className="rounded-2xl border border-navy-900/10 bg-white px-4 py-3 text-sm text-navy-900/70">
          Demo mode does not file real tickets.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <section className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
        <h2 className="text-sm font-semibold text-navy-900">New ticket</h2>
        <form onSubmit={(event) => void handleSubmit(event)} className="mt-4 flex flex-col gap-3">
          <SelectField id="category" label="Category" required value={category} onChange={(e) => setCategory(e.target.value as TicketCategory)}>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </SelectField>
          <TextField id="subject" label="Subject" required maxLength={160} value={subject} onChange={(e) => setSubject(e.target.value)} />
          <TextAreaField
            id="body"
            label="Details"
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What happened?"
          />
          <ScreenshotField folder="tickets" accountId={user.id} disabled={saving || user.id === 'demo'} onUploaded={setImage} />
          <Button type="submit" className="w-full sm:w-auto" disabled={saving || user.id === 'demo'}>
            {saving ? 'Sending…' : 'Submit ticket'}
          </Button>
        </form>
      </section>

      <section className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
        <h2 className="text-sm font-semibold text-navy-900">My tickets</h2>
        {tickets.length === 0 ? (
          <p className="mt-2 text-sm text-navy-900/50">No tickets yet.</p>
        ) : (
          <ul className="mt-2 divide-y divide-navy-900/10">
            {tickets.map((row) => (
              <li key={row.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{row.subject}</p>
                  <p className="text-xs text-navy-900/50">{statusLabel(row.status)}</p>
                </div>
                <Link to={`/help/${row.id}`} className="sm:shrink-0">
                  <Button className="w-full sm:w-auto" variant="secondary">Open</Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
