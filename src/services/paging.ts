export interface PageMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export type ListQuery = {
  page?: number
  q?: string
  status?: string
  from?: string
  to?: string
  category?: string
  reason?: string
  outcome?: string
  role?: string
  planId?: string
  verification?: string
  isActive?: boolean | string
  action?: string
}

export function toQuery(query?: ListQuery) {
  const params = new URLSearchParams()
  if (!query) return ''
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === '') continue
    params.set(key, String(value))
  }
  const suffix = params.toString()
  return suffix ? `?${suffix}` : ''
}
