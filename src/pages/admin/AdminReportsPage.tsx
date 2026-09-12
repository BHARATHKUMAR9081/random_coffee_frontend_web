import { useEffect, useState } from 'react'
import { AdminListControls } from '../../components/admin/AdminListControls'
import { AdminPage } from '../../components/admin/AdminPage'
import { Button } from '../../components/ui/Button'
import { ApiError } from '../../services/http'
import type { PageMeta } from '../../services/paging'
import { listStaffReports, updateStaffReport, type StaffReport } from '../../services/staffService'
import { formatAdminTime, statusLabel } from './adminFormat'

export function AdminReportsPage() {
  const [reports, setReports] = useState<StaffReport[]>([])
  const [page, setPage] = useState<PageMeta | null>(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function refresh(nextPage = 1) {
    setError(null)
    const data = await listStaffReports({
      page: nextPage,
      q: query.trim() || undefined,
      status: status || undefined,
      from: dateFrom || undefined,
      to: dateTo || undefined,
    })
    setReports(data.reports)
    setPage(data)
  }

  useEffect(() => {
    void refresh(1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load reports.'))
  }, [])

  return (
    <AdminPage title="Reports" subtitle="User reports from calls and chat." error={error}>
      <AdminListControls
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
        statusOptions={[
          { value: 'open', label: 'Open' },
          { value: 'reviewing', label: 'Reviewing' },
          { value: 'resolved', label: 'Resolved' },
          { value: 'dismissed', label: 'Dismissed' },
        ]}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onSubmit={() => void refresh(1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load reports.'))}
        page={page}
        onPageChange={(next) => void refresh(next).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load reports.'))}
        onRefresh={() => void refresh(page?.page || 1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load reports.'))}
      />
      <ul className="divide-y divide-navy-900/10">
        {reports.length === 0 && <p className="text-sm text-navy-900/50">No reports.</p>}
        {reports.map((row) => (
          <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div>
              <p className="text-sm">
                <span className="font-medium">{row.reporterName}</span> reported{' '}
                <span className="font-medium">{row.reportedName}</span>
              </p>
              <p className="text-xs text-navy-900/50">
                {row.reason} · {statusLabel(row.status)} · {formatAdminTime(row.createdAt)}
              </p>
            </div>
            {row.status === 'open' && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  void updateStaffReport(row.id, { status: 'resolved' })
                    .then(() => refresh(page?.page || 1))
                    .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not update report.'))
                }
              >
                Mark resolved
              </Button>
            )}
          </li>
        ))}
      </ul>
    </AdminPage>
  )
}
