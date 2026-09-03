import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { VerificationBadges } from '../components/ui/VerificationBadges'
import { ApiError } from '../services/http'
import {
  acceptConnection,
  listConnections,
  sendConnectionRequest,
  type ConnectionRecord,
} from '../services/connectionService'
import {
  fetchPublicProfile,
  profileFromMatch,
  type PublicBusinessProfile,
  type PublicProfilePreview,
} from '../services/accountService'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function websiteHref(raw: string) {
  if (!raw.trim()) return ''
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
}

function Fact({ label, value }: { label: string; value?: string | string[] | null }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  const text = Array.isArray(value) ? value.join(', ') : value
  if (!text.trim()) return null
  return (
    <div className="rounded-xl border border-navy-900/8 bg-cream-50 px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-900/45">{label}</p>
      <p className="mt-0.5 text-sm text-navy-950">{text}</p>
    </div>
  )
}

export function BusinessProfilePage() {
  const { accountId = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, callHistory } = useAuth()
  const preview = (location.state as { preview?: PublicProfilePreview } | null)?.preview
  const [profile, setProfile] = useState<PublicBusinessProfile | null>(null)
  const [connection, setConnection] = useState<ConnectionRecord | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const historyEntry = useMemo(
    () =>
      callHistory.find(
        (entry) => entry.id === accountId || entry.matchedAccountId === accountId,
      ),
    [accountId, callHistory],
  )

  useEffect(() => {
    let cancelled = false

    function fromPreview(): PublicBusinessProfile {
      return {
        accountId,
        firstName: '',
        lastName: '',
        name: preview?.name || historyEntry?.matchedUserName || 'Business profile',
        profilePhotoUrl: null,
        companyName: preview?.companyName || historyEntry?.matchedCompanyName || '',
        companyWebsite: '',
        businessType: preview?.businessType || '',
        industry: preview?.industry || '',
        city: preview?.city || '',
        state: preview?.state || '',
        country: preview?.country || '',
        preferredLanguages: [],
        shortDescription: preview?.shortDescription || '',
        lookingFor: [],
        whatIDo: [],
        isProfileVerified: false,
        isIdentityVerified: false,
      }
    }

    async function load() {
      setLoading(true)
      setError(null)
      try {
        if (user.id !== 'demo' && UUID_RE.test(accountId)) {
          const data = await fetchPublicProfile(accountId)
          if (!cancelled) setProfile(data.profile)
        } else if (preview || historyEntry) {
          if (!cancelled) setProfile(fromPreview())
        } else if (!cancelled) {
          setProfile(null)
          setError('This business profile is not available.')
        }
      } catch (err) {
        if (cancelled) return
        if (preview || historyEntry) setProfile(fromPreview())
        else setError(err instanceof ApiError ? err.message : 'Could not load this business profile.')
      }

      if (user.id !== 'demo') {
        try {
          const inbox = await listConnections()
          if (cancelled) return
          const match = inbox.connections.find((row) => row.otherUser.accountId === accountId)
          setConnection(match ?? null)
          if (match && !UUID_RE.test(accountId)) setProfile(profileFromMatch(match.otherUser))
        } catch {
          /* profile can still render without connection actions */
        }
      }
      if (!cancelled) setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [accountId, historyEntry, preview, user.id])

  const isOwn = accountId === user.id
  const locationLabel = [profile?.city, profile?.state, profile?.country].filter(Boolean).join(', ')
  const website = websiteHref(profile?.companyWebsite || '')

  async function refreshConnection() {
    const inbox = await listConnections()
    setConnection(inbox.connections.find((row) => row.otherUser.accountId === accountId) ?? null)
  }

  async function requestConnect() {
    if (!accountId || user.id === 'demo') return
    setBusy(true)
    setError(null)
    try {
      await sendConnectionRequest(accountId, historyEntry?.matchSessionId || preview?.matchSessionId)
      await refreshConnection()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send the connection request.')
    } finally {
      setBusy(false)
    }
  }

  async function acceptIncoming() {
    if (!connection) return
    setBusy(true)
    setError(null)
    try {
      await acceptConnection(connection.id)
      await refreshConnection()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not accept this request.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-navy-900/55 hover:text-navy-950"
      >
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
          <path
            d="M16 10H5.5M10 5.5 5 10l5 4.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </button>

      {loading ? (
        <p className="mt-6 text-sm text-navy-900/50">Loading business profile…</p>
      ) : !profile ? (
        <p className="mt-6 text-sm text-red-600">{error || 'This business profile was not found.'}</p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-navy-900/8 bg-white text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)]">
          <div className="h-20 bg-gradient-to-r from-gold-300 to-gold-500" />
          <div className="-mt-10 px-4 pb-6 sm:px-6">
            <Avatar
              src={profile.profilePhotoUrl}
              name={profile.name || profile.companyName || 'RC'}
              size="xl"
              className="border-4 border-white"
              fallbackClassName="bg-navy-900 text-white"
            />

            <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold sm:text-2xl">{profile.name || 'Business profile'}</h1>
                <p className="mt-0.5 text-sm text-navy-900/60">
                  {profile.companyName || 'Company not added yet'}
                  {profile.businessType ? ` · ${profile.businessType}` : ''}
                </p>
                {locationLabel && <p className="mt-1 text-xs text-navy-900/45">{locationLabel}</p>}
              </div>
              <VerificationBadges business={profile.isProfileVerified} identity={profile.isIdentityVerified} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {isOwn ? (
                <Link to="/profile?step=1">
                  <Button>Edit your profile</Button>
                </Link>
              ) : connection?.status === 'accepted' ? (
                <Link to={`/connections/${connection.id}`}>
                  <Button>Open chat</Button>
                </Link>
              ) : connection?.canAccept ? (
                <Button disabled={busy} onClick={() => void acceptIncoming()}>
                  {busy ? 'Saving…' : 'Accept request'}
                </Button>
              ) : connection?.status === 'pending' ? (
                <span className="rounded-full bg-navy-900/10 px-3 py-2 text-xs font-semibold text-navy-900/60">
                  Requested
                </span>
              ) : user.id === 'demo' ? (
                <p className="text-xs text-navy-900/50">Sign in with a real account to connect.</p>
              ) : (
                <Button disabled={busy || !UUID_RE.test(accountId)} onClick={() => void requestConnect()}>
                  {busy ? 'Sending…' : 'Connect request'}
                </Button>
              )}
            </div>
            {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

            {profile.shortDescription && (
              <section className="mt-6">
                <h2 className="text-sm font-semibold text-navy-900">About</h2>
                <p className="mt-1 text-sm leading-6 text-navy-900/70">{profile.shortDescription}</p>
              </section>
            )}

            <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Fact label="Industry" value={profile.industry} />
              <Fact label="Business type" value={profile.businessType} />
              <Fact label="Languages" value={profile.preferredLanguages} />
              <Fact label="Looking for" value={profile.lookingFor} />
              <Fact label="What they do" value={profile.whatIDo} />
              {website && (
                <div className="rounded-xl border border-navy-900/8 bg-cream-50 px-3 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-900/45">Website</p>
                  <a href={website} target="_blank" rel="noreferrer" className="mt-0.5 block truncate text-sm text-gold-600 hover:underline">
                    {profile.companyWebsite}
                  </a>
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
