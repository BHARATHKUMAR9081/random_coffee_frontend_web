import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthSplitLayout } from '../components/layout/AuthSplitLayout'
import { Button } from '../components/ui/Button'
import { PasswordField, TextField } from '../components/ui/Field'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Enter your email and password.')
      return
    }
    setError(null)
    setIsSubmitting(true)
    const result = await login(email, password)
    if (!result.success) {
      setError(result.error ?? 'Could not sign in.')
      setIsSubmitting(false)
      return
    }
    navigate('/dashboard')
  }

  return (
    <AuthSplitLayout>
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-navy-950">Welcome back</h1>
        <p className="mt-1 text-sm text-navy-900/55">Sign in to continue to your dashboard.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <TextField
            id="email"
            label="Email address"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordField
            id="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
          <p className="text-center text-xs text-navy-900/60">
            New to RandomCoffee?{' '}
            <Link to="/register" className="font-medium text-gold-500 hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </AuthSplitLayout>
  )
}
