import type { ReactNode } from 'react'
import { AdminRefreshButton } from './AdminRefreshButton'

export function AdminPage({
  title,
  subtitle,
  error,
  success,
  onRefresh,
  actions,
  children,
}: {
  title: string
  subtitle?: string
  error?: string | null
  success?: string | null
  onRefresh?: () => void
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy-950">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-navy-900/55">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          {onRefresh && <AdminRefreshButton onClick={onRefresh} />}
        </div>
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-4 text-sm text-green-700">{success}</p>}
      <div className="mt-6 rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
        {children}
      </div>
    </div>
  )
}
