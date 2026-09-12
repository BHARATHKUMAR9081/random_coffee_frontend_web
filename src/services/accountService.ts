import type { MatchedProfile } from '../types'
import { getJson } from './http'

export interface PublicBusinessProfile {
  accountId: string
  firstName: string
  lastName: string
  name: string
  profilePhotoUrl: string | null
  companyName: string
  companyWebsite: string
  businessType: string
  industry: string
  city: string
  state: string
  country: string
  preferredLanguages: string[]
  shortDescription: string
  lookingFor: string[]
  whatIDo: string[]
  isProfileVerified: boolean
  isIdentityVerified?: boolean
}

export interface PublicProfilePreview {
  name?: string
  companyName?: string
  businessType?: string
  industry?: string
  city?: string
  state?: string
  country?: string
  shortDescription?: string
  matchSessionId?: string
}

export function fetchPublicProfile(accountId: string): Promise<{ profile: PublicBusinessProfile }> {
  return getJson(`/api/accounts/${accountId}/`)
}

export function profileFromMatch(user: MatchedProfile): PublicBusinessProfile {
  const languages = user.preferredLanguages?.length
    ? user.preferredLanguages
    : user.preferredLanguage
      ? [user.preferredLanguage]
      : []
  const lookingFor = Array.isArray(user.lookingFor)
    ? user.lookingFor
    : user.lookingFor
      ? [user.lookingFor]
      : []
  return {
    accountId: user.accountId || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    name: user.name,
    profilePhotoUrl: user.profilePhotoUrl ?? null,
    companyName: user.companyName || '',
    companyWebsite: '',
    businessType: user.businessType || '',
    industry: user.industry || '',
    city: user.city || '',
    state: user.state || '',
    country: user.country || '',
    preferredLanguages: languages,
    shortDescription: user.shortDescription || '',
    lookingFor,
    whatIDo: [],
    isProfileVerified: Boolean(user.isProfileVerified),
    isIdentityVerified: Boolean(user.isIdentityVerified),
  }
}
