import { NON_BUSINESS_TYPES, profileDisplayName, type BusinessProfile, type VerificationStatus } from '../types'
import { API_URL } from './http'

export const PROFILE_PHOTO_MAX_BYTES = 5 * 1024 * 1024
export const PROFILE_PHOTO_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])

export function validateProfilePhoto(file: File): string | null {
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()
  const allowed =
    PROFILE_PHOTO_TYPES.has(type) ||
    type === 'image/heic' ||
    type === 'image/heif' ||
    type === '' ||
    name.endsWith('.heic') ||
    name.endsWith('.heif') ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.png') ||
    name.endsWith('.webp')
  if (!allowed) return 'Use a JPEG, PNG, or WebP image.'
  if (file.size > PROFILE_PHOTO_MAX_BYTES) return 'Photo must be 5MB or smaller.'
  return null
}

export async function prepareProfilePhoto(file: File): Promise<File> {
  const invalid = validateProfilePhoto(file)
  if (invalid) throw new Error(invalid)
  const type = file.type.toLowerCase()
  if (type === 'image/jpeg' || type === 'image/png' || type === 'image/webp') return file
  if (type === 'image/jpg') return new File([file], file.name, { type: 'image/jpeg' })

  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('Could not process that photo.')
  }
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9))
  if (!blob) throw new Error('Could not process that photo.')
  if (blob.size > PROFILE_PHOTO_MAX_BYTES) throw new Error('Photo must be 5MB or smaller.')
  return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })
}

export async function prepareIdentityImage(file: File): Promise<File> {
  const prepared = await prepareProfilePhoto(file)
  if (prepared.type === 'image/jpeg' || prepared.type === 'image/png') return prepared
  const bitmap = await createImageBitmap(prepared)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('Could not process that photo.')
  }
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
  if (!blob) throw new Error('Could not process that photo.')
  if (blob.size > PROFILE_PHOTO_MAX_BYTES) throw new Error('Photo must be 5MB or smaller.')
  return new File([blob], prepared.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })
}

export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url
  }
  let path = url.startsWith('/') ? url : `/${url}`
  if (API_URL.endsWith('/api') && path.startsWith('/api/')) {
    path = path.slice(4)
  } else if (!API_URL.endsWith('/api') && !path.startsWith('/api/')) {
    path = `/api${path}`
  }
  return `${API_URL}${path}`
}

export const emptyProfile: BusinessProfile = {
  firstName: '',
  lastName: '',
  fullName: '',
  profilePhotoUrl: null,
  mobileNumber: '',
  email: '',
  companyName: '',
  companyWebsite: '',
  businessType: '',
  industry: '',
  city: '',
  state: '',
  country: 'India',
  preferredLanguages: ['English'],
  shortDescription: '',
  lookingFor: [],
}

export const SHORT_DESCRIPTION_MIN = 50

export function isShortDescriptionValid(value: string): boolean {
  return value.trim().length >= SHORT_DESCRIPTION_MIN
}

export function isProfileComplete(profile: BusinessProfile): boolean {
  const name = profileDisplayName(profile)
  const isNonBusiness = NON_BUSINESS_TYPES.has(profile.businessType)
  const companyValid = isNonBusiness ? true : Boolean(profile.companyName)
  return Boolean(
    name &&
      profile.mobileNumber &&
      profile.email &&
      profile.businessType &&
      companyValid &&
      profile.industry &&
      profile.city &&
      isShortDescriptionValid(profile.shortDescription) &&
      profile.lookingFor.length > 0 &&
      profile.profilePhotoUrl,
  )
}

export function computeCompletionPercent(profile: BusinessProfile): number {
  const nameFilled = profileDisplayName(profile) ? 1 : 0
  const isNonBusiness = NON_BUSINESS_TYPES.has(profile.businessType)
  const fields: (keyof BusinessProfile)[] = [
    'mobileNumber',
    'email',
    ...(isNonBusiness ? [] : (['companyName'] as (keyof BusinessProfile)[])),
    'businessType',
    'industry',
    'city',
    'preferredLanguages',
    'shortDescription',
    'profilePhotoUrl',
  ]
  const filled =
    fields.filter((f) => {
      const value = profile[f]
      return Array.isArray(value) ? value.length > 0 : Boolean(value)
    }).length + nameFilled
  const lookingForFilled = profile.lookingFor.length > 0 ? 1 : 0
  return Math.round(((filled + lookingForFilled) / (fields.length + 2)) * 100)
}

export function composeFullName(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`.trim()
}

export function verifyBusinessId(businessIdNumber: string): { success: boolean; status: VerificationStatus } {
  const looksValid = businessIdNumber.trim().length >= 8
  return { success: looksValid, status: looksValid ? 'VERIFIED' : 'UNVERIFIED' }
}
