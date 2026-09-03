import { Link, useNavigate } from 'react-router-dom'
import { AdminPage } from '../../components/admin/AdminPage'
import { Button } from '../../components/ui/Button'
import { useAdminAuth } from '../../context/AdminAuthContext'

export function AdminSettingsPage() {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()

  return (
    <AdminPage title="Settings" subtitle="Your staff account on RandomCoffee.">
      <div className="flex max-w-lg flex-col gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-navy-900/45">Name</p>
          <p className="mt-1 font-medium">{admin?.name || '—'}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-navy-900/45">Email</p>
          <p className="mt-1 font-medium">{admin?.email || '—'}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-navy-900/45">Role</p>
          <p className="mt-1 font-medium capitalize">{admin?.role?.replace('_', ' ') || '—'}</p>
        </div>
        <div className="flex flex-wrap gap-4 pt-2 text-sm">
          <Link to="/community-guidelines" className="font-medium text-gold-600 hover:underline" target="_blank" rel="noreferrer">
            Community Guidelines
          </Link>
          <Link to="/privacy-policy" className="font-medium text-gold-600 hover:underline" target="_blank" rel="noreferrer">
            Privacy Policy
          </Link>
        </div>
        <div className="pt-2">
          <Button
            variant="secondary"
            onClick={() => {
              logout()
              navigate('/admin/login')
            }}
          >
            Log out
          </Button>
        </div>
      </div>
    </AdminPage>
  )
}
