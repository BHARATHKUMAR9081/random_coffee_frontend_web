import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthSplitLayout } from '../../components/layout/AuthSplitLayout'
import { Button } from '../../components/ui/Button'
import { PasswordField, TextField } from '../../components/ui/Field'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { ApiError } from '../../services/http'

const adminHighlights = [
  {
    quote: 'Review users, tickets, and reports from one staff desk.',
    name: 'Operations',
    role: 'Staff console',
  },
  {
    quote: 'Act on reports before they become a trust problem.',
    name: 'Trust & safety',
    role: 'Moderation',
  },
  {
    quote: 'This sign-in is separate from member accounts.',
    name: 'Access',
    role: 'Internal only',
  },
]

export function AdminLoginPage() {
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not sign in.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AuthSplitLayout
      imageSrc="/auth-admin.jpg"
      imageAlt="Staff reviewing operations in a modern office"
      eyebrow="Internal staff"
      headline="Keep RandomCoffee safe for real business conversations."
      testimonials={adminHighlights}
    >
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-navy-950">Super admin</h1>
        <p className="mt-1 text-sm text-navy-900/55">Internal staff sign-in. This is separate from the consumer app.</p>

        <form onSubmit={(event) => void handleSubmit(event)} className="mt-8 flex flex-col gap-4">
          <TextField
            id="adminEmail"
            label="Email address"
            type="email"
            placeholder="admin@randomcoffee.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordField
            id="adminPassword"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </AuthSplitLayout>
  )
}
