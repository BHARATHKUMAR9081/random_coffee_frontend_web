import type { AdminUserRow, MatchSessionEntry, ReportEntry } from '../types'

export const seedUsers: AdminUserRow[] = [
  {
    id: 'u-1',
    fullName: 'Priya Ramesh',
    companyName: 'Coimbatore Textile Traders',
    businessType: 'Trader',
    city: 'Coimbatore',
    verificationStatus: 'VERIFIED',
    accountStatus: 'active',
    joinedAt: '2026-08-14T09:00:00.000Z',
  },
  {
    id: 'u-2',
    fullName: 'Arun Kumar',
    companyName: 'Kovai Precision Components',
    businessType: 'Manufacturer',
    city: 'Coimbatore',
    verificationStatus: 'VERIFIED',
    accountStatus: 'active',
    joinedAt: '2026-08-16T11:30:00.000Z',
  },
  {
    id: 'u-3',
    fullName: 'Divya Shankar',
    companyName: 'Shankar Retail Group',
    businessType: 'Retailer',
    city: 'Madurai',
    verificationStatus: 'VERIFIED',
    accountStatus: 'active',
    joinedAt: '2026-08-18T14:15:00.000Z',
  },
  {
    id: 'u-4',
    fullName: 'Suspicious Seller',
    companyName: 'QuickCash Deals',
    businessType: 'Other',
    city: 'Chennai',
    verificationStatus: 'UNVERIFIED',
    accountStatus: 'active',
    joinedAt: '2026-08-29T08:00:00.000Z',
  },
  {
    id: 'u-5',
    fullName: 'Karthik Subramaniam',
    companyName: 'TN Logistics Partners',
    businessType: 'Service Provider',
    city: 'Chennai',
    verificationStatus: 'VERIFIED',
    accountStatus: 'active',
    joinedAt: '2026-08-20T10:00:00.000Z',
  },
]

export const seedReports: ReportEntry[] = [
  {
    id: 'r-1',
    reporterName: 'Priya Ramesh',
    reportedName: 'Suspicious Seller',
    reason: 'Spam or scam',
    timestamp: '2026-08-30T10:20:00.000Z',
    status: 'open',
  },
  {
    id: 'r-2',
    reporterName: 'Arun Kumar',
    reportedName: 'Suspicious Seller',
    reason: 'Not business-related',
    timestamp: '2026-08-31T16:05:00.000Z',
    status: 'open',
  },
  {
    id: 'r-3',
    reporterName: 'Divya Shankar',
    reportedName: 'Karthik Subramaniam',
    reason: 'Other',
    timestamp: '2026-08-25T12:00:00.000Z',
    status: 'resolved',
  },
]

export const seedMatchSessions: MatchSessionEntry[] = [
  {
    id: 'm-1',
    userAName: 'Priya Ramesh',
    userBName: 'Arun Kumar',
    timestamp: '2026-08-30T09:10:00.000Z',
    durationSeconds: 120,
    outcome: 'NETWORKED',
  },
  {
    id: 'm-2',
    userAName: 'Divya Shankar',
    userBName: 'Karthik Subramaniam',
    timestamp: '2026-08-30T11:45:00.000Z',
    durationSeconds: 87,
    outcome: 'RANDOM',
  },
  {
    id: 'm-3',
    userAName: 'Arun Kumar',
    userBName: 'Suspicious Seller',
    timestamp: '2026-08-31T15:50:00.000Z',
    durationSeconds: 34,
    outcome: 'RANDOM',
  },
]
