import { useState } from 'react'
import { getLinkedInAuthUrl } from '../../services/authService'

export function LinkedInButton({
  label = 'Continue with LinkedIn',
  className = '',
}: {
  label?: string
  className?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setError(null)
    setLoading(true)
    try {
      const redirectUri = `${window.location.origin}/auth/linkedin/callback`
      const data = await getLinkedInAuthUrl(redirectUri)
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Could not get LinkedIn login URL.')
      }
    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Could not initialize LinkedIn login.')
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`flex w-full items-center justify-center gap-3 rounded-full border border-navy-900/15 bg-white px-5 py-2.5 text-sm font-semibold text-navy-950 shadow-sm transition hover:bg-navy-900/5 hover:border-navy-900/25 active:scale-[0.99] disabled:opacity-60 ${className}`}
      >
        <svg className="h-4 w-4 shrink-0 fill-[#0A66C2]" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0-.02-3.28 1.64 1.64 0 0 0 .02 3.28m1.4 9.74v-8.37H5.06v8.37h2.8Z" />
        </svg>
        <span>{loading ? 'Connecting to LinkedIn…' : label}</span>
      </button>
      {error && <p className="mt-1.5 text-center text-xs text-red-600">{error}</p>}
    </div>
  )
}
