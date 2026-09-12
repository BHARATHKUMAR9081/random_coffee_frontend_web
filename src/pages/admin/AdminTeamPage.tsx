import { useEffect, useState } from 'react'
import { AdminPage } from '../../components/admin/AdminPage'
import { Button } from '../../components/ui/Button'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { ApiError } from '../../services/http'
import type { StaffAdmin } from '../../services/adminHttp'
import { createStaffAdmin, listStaffAdmins, updateStaffAdmin } from '../../services/staffService'

export function AdminTeamPage() {
  const { admin } = useAdminAuth()
  const isSuper = admin?.role === 'super_admin'
  const [admins, setAdmins] = useState<StaffAdmin[]>([])
  const [error, setError] = useState<string | null>(null)
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'moderator' })

  async function refresh() {
    setError(null)
    setAdmins((await listStaffAdmins()).admins)
  }

  useEffect(() => {
    if (!isSuper) return
    void refresh().catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load team members.'))
  }, [isSuper])

  if (!isSuper) {
    return (
      <AdminPage title="Team members" subtitle="Only a super admin can manage staff accounts.">
        <p className="text-sm text-navy-900/60">You do not have permission to view this section.</p>
      </AdminPage>
    )
  }

  return (
    <AdminPage
      title="Team members"
      subtitle="Staff who can sign in to this admin panel."
      error={error}
      onRefresh={() => void refresh().catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load team members.'))}
    >
      <div className="flex flex-col gap-6">
        <form
          className="grid gap-3 rounded-xl border border-navy-900/10 p-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            void createStaffAdmin(newAdmin)
              .then(() => {
                setNewAdmin({ name: '', email: '', password: '', role: 'moderator' })
                return refresh()
              })
              .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not create admin.'))
          }}
        >
          <p className="text-sm font-semibold sm:col-span-2">Add staff</p>
          <input
            className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm"
            placeholder="Name"
            value={newAdmin.name}
            onChange={(e) => setNewAdmin((p) => ({ ...p, name: e.target.value }))}
          />
          <input
            className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm"
            placeholder="Email"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin((p) => ({ ...p, email: e.target.value }))}
          />
          <input
            className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm"
            placeholder="Password"
            type="password"
            value={newAdmin.password}
            onChange={(e) => setNewAdmin((p) => ({ ...p, password: e.target.value }))}
          />
          <select
            className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm"
            value={newAdmin.role}
            onChange={(e) => setNewAdmin((p) => ({ ...p, role: e.target.value }))}
          >
            <option value="moderator">Moderator</option>
            <option value="super_admin">Super admin</option>
          </select>
          <div className="sm:col-span-2">
            <Button type="submit">Create staff account</Button>
          </div>
        </form>
        <ul className="divide-y divide-navy-900/10">
          {admins.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-navy-900/50">
                  {row.email} · {row.role.replace('_', ' ')} · {row.isActive ? 'active' : 'disabled'}
                </p>
              </div>
              {row.id !== admin?.id && (
                <Button
                  size="sm"
                  variant={row.isActive ? 'danger' : 'secondary'}
                  onClick={() =>
                    void updateStaffAdmin(row.id, { isActive: !row.isActive })
                      .then(() => refresh())
                      .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not update staff.'))
                  }
                >
                  {row.isActive ? 'Disable' : 'Enable'}
                </Button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </AdminPage>
  )
}
