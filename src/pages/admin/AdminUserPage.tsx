import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AdminRefreshButton } from '../../components/admin/AdminRefreshButton'
import { Button } from '../../components/ui/Button'
import { Avatar } from '../../components/ui/Avatar'
import { UsageLogTable } from '../../components/usage/UsageLogTable'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { SelectField, TextAreaField, TextField } from '../../components/ui/Field'
import { ApiError } from '../../services/http'
import type { CatalogPlan } from '../../services/planCatalog'
import {
  fetchStaffPlanCatalog,
  fetchStaffUser,
  updateStaffUser,
  type StaffUserDetail,
} from '../../services/staffService'
import { PLANS, type BusinessType, type ConnectionIntent } from '../../types'
import { formatAdminTime, statusLabel } from './adminFormat'

const businessTypes: BusinessType[] = [
  'Startup Founder',
  'Manufacturer',
  'Trader',
  'Retailer',
  'Supplier',
  'Buyer',
  'Service Provider',
  'Freelancer',
  'Investor',
  'Other',
]

const connectionIntents: ConnectionIntent[] = [
  'Customers',
  'Suppliers',
  'Buyers',
  'Business Partners',
  'Investors',
  'Mentors',
  'Service Providers',
]

function planName(planId: string | undefined, plans: CatalogPlan[]) {
  return plans.find((plan) => plan.slug === planId)?.name || PLANS.find((plan) => plan.id === planId)?.name || planId || 'Free'
}

function emptyForm(user?: StaffUserDetail) {
  return {
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    mobileNumber: user?.mobileNumber ?? '',
    companyName: user?.companyName ?? '',
    companyWebsite: user?.companyWebsite ?? '',
    businessType: user?.businessType ?? '',
    industry: user?.industry ?? '',
    city: user?.city ?? '',
    state: user?.state ?? '',
    country: user?.country ?? 'India',
    shortDescription: user?.shortDescription ?? '',
    lookingFor: user?.lookingFor ?? [],
    preferredLanguages: (user?.preferredLanguages ?? []).join(', '),
    planId: user?.planId ?? 'free',
    isProfileVerified: Boolean(user?.isProfileVerified || user?.verificationStatus === 'VERIFIED'),
    isIdentityVerified: Boolean(user?.isIdentityVerified),
  }
}

