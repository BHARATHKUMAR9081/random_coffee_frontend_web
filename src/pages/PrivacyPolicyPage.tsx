import { Link } from 'react-router-dom'
import { PrivacyPolicyContent } from '../components/legal/PrivacyPolicyContent'
import { useAuth } from '../context/AuthContext'

export function PrivacyPolicyPage() {
  const { isLoggedIn } = useAuth()
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to={isLoggedIn ? '/settings' : '/'}
        className="text-sm font-medium text-navy-900/55 hover:text-navy-950"
      >
        ← Back
      </Link>
      <div className="mt-4 rounded-2xl border border-navy-900/8 bg-white p-6 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-8">
        <PrivacyPolicyContent />
      </div>
    </div>
  )
}
