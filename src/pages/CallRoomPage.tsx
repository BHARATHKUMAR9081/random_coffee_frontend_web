import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { VerificationBadges } from '../components/ui/VerificationBadges'
import { useAuth } from '../context/AuthContext'
import { checkCallIdentity } from '../services/authService'
import type { MatchCallCredentials } from '../services/matchService'
import { stopMatching, updateMatchSession } from '../services/matchService'
import { createReport } from '../services/reportService'
import { ScreenshotField } from '../components/support/ScreenshotField'
import type { UploadedImage } from '../services/screenshotService'
import { useLiveKitRoom } from '../hooks/useLiveKitRoom'
import { profileDisplayName, type MatchedProfile, type MatchSessionLog } from '../types'

function captureVideoFrame(video: HTMLVideoElement): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return Promise.reject(new Error('Could not capture camera frame.'))
  ctx.drawImage(video, 0, 0)
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not capture camera frame.'))), 'image/jpeg', 0.9)
  })
}

const CALL_DURATION_SECONDS = 120
const WARNING_AT_SECONDS = 15

const reportReasons = ['Inappropriate behaviour', 'Not business-related', 'Spam or scam', 'Harassment', 'Fake identity', 'Other']

function MicIcon({ off }: { off?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" />
      <path d="M19 11a7 7 0 0 1-14 0" />
      <path d="M12 18v3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  )
}

function CameraIcon({ off }: { off?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M15 8.5 21 5v14l-6-3.5" />
      <rect x="3" y="6" width="12" height="12" rx="2" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  )
}

function FlagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M5 3v18" />
      <path d="M5 4h11l-2 4 2 4H5" />
    </svg>
  )
}

function BlockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M5.5 5.5l13 13" />
    </svg>
  )
}

function SkipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M5 5v14l10-7-10-7Z" />
      <path d="M19 5v14" />
    </svg>
  )
}

function EndCallIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 15.5c-3.5 0-6.7-1-9.3-2.6a1.6 1.6 0 0 1-.7-1.8l.7-2.4a1.6 1.6 0 0 1 1.4-1.2c1.2-.1 2.4-.1 3.6 0a1.6 1.6 0 0 1 1.4 1.3l.3 1.6c1.7-.5 3.5-.5 5.2 0l.3-1.6a1.6 1.6 0 0 1 1.4-1.3c1.2-.1 2.4-.1 3.6 0a1.6 1.6 0 0 1 1.4 1.2l.7 2.4a1.6 1.6 0 0 1-.7 1.8c-2.6 1.6-5.8 2.6-9.3 2.6Z" />
    </svg>
  )
}

