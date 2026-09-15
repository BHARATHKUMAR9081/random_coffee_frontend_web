import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AdminRefreshButton } from '../components/admin/AdminRefreshButton'
import { Button } from '../components/ui/Button'
import { PasswordField } from '../components/ui/Field'
import { SettingsCard } from '../components/ui/SettingsCard'
import { UsageLogTable } from '../components/usage/UsageLogTable'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../services/http'
import {
  changeAccountPassword,
  deleteOwnAccount,
  listActivityLog,
  listUsageLog,
  type ActivityLogEntry,
  type UsageLogEntry,
  type UsageSummary,
} from '../services/authService'
import type { PageMeta } from '../services/paging'

const emptyPage: PageMeta = { page: 1, pageSize: 10, total: 0, totalPages: 1, hasNext: false, hasPrev: false }

export function SettingsPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [savingPassword, setSavingPassword] = useState(false)

  const [activity, setActivity] = useState<ActivityLogEntry[]>([])
  const [activityMeta, setActivityMeta] = useState<PageMeta>(emptyPage)
  const [activityError, setActivityError] = useState<string | null>(null)
  const [activityLoading, setActivityLoading] = useState(true)
  const [usage, setUsage] = useState<UsageSummary | null>(null)
  const [usageLogs, setUsageLogs] = useState<UsageLogEntry[]>([])
  const [usageMeta, setUsageMeta] = useState<PageMeta>(emptyPage)
  const [usageError, setUsageError] = useState<string | null>(null)
  const [usageLoading, setUsageLoading] = useState(true)

  const [deletePassword, setDeletePassword] = useState('')
  const [deleteConfirmed, setDeleteConfirmed] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function loadActivity(page = 1) {
    setActivityError(null)
    setActivityLoading(true)
    try {
      const data = await listActivityLog({ page })
      setActivity(data.activity)
      setActivityMeta({
        page: data.page,
        pageSize: data.pageSize,
        total: data.total,
        totalPages: data.totalPages,
        hasNext: data.hasNext,
        hasPrev: data.hasPrev,
      })
    } catch (error) {
      setActivityError(error instanceof ApiError ? error.message : 'Could not load your activity.')
    } finally {
      setActivityLoading(false)
    }
  }

  async function loadUsage(page = 1) {
    setUsageError(null)
    setUsageLoading(true)
    try {
      const data = await listUsageLog({ page })
      setUsage(data.usage)
      setUsageLogs(data.usageLogs)
      setUsageMeta({
        page: data.page,
        pageSize: data.pageSize,
        total: data.total,
        totalPages: data.totalPages,
        hasNext: data.hasNext,
        hasPrev: data.hasPrev,
      })
    } catch (error) {
      setUsageError(error instanceof ApiError ? error.message : 'Could not load usage.')
    } finally {
      setUsageLoading(false)
    }
  }

  useEffect(() => {
    void loadActivity(1)
    void loadUsage(1)
  }, [])

  function timeLabel(iso: string | null) {
    if (!iso) return ''
    return new Date(iso).toLocaleString([], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPasswordSuccess(null)
    if (!oldPassword || !newPassword) {
      setPasswordError('Enter your current and new password.')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.')
      return
    }
    if (newPassword === oldPassword) {
      setPasswordError('Choose a new password that is different from your current one.')
      return
    }
    setPasswordError(null)
    setSavingPassword(true)
    try {
      await changeAccountPassword(oldPassword, newPassword)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSuccess('Password updated.')
      void loadActivity(1)
    } catch (error) {
      setPasswordError(error instanceof ApiError ? error.message : 'Could not update your password.')
    } finally {
      setSavingPassword(false)
    }
  }

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault()
    if (!deletePassword) {
      setDeleteError('Enter your current password to delete your account.')
      return
    }
    if (!deleteConfirmed) {
      setDeleteError('Confirm that you want to permanently delete your account.')
      return
    }
    setDeleteError(null)
    setDeleting(true)
    try {
      await deleteOwnAccount(deletePassword)
      logout()
      navigate('/login', { replace: true })
    } catch (error) {
      setDeleteError(error instanceof ApiError ? error.message : 'Could not delete your account.')
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-navy-900/55 hover:text-navy-950"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-semibold text-navy-950">Settings</h1>
      <p className="mt-1 text-sm text-navy-900/55">Manage your password, activity, and account.</p>

      <SettingsCard
        title="Credit usage"
        subtitle="Who you requested or accepted, how many credits were used, and when."
        actions={<AdminRefreshButton busy={usageLoading} disabled={usageLoading} onClick={() => void loadUsage(usageMeta.page)} />}
      >
        {usage && (
          <p className="mb-3 text-sm text-navy-900/70">
            {usage.creditsRemaining} of {usage.creditsLimit} credits left
            {usage.creditsPeriod === 'month' ? ' this month' : ' (lifetime)'}.
          </p>
        )}
        {usageLoading && usageLogs.length === 0 ? (
          <p className="text-sm text-navy-900/50">Loading credit usage…</p>
        ) : usageError ? (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <p>{usageError}</p>
            <Button size="sm" variant="secondary" onClick={() => void loadUsage(usageMeta.page || 1)}>
              Retry
            </Button>
          </div>
        ) : (
          <UsageLogTable rows={usageLogs} empty="No credits used yet." />
        )}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-navy-900/10 pt-3 text-sm text-navy-900/60">
          <p>
            {usageMeta.total} total · page {usageMeta.page} of {usageMeta.totalPages || 1}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={usageLoading || !usageMeta.hasPrev}
              onClick={() => void loadUsage(usageMeta.page - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={usageLoading || !usageMeta.hasNext}
              onClick={() => void loadUsage(usageMeta.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Activity log"
        subtitle="Sign-ins, profile changes, matches, calls, and connection requests."
        actions={
          <AdminRefreshButton
            busy={activityLoading}
            disabled={activityLoading}
            onClick={() => void loadActivity(activityMeta.page)}
          />
        }
      >
        {activityLoading && activity.length === 0 ? (
          <p className="text-sm text-navy-900/50">Loading activity…</p>
        ) : activityError ? (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <p>{activityError}</p>
            <Button size="sm" variant="secondary" onClick={() => void loadActivity(activityMeta.page || 1)}>
              Retry
            </Button>
          </div>
        ) : activity.length === 0 ? (
          <p className="text-sm text-navy-900/50">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-navy-900/10">
            {activity.map((row) => (
              <li key={row.id} className="flex flex-wrap items-start justify-between gap-2 py-2.5">
                <p className="text-sm text-navy-950">{row.title}</p>
                <p className="text-[11px] text-navy-900/45">{timeLabel(row.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-navy-900/10 pt-3 text-sm text-navy-900/60">
          <p>
            {activityMeta.total} total · page {activityMeta.page} of {activityMeta.totalPages || 1}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={activityLoading || !activityMeta.hasPrev}
              onClick={() => void loadActivity(activityMeta.page - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={activityLoading || !activityMeta.hasNext}
              onClick={() => void loadActivity(activityMeta.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Change password" subtitle="Use a password you do not share with anyone else.">
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <PasswordField
            id="oldPassword"
            label="Current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            autoComplete="current-password"
          />
          <PasswordField
            id="newPassword"
            label="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
          <PasswordField
            id="confirmPassword"
            label="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
          {passwordSuccess && <p className="text-sm text-green-700">{passwordSuccess}</p>}
          <Button type="submit" className="self-start" disabled={savingPassword}>
            {savingPassword ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      </SettingsCard>

      <SettingsCard
        danger
        title="Delete my account"
        subtitle="This permanently removes your profile, matches, chats, tickets, and other data. It cannot be undone."
      >
        <form onSubmit={handleDelete} className="flex flex-col gap-4">
          <PasswordField
            id="deletePassword"
            label="Current password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            autoComplete="current-password"
          />
          <label className="flex items-start gap-2 text-sm text-navy-900/80">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={deleteConfirmed}
              onChange={(e) => setDeleteConfirmed(e.target.checked)}
            />
            I understand this will permanently delete all of my data.
          </label>
          {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
          <Button type="submit" variant="danger" className="self-start" disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete my account'}
          </Button>
        </form>
      </SettingsCard>

      <SettingsCard
        title="Policies"
        subtitle="Review the documents you accepted when you created your account."
      >
        <div className="flex flex-col gap-2">
          <Link to="/terms" className="text-sm font-medium text-gold-600 hover:underline">
            Terms of Service
          </Link>
          <Link to="/community-guidelines" className="text-sm font-medium text-gold-600 hover:underline">
            Community Guidelines
          </Link>
          <Link to="/privacy-policy" className="text-sm font-medium text-gold-600 hover:underline">
            Privacy Policy
          </Link>
          <Link to="/refund-policy" className="text-sm font-medium text-gold-600 hover:underline">
            Refund and Cancellation Policy
          </Link>
        </div>
      </SettingsCard>
    </div>
  )
}
