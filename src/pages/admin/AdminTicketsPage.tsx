import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminListControls } from '../../components/admin/AdminListControls'
import { AdminPage } from '../../components/admin/AdminPage'
import { Button } from '../../components/ui/Button'
import { ApiError } from '../../services/http'
import type { PageMeta } from '../../services/paging'
import { listStaffTickets, type StaffTicket } from '../../services/staffService'
import { statusLabel } from './adminFormat'

function isResolved(status: string) {
  return status === 'resolved' || status === 'closed'
}

export function AdminTicketsPage() {
  const [tickets, setTickets] = useState<StaffTicket[]>([])
  const [page, setPage] = useState<PageMeta | null>(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function refresh(nextPage = 1) {
    const data = await listStaffTickets({
      page: nextPage,
      q: query.trim() || undefined,
      status: status || undefined,
      from: dateFrom || undefined,
      to: dateTo || undefined,
    })
    setTickets(data.tickets)
    setPage(data)
  }

  useEffect(() => {
    void refresh(1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load tickets.'))
  }, [])

  return (
    <AdminPage title="Support tickets" subtitle="User help requests and staff replies." error={error}>
      <AdminListControls
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
        statusOptions={[
          { value: 'open', label: 'Open' },
          { value: 'in_progress', label: 'In progress' },
          { value: 'waiting_on_user', label: 'Waiting on user' },
          { value: 'resolved', label: 'Resolved' },
          { value: 'closed', label: 'Closed' },
        ]}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onSubmit={() => void refresh(1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load tickets.'))}
        page={page}
        onPageChange={(next) => void refresh(next).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load tickets.'))}
        onRefresh={() => void refresh(page?.page || 1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load tickets.'))}
      />
      <ul className="divide-y divide-navy-900/10">
        {tickets.length === 0 && <p className="text-sm text-navy-900/50">No tickets yet.</p>}
        {tickets.map((row) => (
          <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div>
              <p className="font-medium">{row.subject}</p>
              <p className="text-xs text-navy-900/50">
                {row.requesterName} · {isResolved(row.status) ? `Resolved by ${row.resolvedBy || 'staff'}` : statusLabel(row.status)} · {row.category}
              </p>
            </div>
            <Link to={`/admin/tickets/${row.id}`}>
              <Button size="sm" variant="secondary">
                Open
              </Button>
            </Link>
          </li>
        ))}
      </ul>
    </AdminPage>
  )
}
