import { useEffect, useState } from 'react'
import { AdminListControls } from '../../components/admin/AdminListControls'
import { AdminPage } from '../../components/admin/AdminPage'
import { ApiError } from '../../services/http'
import type { PageMeta } from '../../services/paging'
import { UsageLogTable } from '../../components/usage/UsageLogTable'
import type { UsageLogEntry } from '../../services/authService'
import { listStaffUsage } from '../../services/staffService'

export function AdminUsagePage() {
  const [rows, setRows] = useState<UsageLogEntry[]>([])
  const [page, setPage] = useState<PageMeta | null>(null)
  const [query, setQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function refresh(nextPage = 1) {
    setError(null)
    const data = await listStaffUsage({
      page: nextPage,
      q: query.trim() || undefined,
      from: dateFrom || undefined,
      to: dateTo || undefined,
    })
    setRows(data.usageLogs)
    setPage(data)
  }

  useEffect(() => {
    void refresh(1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load usage logs.'))
  }, [])

  return (
    <AdminPage title="Usage logs" subtitle="Who spent introductions, on whom, how many credits, and when." error={error}>
      <AdminListControls
        query={query}
        onQueryChange={setQuery}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onSubmit={() => void refresh(1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load usage logs.'))}
        page={page}
        onPageChange={(next) => void refresh(next).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load usage logs.'))}
        onRefresh={() => void refresh(page?.page || 1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load usage logs.'))}
      />
      <UsageLogTable rows={rows} showMember showPlan empty="No usage yet." />
    </AdminPage>
  )
}