export function AdminUserPage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { admin } = useAdminAuth()
  const isSuper = admin?.role === 'super_admin'
  const [user, setUser] = useState<StaffUserDetail | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [plans, setPlans] = useState<CatalogPlan[]>([])

  async function refresh() {
    if (!userId) return
    const [row, catalog] = await Promise.all([fetchStaffUser(userId), fetchStaffPlanCatalog().catch(() => null)])
    setUser(row)
    setForm(emptyForm(row))
    if (catalog?.plans.length) setPlans(catalog.plans)
  }

  useEffect(() => {
    if (!userId) {
      navigate('/admin/users', { replace: true })
      return
    }
    void refresh().catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load this user.'))
  }, [userId, navigate])

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function save(event: React.FormEvent) {
    event.preventDefault()
    if (!userId) return
    setSaving(true)
    setError(null)
    setSaved(null)
    try {
      const row = await updateStaffUser(userId, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        mobileNumber: form.mobileNumber.trim(),
        companyName: form.companyName.trim(),
        companyWebsite: form.companyWebsite.trim(),
        businessType: form.businessType,
        industry: form.industry.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim() || 'India',
        shortDescription: form.shortDescription.trim(),
        lookingFor: form.lookingFor,
        preferredLanguages: form.preferredLanguages
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        planId: form.planId,
        isProfileVerified: form.isProfileVerified,
        isIdentityVerified: form.isIdentityVerified,
      })
      setUser(row)
      setForm(emptyForm(row))
      setSaved('User updated.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save this user.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleBlock() {
    if (!userId || !user) return
    setError(null)
    setSaved(null)
    try {
      const row = await updateStaffUser(userId, { isActive: !user.isActive })
      setUser(row)
      setForm(emptyForm(row))
      setSaved(row.isActive ? 'User unblocked.' : 'User blocked.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update this user.')
    }
  }

  return (
    <div>
      <Link to="/admin/users" className="text-sm font-medium text-navy-900/55 hover:text-navy-950">
        ← Users
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Avatar src={user?.profilePhotoUrl} name={user?.fullName || 'User'} size="lg" />
          <div>
            <h1 className="text-2xl font-semibold text-navy-950">{user?.fullName || 'User'}</h1>
            <p className="mt-1 text-sm text-navy-900/55">{user?.email || 'Loading…'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AdminRefreshButton
            onClick={() =>
              void refresh().catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load this user.'))
            }
          />
          {user && (
            <Button size="sm" variant={user.isActive ? 'danger' : 'secondary'} onClick={() => void toggleBlock()}>
              {user.isActive ? 'Block user' : 'Unblock user'}
            </Button>
          )}
        </div>
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {saved && <p className="mt-4 text-sm text-green-700">{saved}</p>}

      {user && (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <form
            onSubmit={(event) => void save(event)}
            className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-900/50">Profile</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField id="firstName" label="First name" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} />
              <TextField id="lastName" label="Last name" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
              <TextField id="email" label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
              <TextField id="mobileNumber" label="Mobile" value={form.mobileNumber} onChange={(e) => update('mobileNumber', e.target.value)} />
              <TextField id="companyName" label="Company" value={form.companyName} onChange={(e) => update('companyName', e.target.value)} />
              <TextField id="companyWebsite" label="Website" value={form.companyWebsite} onChange={(e) => update('companyWebsite', e.target.value)} />
              <SelectField id="businessType" label="Business type" value={form.businessType} onChange={(e) => update('businessType', e.target.value)}>
                <option value="">Select</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </SelectField>
              <TextField id="industry" label="Industry" value={form.industry} onChange={(e) => update('industry', e.target.value)} />
              <TextField id="city" label="City" value={form.city} onChange={(e) => update('city', e.target.value)} />
              <TextField id="state" label="State" value={form.state} onChange={(e) => update('state', e.target.value)} />
              <TextField id="country" label="Country" value={form.country} onChange={(e) => update('country', e.target.value)} />
              <SelectField id="planId" label="Plan" value={form.planId} onChange={(e) => update('planId', e.target.value)}>
                {(plans.length ? plans : PLANS.map((plan) => ({ slug: plan.id, name: plan.name }))).map((plan) => (
                  <option key={plan.slug} value={plan.slug}>
                    {plan.name}
                  </option>
                ))}
              </SelectField>
              <TextField
                id="preferredLanguages"
                label="Languages"
                value={form.preferredLanguages}
                onChange={(e) => update('preferredLanguages', e.target.value)}
                placeholder="English, Tamil"
              />
              <label className="flex items-center gap-2 text-sm text-navy-900/80">
                <input
                  type="checkbox"
                  checked={form.isProfileVerified}
                  onChange={(e) => update('isProfileVerified', e.target.checked)}
                />
                Business verified
              </label>
              <label className="flex items-center gap-2 text-sm text-navy-900/80">
                <input
                  type="checkbox"
                  checked={form.isIdentityVerified}
                  onChange={(e) => update('isIdentityVerified', e.target.checked)}
                />
                Identity verified
              </label>
              <div className="sm:col-span-2">
                <p className="mb-2 text-sm font-medium text-navy-900">Looking for</p>
                <div className="flex flex-wrap gap-2">
                  {connectionIntents.map((intent) => {
                    const active = form.lookingFor.includes(intent)
                    return (
                      <button
                        type="button"
                        key={intent}
                        onClick={() =>
                          update(
                            'lookingFor',
                            active ? form.lookingFor.filter((item) => item !== intent) : [...form.lookingFor, intent],
                          )
                        }
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          active ? 'border-gold-500 bg-gold-500/15 text-navy-950' : 'border-navy-900/15 text-navy-900/70'
                        }`}
                      >
                        {intent}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="sm:col-span-2">
                <TextAreaField
                  id="shortDescription"
                  label="About"
                  required
                  minLength={50}
                  value={form.shortDescription}
                  onChange={(e) => update('shortDescription', e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="mt-5" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </form>

          <div className="flex flex-col gap-6">
            <section className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-900/50">Billing</h2>
              {user.billing?.legalName || user.billing?.billingEmail ? (
                <dl className="mt-4 grid gap-3 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-navy-900/45">Name</dt>
                    <dd className="mt-0.5 font-medium">{user.billing.legalName || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-navy-900/45">GSTIN</dt>
                    <dd className="mt-0.5 font-medium">
                      {user.billing.gstin || '—'}
                      {user.billing.gstinVerified && user.billing.gstin && (
                        <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                          Verified
                        </span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-navy-900/45">Email / mobile</dt>
                    <dd className="mt-0.5 font-medium">
                      {[user.billing.billingEmail, user.billing.billingPhone].filter(Boolean).join(' · ') || '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-navy-900/45">Address</dt>
                    <dd className="mt-0.5 font-medium">
                      {[user.billing.addressLine, user.billing.city, user.billing.state, user.billing.pincode, user.billing.country]
                        .filter(Boolean)
                        .join(', ') || '—'}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-3 text-sm text-navy-900/50">No billing details yet.</p>
              )}
            </section>

            <section className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-900/50">Account</h2>
              <dl className="mt-4 grid gap-3 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-navy-900/45">Plan</dt>
                  <dd className="mt-0.5 font-medium">{planName(user.planId, plans)}</dd>
                </div>
                {user.usage && (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-navy-900/45">Introductions left</dt>
                    <dd className="mt-0.5 font-medium">
                      {user.usage.creditsRemaining} / {user.usage.creditsLimit}
                      {user.usage.creditsPeriod === 'month' ? ' this month' : ' lifetime'}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs uppercase tracking-wide text-navy-900/45">Last login</dt>
                  <dd className="mt-0.5 font-medium">{formatAdminTime(user.lastLogin)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-navy-900/45">Created</dt>
                  <dd className="mt-0.5 font-medium">{formatAdminTime(user.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-navy-900/45">Location</dt>
                  <dd className="mt-0.5 font-medium">{[user.city, user.state, user.country].filter(Boolean).join(', ') || '—'}</dd>
                </div>
              </dl>
            </section>

            {isSuper && (
            <section className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-900/50">Credit usage</h2>
                  <p className="mt-1 text-xs text-navy-900/45">Who they requested or accepted, credits used, and when.</p>
                </div>
                <Link to="/admin/usage" className="text-xs font-semibold text-gold-600 hover:underline">
                  View all
                </Link>
              </div>
              {user.usage && (
                <p className="mb-3 text-sm text-navy-900/70">
                  {user.usage.creditsRemaining} of {user.usage.creditsLimit} credits left
                  {user.usage.creditsPeriod === 'month' ? ' this month' : ' (lifetime)'}.
                </p>
              )}
              <UsageLogTable rows={user.usageLogs ?? []} empty="No credits used yet." />
            </section>
            )}

            <section className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-900/50">Activity log</h2>
                <AdminRefreshButton
                  onClick={() =>
                    void refresh().catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load this user.'))
                  }
                />
              </div>
              <div className="mt-3 divide-y divide-navy-900/10">
                {(user.activity ?? []).length === 0 && <p className="text-sm text-navy-900/50">No activity yet.</p>}
                {(user.activity ?? []).map((row) => (
                  <div key={row.id} className="py-3 text-sm">
                    <p className="font-medium">{row.title}</p>
                    <p className="text-xs text-navy-900/50">
                      {statusLabel(row.event)} · {formatAdminTime(row.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-900/50">Sessions</h2>
                <AdminRefreshButton
                  onClick={() =>
                    void refresh().catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load this user.'))
                  }
                />
              </div>
              <div className="mt-3 divide-y divide-navy-900/10">
                {(user.sessions ?? []).length === 0 && <p className="text-sm text-navy-900/50">No matches yet.</p>}
                {(user.sessions ?? []).map((row) => (
                  <div key={row.id} className="py-3 text-sm">
                    <p className="font-medium">{row.otherName}</p>
                    <p className="text-xs text-navy-900/50">
                      {formatAdminTime(row.timestamp)} · {row.durationSeconds}s · {statusLabel(row.outcome)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
