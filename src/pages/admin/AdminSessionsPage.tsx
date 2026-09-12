import { useEffect, useState } from 'react'
import { AdminListControls } from '../../components/admin/AdminListControls'
import { AdminPage } from '../../components/admin/AdminPage'
import { ApiError } from '../../services/http'
import type { PageMeta } from '../../services/paging'
import { listStaffSessions, type StaffSession } from '../../services/staffService'
import { formatAdminTime, statusLabel } from './adminFormat'

export function AdminSessionsPage() {
  const [sessions, setSessions] = useState<StaffSession[]>([])
  const [page, setPage] = useState<PageMeta | null>(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function refresh(nextPage = 1) {
    const data = await listStaffSessions({
      page: nextPage,
      q: query.trim() || undefined,
      status: status || undefined,
      from: dateFrom || undefined,
      to: dateTo || undefined,
    })
    setSessions(data.sessions)
    setPage(data)
  }

  useEffect(() => {
    void refresh(1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load sessions.'))
  }, [])

  return (
    <AdminPage title="Sessions" subtitle="Match and call history." error={error}>
      <AdminListControls
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
        statusOptions={[
          { value: 'created', label: 'Created' },
          { value: 'in_call', label: 'In call' },
          { value: 'ended', label: 'Ended' },
        ]}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onSubmit={() => void refresh(1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load sessions.'))}
        page={page}
        onPageChange={(next) => void refresh(next).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load sessions.'))}
        onRefresh={() => void refresh(page?.page || 1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load sessions.'))}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy-900/10 text-xs uppercase tracking-wide text-navy-900/50">
              <th className="py-2 pr-4">Participants</th>
              <th className="py-2 pr-4">When</th>
              <th className="py-2 pr-4">Duration</th>
              <th className="py-2 pr-4">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-900/10">
            {sessions.length === 0 && (
              <tr>
                <td className="py-6 text-navy-900/50" colSpan={4}>
                  No sessions yet.
                </td>
              </tr>
            )}
            {sessions.map((row) => (
              <tr key={row.id}>
                <td className="py-2.5 pr-4 font-medium">
                  {row.userAName} ↔ {row.userBName}
                </td>
                <td className="py-2.5 pr-4 text-navy-900/70">{formatAdminTime(row.timestamp)}</td>
                <td className="py-2.5 pr-4 text-navy-900/70">{row.durationSeconds}s</td>
                <td className="py-2.5 pr-4 capitalize">{statusLabel(row.outcome)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPage>
  )
}
