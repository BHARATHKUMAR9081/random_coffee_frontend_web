import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { IndustrySelect, LanguagePicker, SelectField } from '../components/ui/Field'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../services/http'
import { findDemoMatch, requestMatch, stopMatching } from '../services/matchService'
import { asLanguageList, type BusinessType, type MatchFilters } from '../types'

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
    return () => {
      requestIdRef.current += 1
    }
  }, [])

  useEffect(() => {
    if (status !== 'waiting') return
    const tick = setInterval(() => setWaitSeconds((s) => s + 1), 1000)
    return () => clearInterval(tick)
  }, [status])

  async function startMatching() {
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

      // Infinite requeue loop: continuously re-fire if backend returns status: 'timeout'
      let consecutiveErrors = 0
      while (requestIdRef.current === requestId) {
        try {
          const result = await requestMatch({
            industry: filters.industry.trim(),
            businessType: filters.businessTypes[0] ?? '',
            preferredLanguages: filters.preferredLanguages,
            cityScope: filters.cityScope,
          })
          if (requestIdRef.current !== requestId) return

          // Reset transient error counter on successful response
          consecutiveErrors = 0

          if ('status' in result && result.status === 'timeout') {
            // Peer not found in this check; pause 1s on client then re-check
            await new Promise((resolve) => setTimeout(resolve, 1000))
            continue
          }

          if ('connectedUser' in result && result.connectedUser) {
            navigate('/call', {
              state: {
                matched: result.connectedUser,
                user: result.user,
                connectedUser: result.connectedUser,
                session: result.session,
                call: result.call,
              },
            })
            return
          }
        } catch (err) {
          if (requestIdRef.current !== requestId) return
          // If server returns a transient error (502/503/504 during deployment or brief network glitch),
          // retry up to 5 times instead of aborting the queue
          consecutiveErrors += 1
          if (consecutiveErrors <= 5 && (err instanceof ApiError && (err.status >= 500 || err.status === 0))) {
            console.warn(`[Matchmaking] Transient server error (${err.status}), retrying (${consecutiveErrors}/5)...`)
            await new Promise((resolve) => setTimeout(resolve, 1500))
            continue
          }
          setStatus('idle')
          setError(err instanceof ApiError ? err.message : 'Could not find a match. Try again.')
          return
        }
      }
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
