import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { IndustrySelect, LanguagePicker, SelectField } from '../components/ui/Field'
import { isProfileComplete, useAuth } from '../context/AuthContext'
import { ApiError } from '../services/http'
import { findDemoMatch, requestMatch, stopMatching } from '../services/matchService'
import { asLanguageList, NON_BUSINESS_TYPES, type BusinessType, type MatchFilters } from '../types'

const businessTypes: BusinessType[] = [
  'Business Owner',
  'Startup Founder',
  'Aspiring Founder',
  'Co-founder Seeker',
  'Student',
  'Professional',
  'Freelancer',
  'Buyer',
  'Supplier',
  'Service Provider',
  'Manufacturer',
  'Trader',
  'Retailer',
  'Investor',
  'Mentor',
  'Other',
]

export function FindMatchPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const profileReady = isProfileComplete(user.profile)
  const isNonBusiness = NON_BUSINESS_TYPES.has(user.profile.businessType)
  const verified = user.verificationStatus === 'VERIFIED' || isNonBusiness
  const [filters, setFilters] = useState<MatchFilters>({
    businessTypes: [],
    industry: user.profile.industry,
    cityScope: 'anywhere',
    preferredLanguages: asLanguageList(user.profile.preferredLanguages),
    purpose: '',
  })
  const [status, setStatus] = useState<'idle' | 'waiting'>('idle')
  const [waitSeconds, setWaitSeconds] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    if (status !== 'waiting') return
    const tick = setInterval(() => setWaitSeconds((s) => s + 1), 1000)
    return () => clearInterval(tick)
  }, [status])

  async function startMatching() {
    if (!profileReady || !verified) return
    const requestId = ++requestIdRef.current
    setWaitSeconds(0)
    setError(null)
    setStatus('waiting')

    try {
      if (user.id === 'demo') {
        const matched = findDemoMatch(
          {
            industry: filters.industry.trim(),
            businessType: filters.businessTypes[0] ?? '',
            preferredLanguages: filters.preferredLanguages,
            cityScope: filters.cityScope,
          },
          user.profile,
        )
        if (requestIdRef.current !== requestId) return
        if (!matched) {
          setStatus('idle')
          setError('No one online matches your filters right now. Try again or widen your filters.')
          return
        }
        navigate('/call', { state: { matched } })
        return
      }

      const result = await requestMatch({
        industry: filters.industry.trim(),
        businessType: filters.businessTypes[0] ?? '',
        preferredLanguages: filters.preferredLanguages,
        cityScope: filters.cityScope,
      })
      if (requestIdRef.current !== requestId) return
      navigate('/call', {
        state: {
          matched: result.connectedUser,
          user: result.user,
          connectedUser: result.connectedUser,
          session: result.session,
          call: result.call,
        },
      })
    } catch (err) {
      if (requestIdRef.current !== requestId) return
      setStatus('idle')
      setError(err instanceof ApiError ? err.message : 'Could not find a match. Try again.')
    }
  }

  function leaveQueue() {
    requestIdRef.current += 1
    setStatus('idle')
    if (user.id !== 'demo') {
      void stopMatching().catch(() => undefined)
    }
  }

  if (!profileReady || !verified) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
        <h1 className="text-xl font-semibold">Complete setup first</h1>
        <p className="mt-2 text-sm text-navy-900/60">
          {!profileReady
            ? 'Add a profile photo and finish your business profile, then get verified before matching.'
            : 'Get verified to start finding business matches.'}
        </p>
        <Link to={profileReady ? '/profile?step=2' : '/profile'}>
          <Button className="mt-5">{profileReady ? 'Get verified' : 'Complete profile'}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-semibold text-navy-950">Find a business match</h1>
      <p className="mt-1 text-sm text-navy-900/55">
        Filter by industry, location, business type, and language, then start a 1:1 video call.
      </p>

      <div className="mt-6 rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <IndustrySelect
              id="industryFilter"
              label="Industry"
              value={filters.industry}
              emptyLabel="Any industry"
              onChange={(value) => setFilters((f) => ({ ...f, industry: value }))}
            />
          </div>
          <LanguagePicker
            label="Languages"
            values={filters.preferredLanguages}
            onChange={(values) => setFilters((f) => ({ ...f, preferredLanguages: values }))}
          />
          <SelectField
            id="businessTypeFilter"
            label="Business type I want to meet"
            value={filters.businessTypes[0] ?? ''}
            onChange={(e) =>
              setFilters((f) => ({ ...f, businessTypes: e.target.value ? [e.target.value as BusinessType] : [] }))
            }
          >
            <option value="">Any business type</option>
            {businessTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </SelectField>
          <SelectField
            id="cityScope"
            label="Location scope"
            value={filters.cityScope}
            onChange={(e) => setFilters((f) => ({ ...f, cityScope: e.target.value as MatchFilters['cityScope'] }))}
          >
            <option value="same-city">Same city</option>
            <option value="same-state">Same state</option>
            <option value="anywhere">Anywhere</option>
          </SelectField>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {status === 'idle' ? (
          <Button className="mt-6 w-full" onClick={() => void startMatching()}>
            Find a business match
          </Button>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-lg bg-navy-950/5 py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-900/20 border-t-gold-500" />
            <p className="text-sm text-navy-900/70">
              Looking for someone who matches your filters... {waitSeconds}s
            </p>
            <Button variant="secondary" onClick={leaveQueue}>
              Leave queue
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
