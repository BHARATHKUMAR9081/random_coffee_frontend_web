import { Button } from '../ui/Button'
import type { PageMeta } from '../../services/paging'
import { AdminRefreshButton } from './AdminRefreshButton'

export function AdminListControls({
  query,
  onQueryChange,
  status,
  onStatusChange,
  statusOptions,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onSubmit,
  page,
  onPageChange,
  onRefresh,
}: {
  query: string
  onQueryChange: (value: string) => void
  status?: string
  onStatusChange?: (value: string) => void
  statusOptions?: { value: string; label: string }[]
  dateFrom?: string
  dateTo?: string
  onDateFromChange?: (value: string) => void
  onDateToChange?: (value: string) => void
  onSubmit: () => void
  page?: PageMeta | null
  onPageChange?: (page: number) => void
  onRefresh?: () => void
}) {
  return (
    <div className="mb-4 flex flex-col gap-3">
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <label className="flex flex-col gap-1 text-xs text-navy-900/55">
          Search
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search"
            className="w-full min-h-11 rounded-lg border border-navy-900/15 px-3 py-1.5 text-base text-navy-950 focus:border-gold-500 focus:outline-none sm:w-52 sm:text-sm"
          />
        </label>
        {onStatusChange && statusOptions && (
          <label className="flex flex-col gap-1 text-xs text-navy-900/55">
            Status
            <select
              value={status || ''}
              onChange={(event) => onStatusChange(event.target.value)}
              className="rounded-lg border border-navy-900/15 px-3 py-1.5 text-sm text-navy-950 focus:border-gold-500 focus:outline-none"
            >
              <option value="">All</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}
        {onDateFromChange && (
          <label className="flex flex-col gap-1 text-xs text-navy-900/55">
            From
            <input
              type="date"
              value={dateFrom || ''}
              onChange={(event) => onDateFromChange(event.target.value)}
              className="rounded-lg border border-navy-900/15 px-3 py-1.5 text-sm text-navy-950 focus:border-gold-500 focus:outline-none"
            />
          </label>
        )}
        {onDateToChange && (
          <label className="flex flex-col gap-1 text-xs text-navy-900/55">
            To
            <input
              type="date"
              value={dateTo || ''}
              onChange={(event) => onDateToChange(event.target.value)}
              className="rounded-lg border border-navy-900/15 px-3 py-1.5 text-sm text-navy-950 focus:border-gold-500 focus:outline-none"
            />
          </label>
        )}
        <Button type="submit" size="sm">
          Apply
        </Button>
        {onRefresh && <AdminRefreshButton onClick={onRefresh} />}
      </form>
      {page && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-navy-900/60">
          <p>
            {page.total} total · page {page.page || 1}
            {page.totalPages ? ` of ${page.totalPages}` : ''}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={!page.hasPrev}
              onClick={() => onPageChange?.(page.page - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={!page.hasNext}
              onClick={() => onPageChange?.(page.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
