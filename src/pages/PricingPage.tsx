import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BillingForm } from '../components/billing/BillingForm'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { billingFromProfile, billingPayload, validateBilling, verifiedGstin } from '../services/billing'
import { createPlanOrder, openRazorpayCheckout } from '../services/paymentService'
import { verifyPaymentThunk } from '../store/authSlice'
import { useAppDispatch } from '../store/hooks'
import { CONNECTION_BALANCE_NOTE, PLAN_COMPARISON_ROWS } from '../data/planComparison'
import { EMPTY_PLAN_RULES, fetchPlanCatalog, type CatalogFeature, type CatalogPlan } from '../services/planCatalog'
import { PLANS } from '../types'
import type { BillingInfo, PlanId } from '../types'

function fallbackPlans(): CatalogPlan[] {
  return PLANS.map((plan, index) => ({
    id: plan.id,
    slug: plan.id,
    name: plan.name,
    price: plan.id === 'basic' ? 299 : plan.id === 'pro' ? 799 : 0,
    priceLabel: plan.priceLabel,
    includes: plan.includes,
    sortOrder: index + 1,
    isActive: true,
    isFeatured: plan.id === 'pro',
    rules: EMPTY_PLAN_RULES,
  }))
}

function fallbackFeatures(plans: CatalogPlan[]): CatalogFeature[] {
  const bySlug = Object.fromEntries(plans.map((plan) => [plan.slug, plan.id]))
  return PLAN_COMPARISON_ROWS.map((row, index) => ({
    id: row.feature,
    label: row.feature,
    note: row.feature === 'Connection balance' ? CONNECTION_BALANCE_NOTE : '',
    sortOrder: index + 1,
    values: {
      [bySlug.free ?? 'free']: row.free,
      [bySlug.basic ?? 'basic']: row.basic,
      [bySlug.pro ?? 'pro']: row.pro,
    },
  }))
}

