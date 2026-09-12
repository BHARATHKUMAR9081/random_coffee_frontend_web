import { useEffect, useMemo, useState } from 'react'
import { AdminPage } from '../../components/admin/AdminPage'
import { Button } from '../../components/ui/Button'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { ApiError } from '../../services/http'
import { EMPTY_PLAN_RULES, type CatalogFeature, type CatalogPlan, type PlanCatalog, type PlanRules } from '../../services/planCatalog'
import {
  createStaffPlan,
  createStaffPlanFeature,
  deleteStaffPlan,
  deleteStaffPlanFeature,
  fetchStaffPlanCatalog,
  saveStaffPlanCatalog,
} from '../../services/staffService'

const emptyPlan = { name: '', slug: '', price: '', includes: '' }

export function AdminPlansPage() {
  const { admin } = useAdminAuth()
  const isSuper = admin?.role === 'super_admin'
  const [saved, setSaved] = useState<PlanCatalog>({ plans: [], features: [] })
  const [plans, setPlans] = useState<CatalogPlan[]>([])
  const [features, setFeatures] = useState<CatalogFeature[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [newPlan, setNewPlan] = useState(emptyPlan)
  const [newFeature, setNewFeature] = useState('')

  const dirty = useMemo(
    () => JSON.stringify({ plans, features }) !== JSON.stringify({ plans: saved.plans, features: saved.features }),
    [plans, features, saved],
  )

  function applyCatalog(data: PlanCatalog) {
    setSaved(data)
    setPlans(data.plans)
    setFeatures(data.features)
  }

  async function refresh() {
    setError(null)
    setSuccess(null)
    applyCatalog(await fetchStaffPlanCatalog())
  }

  useEffect(() => {
    void refresh().catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load plans.'))
  }, [])

  async function saveChanges() {
    setError(null)
    setSuccess(null)
    setSaving(true)
    try {
      applyCatalog(await saveStaffPlanCatalog({ plans, features }))
      setSuccess('Changes saved. Pricing will show the new catalog.')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save changes.')
    } finally {
      setSaving(false)
    }
  }

  if (!isSuper) {
    return (
      <AdminPage title="Plans & features" subtitle="Only a super admin can edit the pricing catalog.">
        <p className="text-sm text-navy-900/60">You do not have permission to change plans.</p>
      </AdminPage>
    )
  }

  return (
    <AdminPage
      title="Plans & features"
      subtitle="Edit the catalog, then click Save changes. Pricing updates after you save."
      error={error}
      success={success}
      onRefresh={() => void refresh().catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load plans.'))}
      actions={
        <Button type="button" disabled={!dirty || saving} onClick={() => void saveChanges()}>
          {saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
        </Button>
      }
    >
      <div className="flex flex-col gap-8">
        {dirty && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            You have unsaved edits. Click Save changes to publish them to Pricing.
          </p>
        )}

        <section>
          <div className="mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-900/50">Plans</h2>
            <p className="mt-1 text-xs text-navy-900/45">Name, monthly price, and the short line on each pricing card.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-900/10 text-xs uppercase tracking-wide text-navy-900/50">
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Slug</th>
                  <th className="py-2 pr-3">Price (₹/mo)</th>
                  <th className="py-2 pr-3">Card line</th>
                  <th className="py-2 pr-3">Featured</th>
                  <th className="py-2 pr-3">Active</th>
                  <th className="py-2"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900/10">
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td className="py-2 pr-3">
                      <input
                        className="w-full rounded-lg border border-navy-900/15 px-2 py-1.5"
                        value={plan.name}
                        onChange={(e) =>
                          setPlans((rows) => rows.map((row) => (row.id === plan.id ? { ...row, name: e.target.value } : row)))
                        }
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        className="w-28 rounded-lg border border-navy-900/15 px-2 py-1.5"
                        value={plan.slug}
                        onChange={(e) =>
                          setPlans((rows) => rows.map((row) => (row.id === plan.id ? { ...row, slug: e.target.value } : row)))
                        }
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="number"
                        min={0}
                        className="w-24 rounded-lg border border-navy-900/15 px-2 py-1.5"
                        value={plan.price}
                        onChange={(e) =>
                          setPlans((rows) =>
                            rows.map((row) => (row.id === plan.id ? { ...row, price: Number(e.target.value) || 0 } : row)),
                          )
                        }
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        className="w-full rounded-lg border border-navy-900/15 px-2 py-1.5"
                        value={plan.includes}
                        onChange={(e) =>
                          setPlans((rows) =>
                            rows.map((row) => (row.id === plan.id ? { ...row, includes: e.target.value } : row)),
                          )
                        }
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="checkbox"
                        checked={plan.isFeatured}
                        onChange={(e) =>
                          setPlans((rows) =>
                            rows.map((row) => (row.id === plan.id ? { ...row, isFeatured: e.target.checked } : row)),
                          )
                        }
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="checkbox"
                        checked={plan.isActive}
                        onChange={(e) =>
                          setPlans((rows) =>
                            rows.map((row) => (row.id === plan.id ? { ...row, isActive: e.target.checked } : row)),
                          )
                        }
                      />
                    </td>
                    <td className="py-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          void deleteStaffPlan(plan.id)
                            .then(() => refresh())
                            .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not remove plan.'))
                        }
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form
            className="mt-4 grid gap-3 rounded-xl border border-navy-900/10 p-4 sm:grid-cols-2 lg:grid-cols-5"
            onSubmit={(event) => {
              event.preventDefault()
              void createStaffPlan({
                name: newPlan.name,
                slug: newPlan.slug,
                price: Number(newPlan.price) || 0,
                includes: newPlan.includes,
              })
                .then(() => {
                  setNewPlan(emptyPlan)
                  return refresh()
                })
                .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not add plan.'))
            }}
          >
            <p className="text-sm font-semibold sm:col-span-2 lg:col-span-5">Add a plan</p>
            <input
              className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm"
              placeholder="Name"
              value={newPlan.name}
              onChange={(e) => setNewPlan((row) => ({ ...row, name: e.target.value }))}
            />
            <input
              className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm"
              placeholder="Slug (basic)"
              value={newPlan.slug}
              onChange={(e) => setNewPlan((row) => ({ ...row, slug: e.target.value }))}
            />
            <input
              className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm"
              placeholder="Price"
              type="number"
              min={0}
              value={newPlan.price}
              onChange={(e) => setNewPlan((row) => ({ ...row, price: e.target.value }))}
            />
            <input
              className="rounded-lg border border-navy-900/15 px-3 py-2 text-sm lg:col-span-1"
              placeholder="Card line"
              value={newPlan.includes}
              onChange={(e) => setNewPlan((row) => ({ ...row, includes: e.target.value }))}
            />
            <Button type="submit">Add plan</Button>
          </form>
        </section>

        <section>
          <div className="mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-900/50">Plan rules</h2>
            <p className="mt-1 text-xs text-navy-900/45">
              These numbers and flags are what the app enforces. The matrix above is display copy only.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-900/10 text-xs uppercase tracking-wide text-navy-900/50">
                  <th className="py-2 pr-3">Plan</th>
                  <th className="py-2 pr-3">Intro limit</th>
                  <th className="py-2 pr-3">Period</th>
                  <th className="py-2 pr-3">Send cost</th>
                  <th className="py-2 pr-3">Accept cost</th>
                  <th className="py-2 pr-3">Follow-up</th>
                  <th className="py-2 pr-3">Note</th>
                  <th className="py-2">Posts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900/10">
                {plans.map((plan) => {
                  const rules = { ...EMPTY_PLAN_RULES, ...plan.rules }
                  function setRule<K extends keyof PlanRules>(key: K, value: PlanRules[K]) {
                    setPlans((rows) => rows.map((row) => (row.id === plan.id ? { ...row, rules: { ...rules, [key]: value } } : row)))
                  }
                  return (
                    <tr key={plan.id}>
                      <td className="py-2 pr-3 font-medium">{plan.name}</td>
                      <td className="py-2 pr-3">
                        <input
                          type="number"
                          min={0}
                          className="w-20 rounded-lg border border-navy-900/15 px-2 py-1.5"
                          value={rules.introductionsLimit}
                          onChange={(e) => setRule('introductionsLimit', Number(e.target.value) || 0)}
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <select
                          className="rounded-lg border border-navy-900/15 px-2 py-1.5"
                          value={rules.introductionsPeriod}
                          onChange={(e) => setRule('introductionsPeriod', e.target.value)}
                        >
                          <option value="lifetime">Lifetime</option>
                          <option value="month">Monthly</option>
                        </select>
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          type="number"
                          min={0}
                          className="w-16 rounded-lg border border-navy-900/15 px-2 py-1.5"
                          value={rules.connectionCost}
                          onChange={(e) => setRule('connectionCost', Number(e.target.value) || 0)}
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          type="number"
                          min={0}
                          className="w-16 rounded-lg border border-navy-900/15 px-2 py-1.5"
                          value={rules.receiverCost}
                          onChange={(e) => setRule('receiverCost', Number(e.target.value) || 0)}
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          type="checkbox"
                          checked={rules.followupAllowed}
                          onChange={(e) => setRule('followupAllowed', e.target.checked)}
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          type="checkbox"
                          checked={rules.followupNote}
                          onChange={(e) => setRule('followupNote', e.target.checked)}
                        />
                      </td>
                      <td className="py-2">
                        <input
                          type="number"
                          className="w-16 rounded-lg border border-navy-900/15 px-2 py-1.5"
                          value={rules.postsLimit}
                          onChange={(e) => setRule('postsLimit', Number(e.target.value))}
                          title="-1 means unlimited"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-900/50">Feature matrix</h2>
            <p className="mt-1 text-xs text-navy-900/45">Edit any cell, then click Save changes at the top.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-900/10 text-xs uppercase tracking-wide text-navy-900/50">
                  <th className="py-2 pr-3">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="py-2 pr-3">
                      {plan.name}
                    </th>
                  ))}
                  <th className="py-2"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900/10">
                {features.map((feature) => (
                  <tr key={feature.id} className="align-top">
                    <td className="py-2 pr-3">
                      <input
                        className="w-full rounded-lg border border-navy-900/15 px-2 py-1.5 font-medium"
                        value={feature.label}
                        onChange={(e) =>
                          setFeatures((rows) =>
                            rows.map((row) => (row.id === feature.id ? { ...row, label: e.target.value } : row)),
                          )
                        }
                      />
                      <textarea
                        className="mt-1 w-full rounded-lg border border-navy-900/10 px-2 py-1 text-[11px] text-navy-900/60"
                        rows={2}
                        placeholder="Optional note under the pricing table"
                        value={feature.note}
                        onChange={(e) =>
                          setFeatures((rows) =>
                            rows.map((row) => (row.id === feature.id ? { ...row, note: e.target.value } : row)),
                          )
                        }
                      />
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="py-2 pr-3">
                        <textarea
                          className="min-h-[4.5rem] w-full rounded-lg border border-navy-900/15 px-2 py-1.5 text-navy-900/80"
                          value={feature.values[plan.id] ?? ''}
                          onChange={(e) =>
                            setFeatures((rows) =>
                              rows.map((row) =>
                                row.id === feature.id
                                  ? { ...row, values: { ...row.values, [plan.id]: e.target.value } }
                                  : row,
                              ),
                            )
                          }
                        />
                      </td>
                    ))}
                    <td className="py-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          void deleteStaffPlanFeature(feature.id)
                            .then(applyCatalog)
                            .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not remove feature.'))
                        }
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form
            className="mt-4 flex flex-wrap gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              void createStaffPlanFeature({ label: newFeature })
                .then((data) => {
                  setNewFeature('')
                  applyCatalog(data)
                })
                .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not add feature.'))
            }}
          >
            <input
              className="min-w-56 flex-1 rounded-lg border border-navy-900/15 px-3 py-2 text-sm"
              placeholder="New feature name"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
            />
            <Button type="submit">Add feature</Button>
          </form>
        </section>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-navy-900/10 pt-4">
          {dirty && <p className="mr-auto text-sm text-amber-800">Unsaved edits</p>}
          <Button type="button" disabled={!dirty || saving} onClick={() => void saveChanges()}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>
    </AdminPage>
  )
}
