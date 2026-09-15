import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthSplitLayout } from '../components/layout/AuthSplitLayout'
import { Button } from '../components/ui/Button'
import { LinkedInButton } from '../components/ui/LinkedInButton'
import { TextField, PasswordField } from '../components/ui/Field'
import { useAuth } from '../context/AuthContext'
import { isValidEmail } from '../lib/validation'

const legalLinkClass = 'font-medium text-gold-600 hover:underline'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedPolicies, setAcceptedPolicies] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError('Fill out all fields.')
      return
    }
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!acceptedPolicies) {
      setError('You must accept the Terms of Service, Community Guidelines, Privacy Policy, and Refund Policy to create an account.')
      return
    }

    setError(null)
    setIsSubmitting(true)
    const result = await register(email, password, {
      firstName,
      lastName,
      termsAccepted: acceptedPolicies,
      privacyPolicyAccepted: acceptedPolicies,
      refundPolicyAccepted: acceptedPolicies,
    })
    if (!result.success) {
      setError(result.error ?? 'Could not create your account.')
      setIsSubmitting(false)
      return
    }
    navigate('/dashboard')
  }

  return (
    <AuthSplitLayout>
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-semibold text-navy-950">Create your account</h1>
        <p className="mt-1 text-sm text-navy-900/55">Then complete your profile from the dashboard to get verified.</p>

        <div className="mt-8 flex flex-col gap-5">
          <LinkedInButton label="Sign up with LinkedIn" />

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-navy-900/10" />
            <span className="bg-white px-3 text-xs font-medium text-navy-900/40 uppercase tracking-wider">
              or register with email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              id="firstName"
              label="First name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              id="lastName"
              label="Last name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <TextField id="email" label="Email address" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <PasswordField id="password" label="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <label className="flex items-start gap-2 text-xs leading-relaxed text-navy-900/70">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={acceptedPolicies}
              onChange={(e) => setAcceptedPolicies(e.target.checked)}
              required
            />
            <span>
              I have read and accept the{' '}
              <Link to="/terms" target="_blank" rel="noreferrer" className={legalLinkClass}>
                Terms of Service
              </Link>
              ,{' '}
              <Link to="/community-guidelines" target="_blank" rel="noreferrer" className={legalLinkClass}>
                Community Guidelines
              </Link>
              ,{' '}
              <Link to="/privacy-policy" target="_blank" rel="noreferrer" className={legalLinkClass}>
                Privacy Policy
              </Link>
              , and{' '}
              <Link to="/refund-policy" target="_blank" rel="noreferrer" className={legalLinkClass}>
                Refund and Cancellation Policy
              </Link>
              .
            </span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting || !acceptedPolicies}>
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
          <p className="text-center text-xs text-navy-900/60">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-gold-500 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
        </div>
      </div>
    </AuthSplitLayout>
  )
}
