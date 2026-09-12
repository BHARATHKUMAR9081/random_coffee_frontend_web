import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, isProfileComplete } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { VerificationBadges } from '../components/ui/VerificationBadges'
import { ApiError } from '../services/http'
import { acceptConnection, listConnections, sendConnectionRequest, type ConnectionRecord } from '../services/connectionService'
import { fetchMatchSession, listMatchSessions } from '../services/matchService'
import { listTickets, type SupportTicket } from '../services/ticketService'
import { listUsageLog, type UsageSummary } from '../services/authService'
import { PLANS, profileDisplayName, type CallHistoryEntry, type CallOutcomeTag } from '../types'

function timeLabel(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
}

function asOutcome(value: string | null | undefined): CallOutcomeTag {
  return value === 'NETWORKED' ? 'NETWORKED' : 'RANDOM'
}

function activityKey(entry: CallHistoryEntry) {
  return entry.matchedAccountId || entry.matchSessionId || entry.id
}

function matchingActivityKey(rows: Map<string, CallHistoryEntry>, entry: CallHistoryEntry) {
  for (const [key, existing] of rows) {
    if (entry.matchedAccountId && existing.matchedAccountId === entry.matchedAccountId) return key
    if (entry.matchSessionId && (existing.matchSessionId === entry.matchSessionId || existing.id === entry.matchSessionId)) {
      return key
    }
    if (existing.matchSessionId && existing.matchSessionId === entry.id) return key
    if (existing.id === entry.id) return key
  }
  return activityKey(entry)
}

function mergeRecentActivity(
  local: CallHistoryEntry[],
  remote: CallHistoryEntry[],
  inbox: ConnectionRecord[],
): CallHistoryEntry[] {
  const byKey = new Map<string, CallHistoryEntry>()

  for (const entry of remote) {
    byKey.set(activityKey(entry), entry)
  }

  for (const entry of local) {
    const key = matchingActivityKey(byKey, entry)
    const existing = byKey.get(key)
    byKey.set(key, existing ? { ...existing, ...entry, kind: existing.kind || entry.kind || 'call' } : entry)
  }

  for (const row of inbox) {
    const accountId = row.otherUser.accountId
    if (!accountId) continue
    const already = [...byKey.values()].some((entry) => entry.matchedAccountId === accountId)
    if (already) continue
    byKey.set(accountId, {
      id: row.matchSessionId || row.id,
      matchedUserName: row.otherUser.name || 'Unknown',
      matchedCompanyName: row.otherUser.companyName || '',
      timestamp: row.updatedAt || row.createdAt || new Date().toISOString(),
      outcome: row.status === 'accepted' ? 'NETWORKED' : 'RANDOM',
      matchedAccountId: accountId,
      matchSessionId: row.matchSessionId || undefined,
      kind: 'connection',
    })
  }

  return [...byKey.values()].sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''))
}

function connectionForActivity(entry: CallHistoryEntry, inbox: ConnectionRecord[]) {
  if (entry.matchedAccountId) {
    const byId = inbox.find((row) => row.otherUser.accountId === entry.matchedAccountId)
    if (byId) return byId
  }
  const name = entry.matchedUserName.trim().toLowerCase()
  return inbox.find((row) => (row.otherUser.name || '').trim().toLowerCase() === name)
}

