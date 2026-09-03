import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AdminListControls } from '../../components/admin/AdminListControls'
import { AdminPage } from '../../components/admin/AdminPage'
import { Button } from '../../components/ui/Button'
import { Avatar } from '../../components/ui/Avatar'
import { ApiError } from '../../services/http'
import type { PageMeta } from '../../services/paging'
import { listStaffUsers, setStaffUserActive, type StaffUserRow } from '../../services/staffService'
import { PLANS } from '../../types'
import { formatAdminTime } from './adminFormat'

function planName(planId?: string) {
  return PLANS.find((plan) => plan.id === planId)?.name || planId || 'Free'
}

function loginLabel(row: StaffUserRow) {
  if (row.isLogin) return 'Logged in now'
  return formatAdminTime(row.lastLogin)
}

export function AdminUsersPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<StaffUserRow[]>([])
  const [page, setPage] = useState<PageMeta | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function refresh(nextPage = pageNumber) {
    setError(null)
    const data = await listStaffUsers({
      page: nextPage,
      q: query.trim() || undefined,
      status: status || undefined,
      from: dateFrom || undefined,
      to: dateTo || undefined,
    })
    setUsers(data.users)
    setPage(data)
    setPageNumber(data.page)
  }

  useEffect(() => {
    void refresh(1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load users.'))
  }, [])

  return (
    <AdminPage title="Users" subtitle="All member accounts." error={error}>
      <AdminListControls
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
        statusOptions={[
          { value: 'active', label: 'Active' },
          { value: 'disabled', label: 'Disabled' },
        ]}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onSubmit={() => void refresh(1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load users.'))}
        page={page}
        onPageChange={(next) => void refresh(next).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load users.'))}
        onRefresh={() => void refresh(page?.page || 1).catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load users.'))}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy-900/10 text-xs uppercase tracking-wide text-navy-900/50">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Company</th>
              <th className="py-2 pr-4">Plan</th>
              <th className="py-2 pr-4">Last login</th>
              <th className="py-2 pr-4">Verification</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-900/10">
            {users.length === 0 && (
              <tr>
                <td className="py-6 text-navy-900/50" colSpan={7}>
                  No users yet.
                </td>
              </tr>
            )}
            {users.map((row) => (
              <tr
                key={row.id}
                className="cursor-pointer hover:bg-navy-950/[0.03]"
                onClick={() => navigate(`/admin/users/${row.id}`)}
              >
                <td className="py-2.5 pr-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={row.profilePhotoUrl} name={row.fullName} size="sm" />
                    <div>
                      <Link
                        to={`/admin/users/${row.id}`}
                        className="font-medium hover:text-gold-600"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {row.fullName}
                      </Link>
                      <p className="text-xs text-navy-900/50">{row.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 pr-4 text-navy-900/70">{row.companyName || '—'}</td>
                <td className="py-2.5 pr-4 text-navy-900/70">{planName(row.planId)}</td>
                <td className="py-2.5 pr-4">
                  {row.isLogin ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                      Logged in now
                    </span>
                  ) : (
                    <span className="text-navy-900/70">{loginLabel(row)}</span>
                  )}
                </td>
                <td className="py-2.5 pr-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      row.verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {row.verificationStatus === 'VERIFIED' ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="py-2.5 pr-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      row.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {row.isActive ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td className="py-2.5 pr-4">
                  <Button
                    size="sm"
                    variant={row.isActive ? 'danger' : 'secondary'}
                    onClick={(event) => {
                      event.stopPropagation()
                      void setStaffUserActive(row.id, !row.isActive)
                        .then(() => refresh())
                        .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not update user.'))
                    }}
                  >
                    {row.isActive ? 'Disable' : 'Enable'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPage>
  )
}
