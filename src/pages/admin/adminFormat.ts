export function formatAdminTime(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export function statusLabel(status: string) {
  return status.replaceAll('_', ' ')
}
