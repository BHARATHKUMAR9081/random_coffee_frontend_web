import { useState } from 'react'
import { isFirebaseConfigured, uploadSupportImage, type UploadedImage } from '../../services/firebaseStorage'

export function ScreenshotField({
  folder,
  accountId,
  disabled,
  onUploaded,
}: {
  folder: 'tickets' | 'reports'
  accountId: string
  disabled?: boolean
  onUploaded: (image: UploadedImage | null) => void
}) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const configured = isFirebaseConfigured()

  async function handleFile(file: File | undefined) {
    setError(null)
    if (!file) {
      setFileName(null)
      onUploaded(null)
      return
    }
    if (!configured) {
      setError('Screenshot upload is not configured yet. You can still submit without an image.')
      return
    }
    setUploading(true)
    try {
      const uploaded = await uploadSupportImage(file, folder, accountId)
      setFileName(file.name)
      onUploaded(uploaded)
    } catch (err) {
      setFileName(null)
      onUploaded(null)
      setError(err instanceof Error ? err.message : 'Could not upload that image.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="text-sm font-medium text-navy-900">Screenshot (optional)</label>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={disabled || uploading}
        className="mt-1.5 block w-full text-sm text-navy-900/70 file:mr-3 file:rounded-full file:border-0 file:bg-navy-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
        onChange={(event) => void handleFile(event.target.files?.[0])}
      />
      {uploading && <p className="mt-1 text-xs text-navy-900/50">Uploading…</p>}
      {fileName && !uploading && <p className="mt-1 text-xs text-green-700">Attached {fileName}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {!configured && (
        <p className="mt-1 text-xs text-navy-900/45">Add Firebase keys to enable screenshot upload.</p>
      )}
    </div>
  )
}
