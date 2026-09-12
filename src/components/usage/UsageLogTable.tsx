import type { UsageLogEntry } from '../../services/authService'

export function usageActionLabel(action: string) {
  if (action === 'connection.initiated') return 'Requested a connection'
  if (action === 'connection.accepted') return 'Accepted a connection'
  return action
}

export function formatUsageTime(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export function UsageLogTable({
  rows,
  empty = 'No credit usage yet.',
  showMember = false,
  showPlan = false,
}: {
  rows: UsageLogEntry[]
  empty?: string
  showMember?: boolean
  showPlan?: boolean
}) {
  const columns = 5 + (showMember ? 1 : 0) + (showPlan ? 1 : 0)
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-navy-900/10 text-xs uppercase tracking-wide text-navy-900/50">
            <th className="py-2 pr-3">When</th>
            {showMember && <th className="py-2 pr-3">Member</th>}
            <th className="py-2 pr-3">Action</th>
            <th className="py-2 pr-3">To / from</th>
            <th className="py-2 pr-3">Credits</th>
            <th className={showPlan ? 'py-2 pr-3' : 'py-2'}>Balance after</th>
            {showPlan && <th className="py-2">Plan</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-900/10">
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns} className="py-4 text-navy-900/50">
                {empty}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="py-2.5 pr-3 whitespace-nowrap text-navy-900/60">{formatUsageTime(row.createdAt)}</td>
              {showMember && <td className="py-2.5 pr-3 font-medium">{row.accountName || '—'}</td>}
              <td className="py-2.5 pr-3">{usageActionLabel(row.action)}</td>
              <td className="py-2.5 pr-3">{row.otherName || '—'}</td>
              <td className="py-2.5 pr-3">−{row.creditsUsed}</td>
              <td className={showPlan ? 'py-2.5 pr-3' : 'py-2.5'}>{row.creditsAfter}</td>
              {showPlan && <td className="py-2.5 capitalize">{row.planSlug || '—'}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
