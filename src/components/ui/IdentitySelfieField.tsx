import { useEffect, useRef, useState } from 'react'
import { Avatar } from './Avatar'
import { FieldWrapper } from './Field'
import { resolveMediaUrl } from '../../services/profileService'

export function IdentitySelfieField({
  storedUrl,
  captured,
  disabled,
  onCapture,
}: {
  storedUrl?: string | null
  captured: File | null
  disabled?: boolean
  onCapture: (file: File) => void
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!captured) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(captured)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [captured])

  useEffect(() => {
    return () => stopCamera()
  }, [])

  useEffect(() => {
    if (!cameraOn || !videoRef.current || !streamRef.current) return
    videoRef.current.srcObject = streamRef.current
    void videoRef.current.play().catch(() => undefined)
  }, [cameraOn])

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setCameraOn(false)
  }

  async function startCamera() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      setCameraOn(true)
    } catch {
      setError('Allow camera access to take a live identity selfie. Gallery photos are not accepted.')
    }
  }

  async function capture() {
    const video = videoRef.current
    if (!video || video.videoWidth < 80) {
      setError('Wait until the camera preview is ready, then capture.')
      return
    }
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setError('Could not capture that selfie.')
      return
    }
    ctx.drawImage(video, 0, 0)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
    if (!blob) {
      setError('Could not capture that selfie.')
      return
    }
    onCapture(new File([blob], 'identity-selfie.jpg', { type: 'image/jpeg' }))
    stopCamera()
  }

  const shown = preview || resolveMediaUrl(storedUrl) || null

  return (
    <FieldWrapper label="Live identity selfie" htmlFor="identitySelfie" required>
      <div className="flex flex-col items-start gap-3">
        <div className="relative h-40 w-40 overflow-hidden rounded-2xl bg-navy-950/5 ring-1 ring-navy-900/10">
          {cameraOn ? (
            <video ref={videoRef} className="h-full w-full scale-x-[-1] object-cover" autoPlay playsInline muted />
          ) : shown ? (
            <img src={shown} alt="Identity selfie" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Avatar name="ID" size="lg" fallbackClassName="bg-navy-900/10 text-navy-900/40" />
            </div>
          )}
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap">
          {cameraOn ? (
            <>
              <button
                type="button"
                disabled={disabled}
                onClick={() => void capture()}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-navy-900 px-4 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
              >
                Capture selfie
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={stopCamera}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-navy-900/15 px-4 text-sm font-semibold text-navy-900 hover:bg-navy-950/[0.04] disabled:opacity-60"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={disabled}
              onClick={() => void startCamera()}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-navy-900 px-4 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
            >
              {shown ? 'Retake live selfie' : 'Open camera'}
            </button>
          )}
        </div>
        <p className="text-xs text-navy-900/45">
          This is stored separately from your profile photo and used later to confirm you at the start of a call.
        </p>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </FieldWrapper>
  )
}
