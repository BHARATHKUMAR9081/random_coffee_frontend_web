import { useEffect, useState } from 'react'
import { AdminListControls } from '../../components/admin/AdminListControls'
import { AdminPage } from '../../components/admin/AdminPage'
import { ApiError } from '../../services/http'
import type { PageMeta } from '../../services/paging'
import { listStaffAudit, type StaffAudit } from '../../services/staffService'
import { formatAdminTime } from './adminFormat'

export function AdminAuditPage() {
  const [audit, setAudit] = useState<StaffAudit[]>([])
  const [page, setPage] = useState<PageMeta | null>(null)
  const [query, setQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function refresh(nextPage = 1) {
    const data = await listStaffAudit({
      page: nextPage,
      q: query.trim() || undefined,
      from: dateFrom || undefined,
      to: dateTo || undefined,
    })
    setAudit(data.auditLog)
    setPage(data)
  }

  useEffect(() => {
    void refresh(1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load the audit log.'))
  }, [])

  return (
    <AdminPage title="Audit log" subtitle="Staff actions on users, tickets, and reports." error={error}>
      <AdminListControls
        query={query}
        onQueryChange={setQuery}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onSubmit={() => void refresh(1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load the audit log.'))}
        page={page}
        onPageChange={(next) => void refresh(next).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load the audit log.'))}
        onRefresh={() => void refresh(page?.page || 1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load the audit log.'))}
      />
      <div className="flex flex-col divide-y divide-navy-900/10">
        {audit.length === 0 && <p className="text-sm text-navy-900/50">No admin actions yet.</p>}
        {audit.map((row) => (
          <div key={row.id} className="py-3 text-sm">
            <p>
              <span className="font-medium">{row.actor}</span> — {row.action} — {row.target}
            </p>
            <p className="text-xs text-navy-900/50">{formatAdminTime(row.timestamp)}</p>
          </div>
        ))}
      </div>
    </AdminPage>
  )
}
