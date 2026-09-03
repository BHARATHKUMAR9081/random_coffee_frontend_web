import type { BillingInfo, BusinessProfile, IdentityDocumentType, IdentityVerification, PlanId, VerificationStatus } from '../types'
import { getJson, patchJson, postForm, postJson, putJson } from './http'
import { toQuery, type ListQuery, type PageMeta } from './paging'

export interface SessionAccount {
  id: string
  firstName: string
  lastName: string
  email: string
  plan: { id: PlanId; started_at: string | null }
  isActive: boolean
  isLogin: boolean
  lastLogin: string | null
  isAvailable: boolean
  termsAccepted: boolean
  refundPolicyAccepted: boolean
  privacyPolicyAccepted: boolean
  createdAt: string | null
}

export interface SessionVerification {
  id_type: string
  id_number: string
  status: VerificationStatus
  verified_at: string | null
  gst?: {
    gstin: string
    legalName: string
    tradeName: string
    status: string
    constitution: string
    taxpayerType: string
    registrationDate: string
    pan: string
    city: string
    state: string
    pincode: string
    address: string
  }
}

export interface SessionProfile extends BusinessProfile {
  id: string | null
  accountId: string
  isProfileVerified: boolean
  isIdentityVerified?: boolean
  identitySelfieUrl?: string | null
  identityVerification?: IdentityVerification
  verification: SessionVerification
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  tokenType: 'Bearer'
  expiresIn: number
  accessExpiresAt: string
  refreshExpiresAt: string
  account: SessionAccount
  profile: SessionProfile
  billing?: BillingInfo | null
}

export interface UserPayload {
  account: SessionAccount
  profile: SessionProfile
  billing?: BillingInfo | null
}

export function registerAccount(payload: {
  firstName: string
  lastName: string
  email: string
  password: string
  termsAccepted: boolean
  refundPolicyAccepted: boolean
  privacyPolicyAccepted: boolean
}): Promise<AuthSession> {
  return postJson<AuthSession>(
    '/api/accounts/register/',
    {
      ...payload,
      guidelinesAccepted: payload.termsAccepted,
      refundPolicyAccepted: payload.refundPolicyAccepted,
      privacyPolicyAccepted: payload.privacyPolicyAccepted,
    },
    false,
  )
}

export function loginAccount(email: string, password: string): Promise<AuthSession> {
  return postJson<AuthSession>('/api/accounts/login/', { email, password }, false)
}

export function fetchCurrentUser(): Promise<UserPayload> {
  return getJson<UserPayload>('/api/accounts/me/')
}

export interface ActivityLogEntry {
  id: string
  event: string
  title: string
  createdAt: string | null
}

export function listActivityLog(query?: ListQuery): Promise<{ activity: ActivityLogEntry[] } & PageMeta> {
  return getJson(`/api/accounts/activity/${toQuery(query)}`)
}

export interface UsageSummary {
  creditsRemaining: number
  creditsLimit: number
  creditsPeriod: string
  periodStart: string | null
  connectionCost: number
  receiverCost: number
}

export interface UsageLogEntry {
  id: string
  accountId: string
  accountName: string
  otherAccountId: string | null
  otherName: string
  planSlug: string
  action: string
  creditsUsed: number
  creditsBefore: number
  creditsAfter: number
  connectionId: string | null
  createdAt: string | null
}

export function listUsageLog(query?: ListQuery): Promise<{ usage: UsageSummary; usageLogs: UsageLogEntry[] } & PageMeta> {
  return getJson(`/api/accounts/usage/${toQuery(query)}`)
}

export function saveAccountProfile(profile: BusinessProfile): Promise<UserPayload> {
  return putJson<UserPayload>('/api/accounts/profile/', profile)
}

export function uploadAccountProfilePhoto(file: File): Promise<UserPayload> {
  const body = new FormData()
  body.append('photo', file)
  return postForm<UserPayload>('/api/accounts/profile/photo/', body)
}

export function verifyAccountBusiness(idNumber: string, idType: string): Promise<UserPayload> {
  return postJson<UserPayload>('/api/accounts/profile/verify/', { idNumber, idType }, true)
}

export function verifyAccountIdentity(
  selfie: File,
  document: File,
  documentType: IdentityDocumentType,
): Promise<UserPayload> {
  const body = new FormData()
  body.append('selfie', selfie)
  body.append('document', document)
  body.append('documentType', documentType)
  return postForm<UserPayload>('/api/accounts/profile/identity/verify/', body)
}

export interface CallIdentityCheck {
  checked: boolean
  matched: boolean
  similarity?: number
  reason?: string
  error?: string
}

export function checkCallIdentity(frame: Blob): Promise<CallIdentityCheck> {
  const body = new FormData()
  body.append('frame', frame, 'frame.jpg')
  return postForm<CallIdentityCheck>('/api/accounts/profile/identity/check/', body)
}

export function changeAccountPlan(planId: PlanId, billing?: BillingInfo): Promise<UserPayload> {
  return patchJson<UserPayload>('/api/accounts/plan/', billing ? { planId, billing } : { planId })
}

export function fetchAccountBilling(): Promise<{ billing: BillingInfo }> {
  return getJson<{ billing: BillingInfo }>('/api/accounts/billing/')
}

export function saveAccountBilling(billing: BillingInfo): Promise<UserPayload> {
  return putJson<UserPayload>('/api/accounts/billing/', billing)
}

export function logoutAccount(): Promise<{ ok: boolean }> {
  return postJson('/api/accounts/logout/', {})
}

export function changeAccountPassword(oldPassword: string, newPassword: string): Promise<{ ok: boolean }> {
  return postJson('/api/accounts/password/', { oldPassword, newPassword })
}

export function deleteOwnAccount(password: string): Promise<{ ok: boolean }> {
  return postJson('/api/accounts/delete/', { password })
}
