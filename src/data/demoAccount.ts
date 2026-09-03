import type { BusinessProfile, CallHistoryEntry, PlanId, VerificationStatus } from '../types'

export const DEMO_EMAIL = 'demo@randomcoffee.com'
export const DEMO_PASSWORD = 'demo'

const demoPhoto =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="#E8B923"/><text x="32" y="39" text-anchor="middle" font-size="20" font-family="system-ui,sans-serif" font-weight="600" fill="#0A1628">PM</text></svg>',
  )

export const demoProfile: BusinessProfile = {
  firstName: 'Priya',
  lastName: 'Mehta',
  fullName: 'Priya Mehta',
  profilePhotoUrl: demoPhoto,
  mobileNumber: '9876543210',
  email: DEMO_EMAIL,
  companyName: 'Mehta Textiles',
  companyWebsite: 'https://mehtatextiles.example',
  businessType: 'Manufacturer',
  industry: 'Textiles & Apparel',
  city: 'Coimbatore',
  state: 'Tamil Nadu',
  country: 'India',
  preferredLanguages: ['English', 'Tamil'],
  shortDescription: 'Family-run textile manufacturer looking for buyers and distribution partners across South India.',
  lookingFor: ['Buyers', 'Business Partners', 'Customers'],
}

const demoCallHistory: CallHistoryEntry[] = [
  {
    id: 'demo-call-1',
    matchedUserName: 'Arun Kumar',
    matchedCompanyName: 'Kovai Precision Components',
    timestamp: '2026-08-28T10:15:00.000Z',
    outcome: 'NETWORKED',
  },
  {
    id: 'demo-call-2',
    matchedUserName: 'Divya Shankar',
    matchedCompanyName: 'Shankar Retail Group',
    timestamp: '2026-08-21T14:40:00.000Z',
    outcome: 'RANDOM',
  },
]

export function createDemoAccountRecord(): {
  passwordMock: string
  profile: BusinessProfile
  verificationStatus: VerificationStatus
  businessIdNumber: string
  planId: PlanId
  callHistory: CallHistoryEntry[]
} {
  return {
    passwordMock: DEMO_PASSWORD,
    profile: demoProfile,
    verificationStatus: 'VERIFIED',
    businessIdNumber: '33AAAAA0000A1Z5',
    planId: 'free',
    callHistory: demoCallHistory,
  }
}
