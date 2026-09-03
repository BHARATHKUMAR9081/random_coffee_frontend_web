import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminPage } from '../../components/admin/AdminPage'
import { AdminRefreshButton } from '../../components/admin/AdminRefreshButton'
import { AdminTrendChart } from '../../components/admin/AdminTrendChart'
import { UsageLogTable } from '../../components/usage/UsageLogTable'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { ApiError } from '../../services/http'
import type { UsageLogEntry } from '../../services/authService'
import { fetchStaffOverview, listStaffUsage, type StaffOverview, type StaffPlanStat } from '../../services/staffService'

function rupees(value: number) {
  return `₹${value.toLocaleString('en-IN')}`
}

function StatCard({
  label,
  value,
  href,
  hint,
}: {
  label: string
  value: string | number
  href?: string
  hint?: string
}) {
  const body = (
    <>
      <p className="text-xs text-navy-900/50">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-navy-900/40">{hint}</p>}
    </>
  )
  const className = 'rounded-xl border border-navy-900/10 p-4 transition-colors hover:border-gold-500/40'
  if (!href) {
    return <div className={className}>{body}</div>
  }
  return (
    <Link to={href} className={className}>
      {body}
    </Link>
  )
}

export function AdminOverviewPage() {
  const { admin } = useAdminAuth()
  const isSuper = admin?.role === 'super_admin'
  const [overview, setOverview] = useState<StaffOverview | null>(null)
  const [usageLogs, setUsageLogs] = useState<UsageLogEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    setError(null)
    const [data, usage] = await Promise.all([
      fetchStaffOverview(),
      isSuper ? listStaffUsage({ page: 1 }).catch(() => null) : Promise.resolve(null),
    ])
    setOverview(data)
    if (usage) setUsageLogs(usage.usageLogs)
  }

  useEffect(() => {
    void refresh().catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load the dashboard.'))
  }, [])

  const cards = overview
    ? [
        { label: 'Users', value: overview.users, href: '/admin/users' },
        { label: 'Active accounts', value: overview.activeUsers, href: '/admin/users', hint: 'Not blocked' },
        { label: 'Signed in now', value: overview.loggedInUsers },
        { label: 'Available to match', value: overview.availableUsers },
        { label: 'Verified users', value: overview.verifiedUsers },
        { label: 'Active sessions', value: overview.activeSessions, href: '/admin/sessions', hint: 'Matching or in call' },
        { label: 'Total sessions', value: overview.totalSessions, href: '/admin/sessions' },
        { label: 'Est. monthly revenue', value: rupees(overview.monthlyRevenue), hint: 'From current paid plans' },
        { label: 'Paid subscribers', value: overview.paidUsers },
        { label: 'Open tickets', value: overview.openTickets, href: '/admin/tickets' },
        { label: 'Open reports', value: overview.openReports, href: '/admin/reports' },
      ]
    : []

  return (
    <AdminPage
      title="Dashboard"
      subtitle="Members, sessions, plans, revenue, and support at a glance."
      error={error}
      onRefresh={() => void refresh().catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load the dashboard.'))}
    >
      {overview ? (
        <div className="flex flex-col gap-8">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <AdminTrendChart
              title="Users onboarded"
              subtitle="New accounts each month"
              kind="bar"
              tone="navy"
              emptyMax={4}
              points={(overview.series ?? []).map((point) => ({ label: point.label, value: point.users }))}
              formatValue={(value) => value.toLocaleString('en-IN')}
            />
            <AdminTrendChart
              title="Estimated revenue"
              subtitle="Monthly revenue from current paid plans"
              kind="area"
              tone="gold"
              emptyMax={100}
              points={(overview.series ?? []).map((point) => ({ label: point.label, value: point.revenue }))}
              formatValue={rupees}
            />
          </div>

          <div>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-900/50">Users by plan</h2>
                <p className="mt-1 text-xs text-navy-900/45">
                  Monthly revenue is estimated from list prices. Live billing is not connected yet.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-navy-950">{rupees(overview.monthlyRevenue)} / month</p>
                <AdminRefreshButton
                  onClick={() =>
                    void refresh().catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load the dashboard.'))
                  }
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-navy-900/10 text-xs uppercase tracking-wide text-navy-900/50">
                    <th className="py-2 pr-4">Plan</th>
                    <th className="py-2 pr-4">Price</th>
                    <th className="py-2 pr-4">Users</th>
                    <th className="py-2 pr-4">Est. monthly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-900/10">
                  {overview.plans.map((plan: StaffPlanStat) => (
                    <tr key={plan.id}>
                      <td className="py-2.5 pr-4 font-medium">{plan.name}</td>
                      <td className="py-2.5 pr-4 text-navy-900/70">{plan.price === 0 ? 'Free' : `${rupees(plan.price)} / mo`}</td>
                      <td className="py-2.5 pr-4 text-navy-900/70">{plan.users.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 pr-4 text-navy-900/70">{rupees(plan.monthlyRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {isSuper && (
            <div>
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-900/50">Credit usage</h2>
                  <p className="mt-1 text-xs text-navy-900/45">Recent introductions: who spent credits, on whom, and when.</p>
                </div>
                <Link to="/admin/usage" className="text-xs font-semibold text-gold-600 hover:underline">
                  View all logs
                </Link>
              </div>
              <UsageLogTable rows={usageLogs} showMember empty="No credit usage yet." />
            </div>
          )}
        </div>
      ) : (
        !error && <p className="text-sm text-navy-900/50">Loading…</p>
      )}
    </AdminPage>
  )
}
