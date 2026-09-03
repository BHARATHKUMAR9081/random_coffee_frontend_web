export type BusinessType =
  | 'Startup Founder'
  | 'Manufacturer'
  | 'Trader'
  | 'Retailer'
  | 'Supplier'
  | 'Buyer'
  | 'Service Provider'
  | 'Freelancer'
  | 'Investor'
  | 'Other'

export type ConnectionIntent =
  | 'Customers'
  | 'Suppliers'
  | 'Buyers'
  | 'Business Partners'
  | 'Investors'
  | 'Mentors'
  | 'Service Providers'
  | 'General Networking'

export type VerificationStatus = 'UNVERIFIED' | 'VERIFIED' | 'FAILED'

export interface IdentityVerification {
  status: VerificationStatus
  document_type?: string
  verified_at?: string | null
  similarity?: number | null
  name_on_id?: string
  failed_reason?: string | null
}

export const IDENTITY_DOCUMENT_TYPES = [
  { value: 'passport', label: 'Passport' },
  { value: 'driving_licence', label: 'Driving licence' },
  { value: 'voter_id', label: 'Voter ID' },
] as const

export type IdentityDocumentType = (typeof IDENTITY_DOCUMENT_TYPES)[number]['value']

export interface BusinessProfile {
  firstName: string
  lastName: string
  fullName: string
  profilePhotoUrl: string | null
  mobileNumber: string
  email: string
  companyName: string
  companyWebsite: string
  businessType: BusinessType | ''
  industry: string
  city: string
  state: string
  country: string
  preferredLanguages: string[]
  shortDescription: string
  lookingFor: ConnectionIntent[]
}

export function asLanguageList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()]
  }
  return []
}

export function profileDisplayName(profile: BusinessProfile): string {
  const combined = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim()
  return combined || profile.fullName || ''
}

export const INDUSTRY_PRESETS = [
  'Agriculture & Agribusiness',
  'Automotive',
  'Construction & Real Estate',
  'Education',
  'Electronics',
  'Energy & Utilities',
  'Finance & Insurance',
  'Food & Beverages',
  'Healthcare & Pharma',
  'Hospitality & Travel',
  'IT & Software',
  'Logistics & Supply Chain',
  'Manufacturing',
  'Media & Advertising',
  'Professional Services',
  'Retail & E-commerce',
  'Textiles & Apparel',
  'Trading & Wholesale',
] as const

export function isPresetIndustry(value: string): boolean {
  return (INDUSTRY_PRESETS as readonly string[]).includes(value)
}

export type PlanId = string

export interface BillingInfo {
  id?: string | null
  accountId?: string
  legalName: string
  billingEmail: string
  billingPhone: string
  gstin: string
  gstinVerified?: boolean
  addressLine: string
  city: string
  state: string
  pincode: string
  country: string
  updatedAt?: string | null
}

export interface PlanDefinition {
  id: PlanId
  name: string
  priceLabel: string
  includes: string
}

export const PLANS: PlanDefinition[] = [
  { id: 'free', name: 'Free', priceLabel: '₹0', includes: '50 lifetime introductions' },
  { id: 'basic', name: 'Basic', priceLabel: '₹299 / month', includes: '150 introductions per month' },
  { id: 'pro', name: 'Pro', priceLabel: '₹799 / month', includes: '500 introductions per month' },
]

export interface UserAccount {
  id: string
  profile: BusinessProfile
  verificationStatus: VerificationStatus
  isIdentityVerified: boolean
  identitySelfieUrl: string | null
  identityVerification: IdentityVerification
  businessIdNumber: string | null
  planId: PlanId
}

export interface MatchFilters {
  businessTypes: BusinessType[]
  industry: string
  cityScope: 'same-city' | 'same-state' | 'anywhere'
  preferredLanguages: string[]
  purpose: string
}

export interface MatchedProfile {
  accountId?: string
  firstName?: string
  lastName?: string
  name: string
  email?: string
  companyName: string
  businessType: BusinessType | string
  industry?: string
  city: string
  state?: string
  country?: string
  preferredLanguage?: string
  preferredLanguages?: string[]
  lookingFor?: string | string[]
  shortDescription?: string
  isProfileVerified?: boolean
  isIdentityVerified?: boolean
  profilePhotoUrl?: string | null
}

export interface MatchSessionLog {
  id: string
  status: 'created' | 'in_call' | 'ended' | string
  outcome: string | null
  endedReason: string | null
  roomName: string
  filters: {
    industry?: string
    businessType?: string
    preferredLanguage?: string
    preferredLanguages?: string[]
    cityScope?: string
  }
  matchedAt: string | null
  callStartedAt: string | null
  callEndedAt: string | null
  durationSeconds: number
  requesterId: string
  connectedId: string
}

export type CallOutcomeTag = 'NETWORKED' | 'RANDOM'

export interface CallHistoryEntry {
  id: string
  matchedUserName: string
  matchedCompanyName: string
  timestamp: string
  outcome: CallOutcomeTag
  matchedAccountId?: string
  matchSessionId?: string
  kind?: 'call' | 'connection'
}

export type AccountStatus = 'active' | 'suspended' | 'banned'

export interface AdminUserRow {
  id: string
  fullName: string
  companyName: string
  businessType: BusinessType
  city: string
  verificationStatus: VerificationStatus
  accountStatus: AccountStatus
  joinedAt: string
}

export type ReportReason =
  | 'Inappropriate behaviour'
  | 'Not business-related'
  | 'Spam or scam'
  | 'Harassment'
  | 'Fake identity'
  | 'Other'

export type ReportStatus = 'open' | 'resolved'

export interface ReportEntry {
  id: string
  reporterName: string
  reportedName: string
  reason: ReportReason
  timestamp: string
  status: ReportStatus
}

export interface MatchSessionEntry {
  id: string
  userAName: string
  userBName: string
  timestamp: string
  durationSeconds: number
  outcome: CallOutcomeTag
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  actor: string
  action: string
  target: string
}
