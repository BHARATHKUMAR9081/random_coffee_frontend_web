import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { ApiError } from '../services/http'
import {
  acceptConnection,
  declineConnection,
  sendConnectionRequest,
  type ConnectionRecord,
} from '../services/connectionService'
import { updateMatchSession } from '../services/matchService'
import type { CallOutcomeTag, MatchedProfile, MatchSessionLog } from '../types'

const relevanceOptions = ['Very relevant', 'Somewhat relevant', 'Not relevant'] as const

export function PostCallFeedbackPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { addCallHistoryEntry, user } = useAuth()
  const locationState = location.state as
    | { matched?: MatchedProfile; connectedUser?: MatchedProfile; session?: MatchSessionLog; durationSeconds?: number }
    | null
  const matched = locationState?.connectedUser ?? locationState?.matched
  const session = locationState?.session

  const [tag, setTag] = useState<CallOutcomeTag | null>(null)
  const [relevance, setRelevance] = useState<(typeof relevanceOptions)[number] | null>(null)
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [connectStatus, setConnectStatus] = useState<'idle' | 'sending' | 'sent' | 'incoming' | 'connected' | 'skipped' | 'declined'>('idle')
  const [incoming, setIncoming] = useState<ConnectionRecord | null>(null)
  const [connectError, setConnectError] = useState<string | null>(null)

  function chooseTag(next: CallOutcomeTag) {
    setTag(next)
    if (!matched) return
    addCallHistoryEntry({
      id: session?.id ?? crypto.randomUUID(),
      matchedUserName: matched.name,
      matchedCompanyName: matched.companyName,
      timestamp: new Date().toISOString(),
      outcome: next,
      matchedAccountId: matched.accountId,
      matchSessionId: session?.id,
    })
    if (session?.id) {
      void updateMatchSession(session.id, {
        outcome: next,
        ended: true,
        durationSeconds: locationState?.durationSeconds,
      })
    }
  }

  async function sendRequest() {
    if (!matched?.accountId) {
      setConnectError('This match has no account id, so a request cannot be sent.')
      return
    }
    if (user.id === 'demo') {
      setConnectStatus('sent')
      return
    }
    setConnectStatus('sending')
    setConnectError(null)
    try {
      const row = await sendConnectionRequest(matched.accountId, session?.id)
      if (row.status === 'accepted') {
        setConnectStatus('connected')
        return
      }
      if (row.canAccept) {
        setIncoming(row)
        setConnectStatus('incoming')
        return
      }
      setConnectStatus('sent')
    } catch (err) {
      setConnectStatus('idle')
      setConnectError(err instanceof ApiError ? err.message : 'Could not send the connection request.')
    }
  }

  async function respondToIncoming(action: 'accept' | 'decline') {
    if (!incoming) return
    setConnectStatus('sending')
    setConnectError(null)
    try {
      if (action === 'accept') {
        await acceptConnection(incoming.id)
        setConnectStatus('connected')
      } else {
        await declineConnection(incoming.id)
        setConnectStatus('declined')
      }
    } catch (err) {
      setConnectStatus('incoming')
      setConnectError(err instanceof ApiError ? err.message : 'Could not update this request.')
    }
  }

  function finish() {
    setSubmitted(true)
    const goToConnections = connectStatus === 'sent' || connectStatus === 'connected' || connectStatus === 'incoming'
    setTimeout(() => navigate(goToConnections ? '/connections' : '/dashboard'), 600)
  }

  if (!matched) {
    navigate('/dashboard', { replace: true })
    return null
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-center text-2xl font-semibold text-navy-950">How was that call?</h1>
      <p className="mt-1 text-center text-sm text-navy-900/55">With {matched.name} · {matched.companyName}</p>

      {!tag ? (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => chooseTag('NETWORKED')}
            className="flex flex-col items-center gap-1 rounded-xl bg-green-600 px-4 py-6 text-white shadow-[0_8px_30px_-12px_rgba(10,22,40,0.35)] transition-transform hover:scale-[1.02]"
          >
            <span className="text-lg font-semibold">Networked</span>
            <span className="text-center text-xs text-white/80">Meaningful connection — send a request</span>
          </button>
          <button
            onClick={() => chooseTag('RANDOM')}
            className="flex flex-col items-center gap-1 rounded-xl bg-navy-700 px-4 py-6 text-white shadow-[0_8px_30px_-12px_rgba(10,22,40,0.35)] transition-transform hover:scale-[1.02]"
          >
            <span className="text-lg font-semibold">Random</span>
            <span className="text-center text-xs text-white/80">Casual chat — no follow-up needed</span>
          </button>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
          <p className="text-sm font-medium">
            Marked as <span className="font-semibold">{tag === 'NETWORKED' ? 'Networked' : 'Random'}</span>.
          </p>

          {tag === 'NETWORKED' && (
            <div className="rounded-xl border border-navy-900/10 p-4">
              <p className="text-sm font-medium text-navy-900">Send {matched.name} a connection request?</p>
              <p className="mt-1 text-xs text-navy-900/55">They have to accept before you can chat.</p>
              {connectError && <p className="mt-2 text-sm text-red-600">{connectError}</p>}
              {connectStatus === 'sent' ? (
                <p className="mt-3 text-sm font-medium text-green-700">Request sent. They can accept it from Connections.</p>
              ) : connectStatus === 'connected' ? (
                <p className="mt-3 text-sm font-medium text-green-700">You are connected. Chat is unlocked.</p>
              ) : connectStatus === 'declined' ? (
                <p className="mt-3 text-sm font-medium text-navy-900/70">Request declined.</p>
              ) : connectStatus === 'incoming' ? (
                <div className="mt-3">
                  <p className="text-sm text-navy-900">They already sent you a request. Accept to connect.</p>
                  <div className="mt-3 flex gap-2">
                    <Button onClick={() => void respondToIncoming('accept')}>Accept</Button>
                    <Button variant="secondary" onClick={() => void respondToIncoming('decline')}>
                      Decline
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <Button onClick={() => void sendRequest()} disabled={connectStatus === 'sending'}>
                    {connectStatus === 'sending' ? 'Sending…' : 'Send request'}
                  </Button>
                  <Button variant="secondary" onClick={() => setConnectStatus('skipped')}>
                    Not now
                  </Button>
                </div>
              )}
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-medium text-navy-900">How relevant was this match?</p>
            <div className="flex flex-wrap gap-2">
              {relevanceOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setRelevance(opt)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                    relevance === opt ? 'border-gold-500 bg-gold-500/15' : 'border-navy-900/15 text-navy-900/70'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="min-h-20 w-full resize-y rounded-lg border border-navy-900/15 px-3 py-2 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
            placeholder="Optional written feedback"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button onClick={finish} disabled={submitted}>
            {submitted ? 'Saving...' : 'Done'}
          </Button>
        </div>
      )}
    </div>
  )
}