export function DashboardPage() {
  const { user, profileCompletionPercent, callHistory } = useAuth()
  const currentPlan = PLANS.find((p) => p.id === user.planId) ?? PLANS[0]
  const displayName = profileDisplayName(user.profile) || 'Your profile'
  const profileReady = isProfileComplete(user.profile)
  const verified = user.verificationStatus === 'VERIFIED'
  // Temporarily allow any user to enter matchmaking queue for MVP testing
  const canMatch = true
  const [inbox, setInbox] = useState<ConnectionRecord[]>([])
  const [inboxError, setInboxError] = useState<string | null>(null)
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [connectError, setConnectError] = useState<string | null>(null)
  const [resolvedAccountIds, setResolvedAccountIds] = useState<Record<string, string>>({})
  const [remoteActivity, setRemoteActivity] = useState<CallHistoryEntry[]>([])
  const [usage, setUsage] = useState<UsageSummary | null>(
    user.id === 'demo'
      ? { creditsRemaining: 50, creditsLimit: 50, creditsPeriod: 'lifetime', periodStart: null, connectionCost: 1, receiverCost: 1 }
      : null,
  )

  async function refreshConnections() {
    if (user.id === 'demo') {
      setInbox([])
      return
    }
    const data = await listConnections()
    setInbox(data.connections)
    setInboxError(null)
  }

  async function refreshUsage() {
    if (user.id === 'demo') return
    const data = await listUsageLog()
    setUsage(data.usage)
  }

  useEffect(() => {
    if (user.id === 'demo') {
      setInbox([])
      setTickets([])
      setRemoteActivity([])
      return
    }
    void refreshConnections().catch((err) => {
      setInboxError(err instanceof ApiError ? err.message : 'Could not load messages.')
    })
    void listUsageLog()
      .then((data) => setUsage(data.usage))
      .catch(() => undefined)
    void listTickets()
      .then((data) => setTickets(data.tickets))
      .catch(() => undefined)
    void listMatchSessions()
      .then((data) => {
        setRemoteActivity(
          data.sessions.map((row) => {
            const other = row.otherUser || row.connectedUser || row.user
            return {
              id: row.session.id,
              matchedUserName: other?.name || 'Unknown',
              matchedCompanyName: other?.companyName || '',
              timestamp: row.session.callEndedAt || row.session.matchedAt || new Date().toISOString(),
              outcome: asOutcome(row.session.outcome),
              matchedAccountId: other?.accountId,
              matchSessionId: row.session.id,
              kind: 'call' as const,
            }
          }),
        )
      })
      .catch(() => undefined)

    const timer = window.setInterval(() => {
      void refreshConnections().catch(() => undefined)
    }, 10000)
    return () => window.clearInterval(timer)
  }, [user.id])

  useEffect(() => {
    if (user.id === 'demo') return
    const missing = callHistory.filter((entry) => !entry.matchedAccountId && !resolvedAccountIds[entry.id])
    missing.forEach((entry) => {
      void fetchMatchSession(entry.id)
        .then((result) => {
          const accountId = result.connectedUser?.accountId
          if (!accountId) return
          setResolvedAccountIds((prev) => ({ ...prev, [entry.id]: accountId }))
        })
        .catch(() => undefined)
    })
  }, [callHistory, resolvedAccountIds, user.id])

  async function requestConnect(entry: CallHistoryEntry) {
    const accountId =
      entry.matchedAccountId ||
      resolvedAccountIds[entry.id] ||
      connectionForActivity(entry, inbox)?.otherUser.accountId
    if (!accountId) {
      setConnectError('This activity has no account id, so a request cannot be sent.')
      return
    }
    setBusyId(entry.id)
    setConnectError(null)
    try {
      if (user.id === 'demo') return
      await sendConnectionRequest(accountId, entry.matchSessionId)
      await Promise.all([refreshConnections(), refreshUsage()])
    } catch (err) {
      setConnectError(err instanceof ApiError ? err.message : 'Could not send the connection request.')
    } finally {
      setBusyId(null)
    }
  }

  async function acceptIncoming(connectionId: string, entryId: string) {
    setBusyId(entryId)
    setConnectError(null)
    try {
      await acceptConnection(connectionId)
      await Promise.all([refreshConnections(), refreshUsage()])
    } catch (err) {
      setConnectError(err instanceof ApiError ? err.message : 'Could not accept this request.')
    } finally {
      setBusyId(null)
    }
  }

  const messages = inbox
    .filter((row) => row.status === 'accepted')
    .sort((a, b) => (b.lastMessageAt || b.updatedAt || '').localeCompare(a.lastMessageAt || a.updatedAt || ''))
  const pendingIncoming = inbox.filter((row) => row.status === 'pending' && row.direction === 'received')
  const recentActivity = mergeRecentActivity(callHistory, remoteActivity, inbox)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_minmax(0,1fr)_300px] lg:items-start">
      <aside className="flex flex-col gap-4 lg:sticky lg:top-4">
        <div className="overflow-hidden rounded-2xl border border-navy-900/8 bg-white text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)]">
          <div className="h-16 bg-gradient-to-r from-gold-300 to-gold-500" />
          <div className="-mt-8 flex flex-col items-center px-4 pb-5">
            <Avatar
              src={user.profile.profilePhotoUrl}
              name={displayName}
              size="lg"
              className="border-4 border-white"
            />
            <Link to="/profile" className="mt-3 text-center">
              <p className="font-semibold hover:underline">{displayName}</p>
              <p className="mt-0.5 text-xs text-navy-900/55">{user.profile.companyName || 'Add your company'}</p>
            </Link>
            <p className="mt-1 text-center text-[11px] text-navy-900/45">
              {[user.profile.city, user.profile.state].filter(Boolean).join(', ') || 'Add your city'}
            </p>
            <VerificationBadges className="mt-2 justify-center" business={verified} identity={user.isIdentityVerified} />
          </div>
          <div className="border-t border-navy-900/10 px-4 py-3">
            <div className="mb-1 flex justify-between text-[11px] text-navy-900/55">
              <span>Profile strength</span>
              <span>{profileCompletionPercent}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-navy-900/10">
              <div className="h-full bg-gold-500" style={{ width: `${profileCompletionPercent}%` }} />
            </div>
            <Link to={profileReady ? '/profile?step=1' : '/profile'} className="mt-3 block text-xs font-semibold text-gold-600 hover:underline">
              {profileReady ? 'Edit profile' : 'Complete profile'}
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)]">
          <p className="text-xs font-semibold text-navy-900">Plan</p>
          <p className="mt-1 text-sm text-navy-900/65">
            {currentPlan.name} · {currentPlan.priceLabel}
          </p>
          {usage && (
            <p className="mt-2 text-xs text-navy-900/55">
              {usage.creditsRemaining} / {usage.creditsLimit} introductions left
              {usage.creditsPeriod === 'month' ? ' this month' : ''}
            </p>
          )}
          <Link to="/pricing" className="mt-2 inline-block text-xs font-semibold text-gold-600 hover:underline">
            Manage plan
          </Link>
        </div>
      </aside>

      <section className="flex flex-col gap-4">
        {(!profileReady || !verified) && (
          <div className="rounded-2xl border border-gold-500/35 bg-gold-500/10 p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-navy-950">Finish setting up your account</h2>
            <p className="mt-1 text-sm text-navy-900/65">
              {!profileReady
                ? 'Add a profile photo and finish your business details, then get verified to start matching.'
                : 'Get verified to unlock Find a business match.'}
            </p>
            <div className="mt-4">
              <Link to={profileReady ? '/profile?step=2' : '/profile'} className="block sm:inline-block">
                <Button className="w-full sm:w-auto">{profileReady ? 'Get verified' : 'Complete profile'}</Button>
              </Link>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-5">
          <h1 className="text-lg font-semibold">Start a conversation</h1>
          <p className="mt-1 text-sm text-navy-900/60">
            Match with another verified business, then send a connect request to unlock chat.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {canMatch ? (
              <Link to="/match" className="sm:w-auto">
                <Button className="w-full">Find a business match</Button>
              </Link>
            ) : (
              <Button className="w-full sm:w-auto" disabled title="Complete your profile and get verified first">
                Find a business match
              </Button>
            )}
            <Link to="/connections" className="sm:w-auto">
              <Button className="w-full" variant="secondary">Connections</Button>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-5">
          <h2 className="text-sm font-semibold text-navy-900">Recent activity</h2>
          {recentActivity.length === 0 ? (
            <p className="mt-2 text-sm text-navy-900/50">No calls or connections yet. Complete a match or send a request.</p>
          ) : (
            <ul className="mt-3 divide-y divide-navy-900/10">
              {recentActivity.map((entry) => {
                const connection = connectionForActivity(entry, inbox)
                const accepted = connection?.status === 'accepted'
                const pendingSent = connection?.status === 'pending' && connection.direction === 'sent'
                const pendingReceived = connection?.canAccept
                const accountId =
                  entry.matchedAccountId ||
                  resolvedAccountIds[entry.id] ||
                  connection?.otherUser.accountId
                const canRequest = Boolean(accountId)
                const profileTo = `/people/${accountId || entry.id}`
                const profileState = {
                  preview: {
                    name: entry.matchedUserName,
                    companyName: entry.matchedCompanyName,
                    matchSessionId: entry.matchSessionId || entry.id,
                  },
                }
                return (
                  <li key={entry.id} className="flex flex-col gap-2 py-2.5 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
                    <Link to={profileTo} state={profileState} className="min-w-0 hover:underline">
                      <p className="font-medium">{entry.matchedUserName}</p>
                      <p className="text-xs text-navy-900/50">{entry.matchedCompanyName}</p>
                    </Link>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          entry.outcome === 'NETWORKED' ? 'bg-green-100 text-green-700' : 'bg-navy-900/10 text-navy-900/60'
                        }`}
                      >
                        {entry.outcome === 'NETWORKED' ? 'Networked' : entry.kind === 'connection' ? 'Connect' : 'Random'}
                      </span>
                      {accepted ? (
                        <Link to={`/connections/${connection.id}`}>
                          <Button size="sm">Open chat</Button>
                        </Link>
                      ) : pendingReceived ? (
                        <Button
                          size="sm"
                          disabled={busyId === entry.id}
                          onClick={() => void acceptIncoming(connection.id, entry.id)}
                        >
                          {busyId === entry.id ? 'Saving…' : 'Accept request'}
                        </Button>
                      ) : pendingSent ? (
                        <span className="rounded-full bg-navy-900/10 px-2.5 py-0.5 text-xs font-semibold text-navy-900/60">
                          Requested
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          disabled={busyId === entry.id || !canRequest || user.id === 'demo'}
                          title={!canRequest ? 'This match has no account id' : undefined}
                          onClick={() => void requestConnect(entry)}
                        >
                          {busyId === entry.id ? 'Sending…' : 'Connect request'}
                        </Button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          {connectError && <p className="mt-2 text-xs text-red-600">{connectError}</p>}
        </div>
      </section>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-4">
        <div className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-navy-900">Messaging</h2>
            <Link to="/connections" className="text-[11px] font-semibold text-gold-600 hover:underline">
              See all
            </Link>
          </div>
          {user.id === 'demo' ? (
            <p className="mt-3 text-xs text-navy-900/50">Sign in with a real account to see chats here.</p>
          ) : inboxError ? (
            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="text-xs text-red-600">{inboxError}</p>
              <button
                type="button"
                onClick={() => void refreshConnections().catch(() => undefined)}
                className="text-xs font-semibold text-gold-600 hover:underline"
              >
                Retry
              </button>
            </div>
          ) : messages.length === 0 ? (
            <p className="mt-3 text-xs text-navy-900/50">No chats yet. Accept a connection to start messaging.</p>
          ) : (
            <ul className="mt-3 divide-y divide-navy-900/10">
              {messages.slice(0, 8).map((row) => (
                <li key={row.id}>
                  <Link to={`/connections/${row.id}`} className="flex items-start gap-2 py-2.5 hover:bg-navy-900/[0.03]">
                    <Avatar
                      src={row.otherUser.profilePhotoUrl}
                      name={row.otherUser.name || 'Unknown'}
                      size="sm"
                      fallbackClassName="bg-navy-900 text-white"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{row.otherUser.name || 'Unknown'}</p>
                        {(row.unreadCount ?? 0) > 0 && (
                          <span className="rounded-full bg-gold-500 px-1.5 text-[10px] font-semibold text-navy-950">
                            {row.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-navy-900/50">{row.lastMessagePreview || 'Say hello'}</p>
                      {row.lastMessageAt && <p className="mt-0.5 text-[10px] text-navy-900/35">{timeLabel(row.lastMessageAt)}</p>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-navy-900">Support tickets</h2>
            <Link to="/help" className="text-[11px] font-semibold text-gold-600 hover:underline">
              Open support
            </Link>
          </div>
          {user.id === 'demo' ? (
            <p className="mt-3 text-xs text-navy-900/50">Sign in with a real account to file tickets.</p>
          ) : tickets.length === 0 ? (
            <p className="mt-3 text-xs text-navy-900/50">No tickets yet. Ask RandomCoffee from Support.</p>
          ) : (
            <ul className="mt-3 divide-y divide-navy-900/10">
              {tickets.slice(0, 4).map((row) => (
                <li key={row.id}>
                  <Link to={`/help/${row.id}`} className="block py-2 hover:bg-navy-900/[0.03]">
                    <p className="truncate text-sm font-medium">{row.subject}</p>
                    <p className="text-[11px] capitalize text-navy-900/50">{row.status.replaceAll('_', ' ')}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {pendingIncoming.length > 0 && (
          <div className="rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)]">
            <h2 className="text-sm font-semibold text-navy-900">Invitations</h2>
            <p className="mt-1 text-xs text-navy-900/55">
              {pendingIncoming.length} connection request{pendingIncoming.length === 1 ? '' : 's'} waiting.
            </p>
            <Link to="/connections" className="mt-2 inline-block text-xs font-semibold text-gold-600 hover:underline">
              Review requests
            </Link>
          </div>
        )}
      </aside>
    </div>
  )
}