export function PricingPage() {
  const { user, billing, changePlan } = useAuth()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const lockedGstin = verifiedGstin({
    verificationStatus: user.verificationStatus,
    businessIdNumber: user.businessIdNumber,
    billing,
  })
  const [justChanged, setJustChanged] = useState<PlanId | null>(null)
  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null)
  const [form, setForm] = useState<BillingInfo>(() => billingFromProfile(user.profile, billing, lockedGstin))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const billingRef = useRef<HTMLFormElement>(null)
  const [plans, setPlans] = useState<CatalogPlan[]>(fallbackPlans)
  const [features, setFeatures] = useState<CatalogFeature[]>(() => fallbackFeatures(fallbackPlans()))

  const pending = plans.find((plan) => plan.slug === pendingPlan)

  useEffect(() => {
    void fetchPlanCatalog()
      .then((data) => {
        if (!data.plans.length) return
        setPlans(data.plans)
        setFeatures(data.features)
      })
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    if (!pendingPlan) return
    billingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [pendingPlan])

  async function applyPlan(planId: PlanId, nextBilling?: BillingInfo) {
    const result = await changePlan(planId, nextBilling)
    if (!result.success) {
      setError(result.error ?? 'Could not update your plan.')
      return false
    }
    setJustChanged(planId)
    setTimeout(() => setJustChanged(null), 2000)
    return true
  }

  async function handleChoose(plan: CatalogPlan) {
    setError(null)
    if (plan.price <= 0) {
      setPendingPlan(null)
      await applyPlan(plan.slug)
      return
    }
    setForm(billingFromProfile(user.profile, billing, lockedGstin))
    setPendingPlan(plan.slug)
  }

  async function handleBillingSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!pendingPlan) return
    const payload = billingPayload({ ...form, gstin: lockedGstin || form.gstin })
    const invalid = validateBilling(payload)
    if (invalid) {
      setError(invalid)
      return
    }
    setError(null)
    setSaving(true)
    try {
      if (user.id === 'demo') {
        const ok = await applyPlan(pendingPlan, payload)
        if (ok) setPendingPlan(null)
        return
      }
      const order = await createPlanOrder(pendingPlan, payload)
      const confirmation = await openRazorpayCheckout(order)
      await dispatch(verifyPaymentThunk(confirmation)).unwrap()
      setJustChanged(pendingPlan)
      setPendingPlan(null)
      setTimeout(() => setJustChanged(null), 2000)
    } catch (err) {
      const message =
        typeof err === 'string' ? err : err instanceof Error ? err.message : 'Could not complete payment.'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold text-navy-950">Plans & pricing</h1>
      <p className="mt-1 text-sm text-navy-900/55">
        Compare the live catalog. Super admin can change plans and feature copy from the admin panel.
      </p>

      <div className={`mt-6 grid gap-4 ${plans.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {plans.map((plan) => {
          const isCurrent = user.planId === plan.slug
          return (
            <div
              key={plan.id}
              className={`flex flex-col justify-between rounded-xl border p-5 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] ${
                isCurrent || plan.isFeatured ? 'border-gold-500 bg-white' : 'border-navy-900/10 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-navy-950">{plan.name}</h2>
                  {isCurrent && (
                    <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[10px] font-semibold text-gold-500">
                      Current
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xl font-semibold text-navy-950">{plan.priceLabel}</p>
                <p className="mt-2 text-xs text-navy-900/60">{plan.includes}</p>
              </div>
              <Button
                className="mt-4 w-full"
                variant={isCurrent ? 'secondary' : 'primary'}
                disabled={isCurrent || saving}
                onClick={() => void handleChoose(plan)}
              >
                {isCurrent ? 'Active plan' : justChanged === plan.slug ? 'Switched!' : 'Choose plan'}
              </Button>
            </div>
          )
        })}
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border border-navy-900/8 bg-white shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)]">
        <div className="border-b border-navy-900/8 bg-navy-950/[0.03] px-5 py-3.5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-900/50">Plan comparison</h2>
          <p className="mt-0.5 text-sm text-navy-900/55">What you get on each plan.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-navy-900/10 text-xs uppercase tracking-wide text-navy-900/50">
                <th className="sticky left-0 bg-white px-5 py-3 font-semibold">Feature</th>
                {plans.map((plan) => (
                  <th key={plan.id} className="px-5 py-3 font-semibold">
                    {plan.name}
                    {plan.price > 0 ? ` — ${plan.priceLabel}` : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((row) => (
                <tr key={row.id} className="border-b border-navy-900/8 align-top last:border-b-0">
                  <th className="sticky left-0 bg-white px-5 py-3 font-medium text-navy-950">{row.label}</th>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-5 py-3 text-navy-900/70">
                      {row.values[plan.id] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {features
          .filter((row) => row.note)
          .map((row) => (
            <p key={`${row.id}-note`} className="border-t border-navy-900/8 px-5 py-3 text-xs leading-relaxed text-navy-900/50">
              {row.note}
            </p>
          ))}
      </section>

      {pending && (
        <form
          ref={billingRef}
          onSubmit={(event) => void handleBillingSubmit(event)}
          className="mt-6 scroll-mt-24 rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-navy-950">Billing details</h2>
              <p className="mt-1 text-sm text-navy-900/55">
                Required for {pending.name} ({pending.priceLabel}). GSTIN is optional if you are not registered.
              </p>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-navy-900/50 hover:text-navy-950"
              onClick={() => {
                setPendingPlan(null)
                setError(null)
              }}
            >
              Cancel
            </button>
          </div>
          <div className="mt-5">
            <BillingForm value={form} onChange={setForm} verifiedGstin={lockedGstin} />
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <Button type="submit" className="mt-5" disabled={saving}>
            {saving ? 'Opening Razorpay…' : `Pay ${pending.priceLabel} with Razorpay`}
          </Button>
        </form>
      )}

      {!pending && error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <p className="mt-4 text-center text-xs text-navy-900/40">
        Paid plans are charged through Razorpay test checkout. Use Razorpay test cards.{' '}
        <Link to="/refund-policy" className="font-medium text-gold-600 hover:underline">
          Refund and Cancellation Policy
        </Link>
      </p>

      <div className="mt-6 text-center">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          Back to dashboard
        </Button>
      </div>
    </div>
  )
}
