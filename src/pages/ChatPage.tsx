import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { VerificationBadges } from '../components/ui/VerificationBadges'
import { ApiError } from '../services/http'
import { fetchConnection, type ConnectionRecord } from '../services/connectionService'
import { listMessages, markConnectionRead, sendMessage, type ChatMessage } from '../services/chatService'
import { createReport } from '../services/reportService'
import { ScreenshotField } from '../components/support/ScreenshotField'
import type { UploadedImage } from '../services/firebaseStorage'
import type { ReportReason } from '../types'

const MAX_MESSAGE_LENGTH = 2000
const reportReasons: ReportReason[] = [
  'Inappropriate behaviour',
  'Not business-related',
  'Spam or scam',
  'Harassment',
  'Fake identity',
  'Other',
]

function formatTime(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
}

export function ChatPage() {
  const { connectionId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [connection, setConnection] = useState<ConnectionRecord | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportImage, setReportImage] = useState<UploadedImage | null>(null)
  const [reportError, setReportError] = useState<string | null>(null)
  const [reporting, setReporting] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const messagesRef = useRef<ChatMessage[]>([])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!connectionId) {
      navigate('/connections', { replace: true })
      return
    }
    const id = connectionId
    if (user.id === 'demo') {
      setLoading(false)
      return
    }

    let cancelled = false

    async function loadThread() {
      try {
        const row = await fetchConnection(id)
        if (cancelled) return
        if (row.status !== 'accepted') {
          setError('Chat unlocks after the connection is accepted.')
          setConnection(row)
          setLoading(false)
          return
        }
        setConnection(row)
        const data = await listMessages(id)
        if (cancelled) return
        setMessages(data.messages)
        setError(null)
        void markConnectionRead(id)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Could not load this chat.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    async function poll() {
      const lastId = messagesRef.current.at(-1)?.id
      try {
        const data = await listMessages(id, lastId)
        if (cancelled || data.messages.length === 0) return
        setMessages((prev) => {
          const known = new Set(prev.map((row) => row.id))
          const incoming = data.messages.filter((row) => !known.has(row.id))
          return incoming.length ? [...prev, ...incoming] : prev
        })
        if (data.messages.some((row) => !row.mine)) {
          void markConnectionRead(id)
        }
      } catch {
        // Keep the open thread; the next poll retries.
      }
    }

    void loadThread()
    const timer = window.setInterval(() => void poll(), 2000)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [connectionId, navigate, user.id])

  async function handleSend(event: React.FormEvent) {
    event.preventDefault()
    if (!connectionId || user.id === 'demo') return
    const body = draft.trim()
    if (!body) return
    setSending(true)
    setError(null)
    try {
      const message = await sendMessage(connectionId, body)
      setMessages((prev) => (prev.some((row) => row.id === message.id) ? prev : [...prev, message]))
      setDraft('')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send that message.')
    } finally {
      setSending(false)
    }
  }

  async function submitChatReport(reason: ReportReason) {
    const reportedId = connection?.otherUser.accountId
    if (!connectionId || !reportedId || user.id === 'demo') {
      setReportError('This chat has no account id to report.')
      return
    }
    setReporting(true)
    setReportError(null)
    try {
      await createReport({
        reportedId,
        reason,
        source: 'chat',
        connectionId,
        imageUrl: reportImage?.imageUrl,
        imagePath: reportImage?.imagePath,
      })
      setReportOpen(false)
    } catch (err) {
      setReportError(err instanceof ApiError ? err.message : 'Could not send the report.')
    } finally {
      setReporting(false)
    }
  }

  const otherName = connection?.otherUser.name || 'this person'

  return (
    <div className="mx-auto flex h-[calc(100dvh-7.5rem)] max-w-2xl flex-col gap-3 sm:h-[calc(100dvh-9rem)] sm:gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {connection && (
            <Avatar
              src={connection.otherUser.profilePhotoUrl}
              name={otherName}
              size="md"
              className="sm:h-16 sm:w-16"
            />
          )}
          <div className="min-w-0">
          <Link to="/connections" className="text-xs text-navy-900/50 hover:text-navy-950">
            Back to connections
          </Link>
          {connection?.otherUser.accountId ? (
            <Link to={`/people/${connection.otherUser.accountId}`} className="block min-w-0 hover:underline">
              <h1 className="mt-1 truncate text-lg font-semibold text-navy-950 sm:text-2xl">{otherName}</h1>
              <p className="truncate text-sm text-navy-900/55">{connection.otherUser.companyName || 'Connected chat'}</p>
              <VerificationBadges
                className="mt-1"
                business={connection.otherUser.isProfileVerified}
                identity={connection.otherUser.isIdentityVerified}
              />
            </Link>
          ) : (
            <>
              <h1 className="mt-1 truncate text-lg font-semibold text-navy-950 sm:text-2xl">{otherName}</h1>
              <p className="truncate text-sm text-navy-900/55">{connection?.otherUser.companyName || 'Connected chat'}</p>
              {connection && (
                <VerificationBadges
                  className="mt-1"
                  business={connection.otherUser.isProfileVerified}
                  identity={connection.otherUser.isIdentityVerified}
                />
              )}
            </>
          )}
          </div>
        </div>
        {connection?.status === 'accepted' && user.id !== 'demo' && (
          <Button variant="secondary" className="shrink-0 !px-3 !py-2 text-xs sm:!px-5 sm:text-sm" onClick={() => setReportOpen(true)}>
            Report
          </Button>
        )}
      </div>

      {user.id === 'demo' && (
        <p className="rounded-2xl border border-navy-900/10 bg-white px-4 py-3 text-sm text-navy-900/70">
          Demo mode does not open real chats. Sign in with an account to message a connection.
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-navy-900/8 bg-white text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)]">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {loading ? (
            <p className="text-sm text-navy-900/50">Loading chat…</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-navy-900/50">No messages yet. Say hello to {otherName}.</p>
          ) : (
            messages.map((row) => (
              <div key={row.id} className={`flex ${row.mine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    row.mine ? 'bg-gold-500 text-navy-950' : 'bg-navy-900/10 text-navy-950'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{row.body}</p>
                  <p className={`mt-1 text-[10px] ${row.mine ? 'text-navy-950/70' : 'text-navy-900/45'}`}>
                    {formatTime(row.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={(event) => void handleSend(event)} className="border-t border-navy-900/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }
              }}
              disabled={user.id === 'demo' || sending || connection?.status !== 'accepted'}
              rows={2}
              maxLength={MAX_MESSAGE_LENGTH}
              placeholder={connection?.status === 'accepted' ? 'Write a message' : 'Chat is locked until they accept'}
              className="min-h-12 w-full resize-none rounded-xl border border-navy-900/15 px-3 py-2 text-base focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30 disabled:bg-navy-900/5 sm:text-sm"
            />
            <Button type="submit" className="shrink-0" disabled={user.id === 'demo' || sending || !draft.trim() || connection?.status !== 'accepted'}>
              {sending ? 'Sending…' : 'Send'}
            </Button>
          </div>
        </form>
      </section>

      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 text-navy-950 shadow-[0_8px_30px_-12px_rgba(10,22,40,0.35)]">
            <h2 className="text-sm font-semibold">Report {otherName}?</h2>
            <p className="mt-1 text-xs text-navy-900/55">This goes to RandomCoffee staff, not into this chat.</p>
            <div className="mt-3">
              <ScreenshotField folder="reports" accountId={user.id} disabled={reporting} onUploaded={setReportImage} />
            </div>
            {reportError && <p className="mt-2 text-sm text-red-600">{reportError}</p>}
            <div className="mt-3 flex flex-col gap-2">
              {reportReasons.map((reason) => (
                <button
                  key={reason}
                  disabled={reporting}
                  onClick={() => void submitChatReport(reason)}
                  className="rounded-lg border border-navy-900/10 px-3 py-2 text-left text-sm hover:border-gold-500 hover:bg-gold-500/10 disabled:opacity-50"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={() => setReportOpen(false)}
              className="mt-3 w-full text-center text-xs text-navy-900/50 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
