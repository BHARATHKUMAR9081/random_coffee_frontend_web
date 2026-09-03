import { useRef, useState } from 'react'
import { Avatar } from './Avatar'
import { FieldWrapper } from './Field'
import { prepareProfilePhoto, validateProfilePhoto } from '../../services/profileService'

export function ProfilePhotoField({
  value,
  name,
  uploading,
  disabled,
  onFile,
}: {
  value: string | null
  name: string
  uploading?: boolean
  disabled?: boolean
  onFile: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File | undefined) {
    setError(null)
    if (!file) return
    const message = validateProfilePhoto(file)
    if (message) {
      setError(message)
      return
    }
    try {
      onFile(await prepareProfilePhoto(file))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not use that photo.')
    }
  }

  const blocked = disabled || uploading

  return (
    <FieldWrapper label="Profile photo" htmlFor="profilePhoto" required>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
        <button
          type="button"
          disabled={blocked}
          onClick={() => inputRef.current?.click()}
          className="relative shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-gold-500/40 disabled:opacity-60"
          aria-label={value ? 'Change profile photo' : 'Add profile photo'}
        >
          <Avatar src={value} name={name || 'You'} size="xl" />
          <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-white shadow-sm ring-2 ring-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h3l1.2-2h7.6L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
              <circle cx="12" cy="14" r="3.2" />
            </svg>
          </span>
        </button>
        <div className="min-w-0 w-full text-center sm:flex-1 sm:text-left">
          <input
            ref={inputRef}
            id="profilePhoto"
            type="file"
            accept="image/*"
            disabled={blocked}
            className="sr-only"
            onChange={(event) => {
              void handleFile(event.target.files?.[0])
              event.target.value = ''
            }}
          />
          <button
            type="button"
            disabled={blocked}
            onClick={() => inputRef.current?.click()}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-navy-900 px-4 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60 sm:w-auto"
          >
            {uploading ? 'Uploading…' : value ? 'Change photo' : 'Add photo'}
          </button>
          <p className="mt-1.5 text-xs text-navy-900/45">JPEG, PNG, or WebP. 5MB or smaller.</p>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </FieldWrapper>
  )
}
