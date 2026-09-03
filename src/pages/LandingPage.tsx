import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export function LandingPage() {
  const { loginDemo } = useAuth()
  const navigate = useNavigate()

  function handleDemo() {
    loginDemo()
    navigate('/dashboard')
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-1 py-10 text-center sm:py-16">
      <h1 className="text-2xl font-semibold text-navy-950 sm:text-3xl">
        <span className="text-gold-500">Verified</span> business introductions, as fast as making a cup of coffee
      </h1>
      <p className="text-navy-900/65">
        No approval wait. No anonymity. Instant, verified one-to-one video conversations with the right business
        contacts.
      </p>
      <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
        <Button className="w-full sm:w-auto" onClick={handleDemo}>Try the demo</Button>
        <Link to="/register">
          <Button className="w-full" variant="secondary">Create your account</Button>
        </Link>
        <Link to="/login">
          <Button className="w-full" variant="secondary">Sign in</Button>
        </Link>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <Link to="/terms" className="text-xs font-medium text-navy-900/45 hover:text-navy-900 hover:underline">
          Terms of Service
        </Link>
        <span className="text-navy-900/25">·</span>
        <Link to="/community-guidelines" className="text-xs font-medium text-navy-900/45 hover:text-navy-900 hover:underline">
          Community Guidelines
        </Link>
        <span className="text-navy-900/25">·</span>
        <Link to="/privacy-policy" className="text-xs font-medium text-navy-900/45 hover:text-navy-900 hover:underline">
          Privacy Policy
        </Link>
        <span className="text-navy-900/25">·</span>
        <Link to="/refund-policy" className="text-xs font-medium text-navy-900/45 hover:text-navy-900 hover:underline">
          Refund and Cancellation Policy
        </Link>
      </div>
    </div>
  )
}
