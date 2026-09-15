import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthSplitLayout } from '../components/layout/AuthSplitLayout'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export function LinkedInCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { loginWithLinkedIn } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    const code = searchParams.get('code')
    const oauthError = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (oauthError) {
      setIsProcessing(false)
      setError(errorDescription || 'LinkedIn authorization was canceled or failed.')
      return
    }

    if (!code) {
      setIsProcessing(false)
      setError('No authorization code was received from LinkedIn.')
      return
    }

    const redirectUri = `${window.location.origin}/auth/linkedin/callback`

    async function handleLogin() {
      try {
        const result = await loginWithLinkedIn(code!, redirectUri)
        if (result.success) {
          navigate('/dashboard', { replace: true })
        } else {
          setIsProcessing(false)
          setError(result.error || 'Could not complete LinkedIn sign in.')
        }
      } catch (err) {
        setIsProcessing(false)
        setError(err instanceof Error ? err.message : 'Unexpected error during LinkedIn sign in.')
      }
    }

    void handleLogin()
  }, [searchParams, loginWithLinkedIn, navigate])

  return (
    <AuthSplitLayout>
      <div className="mx-auto w-full max-w-sm text-center">
        {isProcessing && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-navy-950/15 border-t-gold-500" />
            <h1 className="text-xl font-semibold text-navy-950">Authenticating with LinkedIn…</h1>
            <p className="text-sm text-navy-900/60">Please wait while we verify your account.</p>
          </div>
        )}

        {!isProcessing && error && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-navy-950">Sign In Failed</h1>
            <p className="text-sm text-red-600">{error}</p>
            <div className="mt-4 flex w-full flex-col gap-2">
              <Link to="/login" className="w-full">
                <Button className="w-full">Back to Sign In</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AuthSplitLayout>
  )
}
