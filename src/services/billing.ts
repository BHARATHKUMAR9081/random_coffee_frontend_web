import type { BillingInfo, BusinessProfile, VerificationStatus } from '../types'
import { isValidEmail, isValidGstin, isValidIndianMobile, isValidPincode, normalizeGstin } from '../lib/validation'

export function emptyBilling(defaults?: Partial<BillingInfo>): BillingInfo {
  return {
    id: defaults?.id ?? null,
    accountId: defaults?.accountId,
    legalName: defaults?.legalName ?? '',
    billingEmail: defaults?.billingEmail ?? '',
    billingPhone: defaults?.billingPhone ?? '',
    gstin: defaults?.gstin ?? '',
    gstinVerified: Boolean(defaults?.gstinVerified),
    addressLine: defaults?.addressLine ?? '',
    city: defaults?.city ?? '',
    state: defaults?.state ?? '',
    pincode: defaults?.pincode ?? '',
    country: defaults?.country || 'India',
    updatedAt: defaults?.updatedAt ?? null,
  }
}

export function verifiedGstin(user?: {
  verificationStatus?: VerificationStatus | string
  businessIdNumber?: string | null
  billing?: Partial<BillingInfo> | null
}): string {
  if (user?.billing?.gstinVerified && user.billing.gstin) {
    return normalizeGstin(user.billing.gstin)
  }
  const gstin = normalizeGstin(user?.businessIdNumber ?? '')
  if (user?.verificationStatus === 'VERIFIED' && isValidGstin(gstin)) return gstin
  return ''
}

export function billingFromProfile(
  profile: BusinessProfile,
  existing?: Partial<BillingInfo> | null,
  lockedGstin?: string,
): BillingInfo {
  const current = emptyBilling(existing ?? undefined)
  const gstin = lockedGstin || current.gstin
  return {
    ...current,
    legalName: current.legalName || `${profile.firstName} ${profile.lastName}`.trim() || profile.companyName,
    billingEmail: current.billingEmail || profile.email,
    billingPhone: current.billingPhone || profile.mobileNumber,
    gstin,
    gstinVerified: Boolean(lockedGstin) || current.gstinVerified,
    city: current.city || profile.city,
    state: current.state || profile.state,
    country: current.country || profile.country || 'India',
  }
}

export function isBillingComplete(billing: BillingInfo | null | undefined): boolean {
  if (!billing) return false
  return Boolean(
    billing.legalName.trim() &&
      billing.billingEmail.trim() &&
      billing.billingPhone.trim() &&
      billing.addressLine.trim() &&
      billing.city.trim() &&
      billing.state.trim() &&
      billing.pincode.trim() &&
      billing.country.trim(),
  )
}

export function validateBilling(billing: BillingInfo): string | null {
  if (!billing.legalName.trim()) return 'Enter the billing name.'
  if (!isValidEmail(billing.billingEmail)) return 'Enter a valid billing email.'
  if (!isValidIndianMobile(billing.billingPhone) && billing.country.trim().toLowerCase() === 'india') {
    return 'Enter a valid 10-digit billing mobile number.'
  }
  if (!billing.billingPhone.trim()) return 'Enter a billing mobile number.'
  if (!billing.addressLine.trim()) return 'Enter the billing address.'
  if (!billing.city.trim()) return 'Enter the billing city.'
  if (!billing.state.trim()) return 'Enter the billing state.'
  if (!isValidPincode(billing.pincode, billing.country)) return 'Enter a valid PIN code.'
  if (billing.gstin.trim() && !isValidGstin(billing.gstin)) return 'Enter a valid 15-character GSTIN, or leave it blank.'
  return null
}

export function billingPayload(billing: BillingInfo): BillingInfo {
  return {
    ...billing,
    legalName: billing.legalName.trim(),
    billingEmail: billing.billingEmail.trim().toLowerCase(),
    billingPhone: billing.billingPhone.replace(/[\s-]/g, ''),
    gstin: billing.gstin.trim() ? normalizeGstin(billing.gstin) : '',
    addressLine: billing.addressLine.trim(),
    city: billing.city.trim(),
    state: billing.state.trim(),
    pincode: billing.pincode.replace(/[\s-]/g, ''),
    country: billing.country.trim() || 'India',
  }
}
