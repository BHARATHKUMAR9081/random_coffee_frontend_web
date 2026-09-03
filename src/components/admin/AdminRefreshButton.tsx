export function AdminRefreshButton({
  onClick,
  disabled,
  busy,
  label = 'Refresh',
}: {
  onClick: () => void
  disabled?: boolean
  busy?: boolean
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-navy-900/10 text-navy-900/60 hover:bg-navy-900/5 hover:text-navy-950 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg viewBox="0 0 20 20" fill="none" className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} aria-hidden>
        <path
          d="M16.5 10a6.5 6.5 0 1 1-1.9-4.6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M14.2 3.5v3.2h3.2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