function ControlButton({
  active,
  danger,
  onClick,
  label,
  children,
}: {
  active?: boolean
  danger?: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
        danger
          ? 'bg-red-500/90 text-white hover:bg-red-500'
          : active
            ? 'bg-white/90 text-navy-950 hover:bg-white'
            : 'bg-white/10 text-white hover:bg-white/20'
      }`}
    >
      {children}
    </button>
  )
}

export function CallRoomPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const locationState = location.state as
    | {
        matched?: MatchedProfile
        user?: MatchedProfile
        connectedUser?: MatchedProfile
        session?: MatchSessionLog
        call?: MatchCallCredentials
      }
    | null
  const matched = locationState?.connectedUser ?? locationState?.matched
  const call = locationState?.call
  const session = locationState?.session

  const [permissionsGranted, setPermissionsGranted] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(CALL_DURATION_SECONDS)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportImage, setReportImage] = useState<UploadedImage | null>(null)
  const [identityWarning, setIdentityWarning] = useState<string | null>(null)
  const identityCheckedRef = useRef(false)

  const displayName = profileDisplayName(user.profile) || 'Demo user'
  const {
    remoteVideoRef,
    localVideoRef,
    remoteAudioRef,
    status,
    error,
    micOn,
    cameraOn,
    remoteConnected,
    toggleMic,
    toggleCamera,
    disconnect,
  } = useLiveKitRoom(permissionsGranted, displayName, call ?? null)

  const hadRemoteConnected = useRef(false)

  useEffect(() => {
    if (!matched) navigate('/match', { replace: true })
  }, [matched, navigate])

  useEffect(() => {
    if (remoteConnected) {
      hadRemoteConnected.current = true
    } else if (hadRemoteConnected.current && status === 'connected') {
      const timer = setTimeout(() => {
        void leaveAndGo('/call/feedback', 'completed')
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [remoteConnected, status])

  useEffect(() => {
    if (!permissionsGranted || status !== 'connected') return
    if (secondsLeft <= 0) {
      void leaveAndGo('/call/feedback', 'completed')
      return
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionsGranted, status, secondsLeft])

  useEffect(() => {
    if (user.id === 'demo' || !user.isIdentityVerified) return
    if (!permissionsGranted || status !== 'connected' || !cameraOn) return
    if (identityCheckedRef.current) return
    identityCheckedRef.current = true
    let cancelled = false

    async function checkIdentity() {
      const video = localVideoRef.current
      if (!video) return
      for (let attempt = 0; attempt < 10 && video.videoWidth < 80; attempt += 1) {
        await new Promise((resolve) => window.setTimeout(resolve, 250))
      }
      if (cancelled || video.videoWidth < 80) return
      try {
        const frame = await captureVideoFrame(video)
        const result = await checkCallIdentity(frame)
        if (cancelled) return
        if (result.checked && !result.matched) {
          setIdentityWarning(result.error || 'This live camera does not match your verified identity selfie. The call stays open.')
        }
      } catch {
        // Do not interrupt the call if the identity check cannot run.
      }
    }

    void checkIdentity()
    return () => {
      cancelled = true
    }
  }, [cameraOn, localVideoRef, permissionsGranted, status, user.id, user.isIdentityVerified])

  async function leaveAndGo(path: string, endedReason: string) {
    const durationSeconds = permissionsGranted ? Math.max(0, CALL_DURATION_SECONDS - secondsLeft) : 0
    if (session?.id) {
      try {
        await updateMatchSession(session.id, { durationSeconds, endedReason, ended: true })
      } catch {
        // Keep hanging up even if the session log update fails.
      }
    }
    if (user.id !== 'demo') {
      void stopMatching().catch(() => undefined)
    }
    await disconnect()
    navigate(
      path,
      path === '/call/feedback'
        ? { state: { matched, user: locationState?.user, connectedUser: matched, session, durationSeconds } }
        : undefined,
    )
  }

  function endCall() {
    void leaveAndGo('/call/feedback', 'completed')
  }

  function nextMatch() {
    void leaveAndGo('/match', 'skipped')
  }

  async function submitReport(reason: string) {
    if (user.id !== 'demo' && matched?.accountId) {
      try {
        await createReport({
          reportedId: matched.accountId,
          reason,
          source: 'call',
          matchSessionId: session?.id,
          imageUrl: reportImage?.imageUrl,
          imagePath: reportImage?.imagePath,
        })
      } catch {
        // Still leave the call even if the report request fails.
      }
    }
    setReportOpen(false)
    void leaveAndGo('/call/feedback', 'reported')
  }

  function blockUser() {
    void leaveAndGo('/call/feedback', 'blocked')
  }

  if (!matched) return null

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  if (!permissionsGranted) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-navy-900/8 bg-white p-6 text-center text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)]">
        <Avatar src={matched.profilePhotoUrl} name={matched.name} size="xl" className="mx-auto" />
        <h1 className="mt-4 text-xl font-semibold">Matched with {matched.name}</h1>
        {matched.shortDescription && (
          <p className="mt-2 text-sm leading-5 text-navy-900/70">{matched.shortDescription}</p>
        )}
        <p className="mt-1 text-sm text-navy-900/60">
          {matched.companyName} · {matched.businessType}
          {matched.industry ? ` · ${matched.industry}` : ''} · {matched.city}
        </p>
        <VerificationBadges className="mt-3 justify-center" business={matched.isProfileVerified} identity={matched.isIdentityVerified} />
        <p className="mt-4 text-sm text-navy-900/70">Allow camera and microphone to join the private video room.</p>
        <p className="mt-2 text-xs text-navy-900/50">Open this call in a second browser window to see live video.</p>
        <div className="mt-6 flex flex-col gap-2">
          <Button className="w-full" onClick={() => setPermissionsGranted(true)}>
            Allow camera & microphone
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => void leaveAndGo('/match', 'cancelled')}>
            Leave call
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <audio ref={remoteAudioRef} autoPlay />

      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy-900 to-navy-950">
        <video
          ref={remoteVideoRef}
          className={`h-full w-full object-cover ${remoteConnected ? 'block' : 'hidden'}`}
          autoPlay
          playsInline
        />
        {!remoteConnected && (
          <div className="flex flex-col items-center gap-2 px-6 text-center text-white/60">
            <Avatar
              src={matched.profilePhotoUrl}
              name={matched.name}
              size="xl"
              fallbackClassName="bg-white/10 text-white"
            />
            <p className="text-sm font-medium text-white">{matched.name}</p>
            {matched.shortDescription && (
              <p className="max-w-sm text-sm leading-5 text-white/70">{matched.shortDescription}</p>
            )}
            <p className="text-sm">
              {status === 'connecting' ? 'Connecting…' : status === 'error' ? error : `Waiting for ${matched.name}…`}
            </p>
            {status === 'error' && (
              <Button className="mt-2" onClick={() => setPermissionsGranted(false)}>
                Try again
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-gradient-to-b from-black/70 to-transparent p-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:p-6">
        <div className="min-w-0 text-white">
          <p className="text-xs uppercase tracking-wide text-white/50">In call with</p>
          <p className="truncate text-sm font-semibold sm:text-lg">
            {matched.name} <span className="font-normal text-white/60">· {matched.companyName}</span>
          </p>
          {matched.shortDescription && (
            <p className="mt-1 line-clamp-2 max-w-xl text-xs leading-4 text-white/70 sm:text-sm sm:leading-5">
              {matched.shortDescription}
            </p>
          )}
          <div className="mt-1 [&_span]:bg-white/15 [&_span]:text-white">
            <VerificationBadges business={matched.isProfileVerified} identity={matched.isIdentityVerified} />
          </div>
        </div>
        <div
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold tabular-nums backdrop-blur-md ${
            secondsLeft <= WARNING_AT_SECONDS ? 'bg-red-500/80 text-white' : 'bg-white/15 text-white'
          }`}
        >
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="absolute right-3 top-[4.75rem] aspect-[3/4] w-16 overflow-hidden rounded-2xl bg-navy-800 text-xs text-white/50 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10 sm:right-4 sm:top-24 sm:w-32">
        <video
          ref={localVideoRef}
          className={`h-full w-full scale-x-[-1] object-cover ${cameraOn ? 'block' : 'hidden'}`}
          autoPlay
          playsInline
          muted
        />
        {!cameraOn && (
          <div className="flex h-full items-center justify-center text-[10px] sm:text-xs">Camera off</div>
        )}
      </div>

      {identityWarning && (
        <p className="absolute left-1/2 top-[5.5rem] w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl bg-amber-400 px-4 py-2 text-center text-sm font-medium text-navy-950 shadow-lg sm:top-28">
          {identityWarning}
        </p>
      )}

      {hadRemoteConnected.current && !remoteConnected && (
        <p className="absolute left-1/2 top-28 w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl bg-navy-800/90 px-4 py-2 text-center text-sm font-medium text-white shadow-lg">
          Partner has left the call. Taking you to feedback…
        </p>
      )}

      {secondsLeft <= WARNING_AT_SECONDS && status === 'connected' && (
        <p className="absolute left-1/2 top-44 w-[min(16rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl bg-red-500/90 px-4 py-1.5 text-center text-sm font-medium text-white shadow-lg sm:top-24 sm:w-auto sm:rounded-full sm:whitespace-nowrap">
          Call ending soon — wrap up your conversation
        </p>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pt-10 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-4 sm:pb-8">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <ControlButton label={micOn ? 'Mute' : 'Unmute'} active={!micOn} onClick={() => void toggleMic()}>
            <MicIcon off={!micOn} />
          </ControlButton>
          <ControlButton label={cameraOn ? 'Camera off' : 'Camera on'} active={!cameraOn} onClick={() => void toggleCamera()}>
            <CameraIcon off={!cameraOn} />
          </ControlButton>
          <ControlButton label="Report" onClick={() => setReportOpen(true)}>
            <FlagIcon />
          </ControlButton>
          <ControlButton label="Block" danger onClick={blockUser}>
            <BlockIcon />
          </ControlButton>
          <button
            onClick={nextMatch}
            className="flex h-11 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:h-12 sm:px-5"
          >
            <SkipIcon />
            Next
          </button>
          <button
            onClick={endCall}
            className="flex h-11 items-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold text-white shadow-[0_4px_20px_-4px_rgba(220,38,38,0.6)] transition-colors hover:bg-red-500 sm:h-12 sm:px-6"
            title="Leave Call"
          >
            <EndCallIcon />
            Leave Call
          </button>
        </div>
      </div>

      {reportOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 text-navy-950 shadow-[0_8px_30px_-12px_rgba(10,22,40,0.35)]">
            <h2 className="text-sm font-semibold">Why are you reporting this call?</h2>
            <div className="mt-3">
              <ScreenshotField folder="reports" accountId={user.id} onUploaded={setReportImage} />
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {reportReasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => void submitReport(reason)}
                  className="rounded-lg border border-navy-900/10 px-3 py-2 text-left text-sm hover:border-gold-500 hover:bg-gold-500/10"
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
