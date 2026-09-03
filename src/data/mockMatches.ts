import type { MatchFilters, MatchedProfile } from '../types'

export type { MatchedProfile as MockMatchedUser }

const pool: MatchedProfile[] = [
  {
    name: 'Priya Ramesh',
    companyName: 'Coimbatore Textile Traders',
    businessType: 'Trader',
    industry: 'Textiles & Apparel',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    country: 'India',
    preferredLanguages: ['Tamil', 'English'],
    lookingFor: 'Suppliers',
    shortDescription: 'Trades cotton and finished garments for retailers across South India.',
  },
  {
    name: 'Arun Kumar',
    companyName: 'Kovai Precision Components',
    businessType: 'Manufacturer',
    industry: 'Industrial Equipment',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    country: 'India',
    preferredLanguages: ['Tamil', 'English'],
    lookingFor: 'Buyers',
    shortDescription: 'Makes precision auto parts and is looking for OEM buyers.',
  },
  {
    name: 'Divya Shankar',
    companyName: 'Shankar Retail Group',
    businessType: 'Retailer',
    industry: 'Retail & Consumer',
    city: 'Madurai',
    state: 'Tamil Nadu',
    country: 'India',
    preferredLanguages: ['Tamil', 'Hindi'],
    lookingFor: 'Suppliers',
  },
  {
    name: 'Karthik Subramaniam',
    companyName: 'TN Logistics Partners',
    businessType: 'Service Provider',
    industry: 'Logistics & Supply Chain',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    preferredLanguages: ['English', 'Tamil'],
    lookingFor: 'Customers',
  },
  {
    name: 'Meena Iyer',
    companyName: 'Iyer Ventures',
    businessType: 'Investor',
    industry: 'IT & Software',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    preferredLanguages: ['English', 'Hindi'],
    lookingFor: 'Business Partners',
  },
  {
    name: 'Rahul Nair',
    companyName: 'Nair Freelance Studio',
    businessType: 'Freelancer',
    industry: 'IT & Software',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    country: 'India',
    preferredLanguages: ['English', 'Malayalam'],
    lookingFor: 'Customers',
  },
]

function languageSet(values?: string[]) {
  return new Set((values ?? []).map((item) => item.trim().toLowerCase()).filter(Boolean))
}

export function getRandomMatch(): MatchedProfile {
  return pool[Math.floor(Math.random() * pool.length)] as MatchedProfile
}

export function findFilteredMatch(
  filters: Pick<MatchFilters, 'industry' | 'businessTypes' | 'preferredLanguages' | 'cityScope'>,
  viewer: { city?: string; state?: string; country?: string },
): MatchedProfile | null {
  const wantedType = filters.businessTypes[0] ?? ''
  const wantedLanguages = languageSet(filters.preferredLanguages)
  const rows = pool.filter((row) => {
    if (filters.industry && (row.industry || '').toLowerCase() !== filters.industry.toLowerCase()) return false
    if (wantedType && row.businessType !== wantedType) return false
    if (wantedLanguages.size) {
      const theirs = languageSet(row.preferredLanguages)
      if (![...wantedLanguages].some((language) => theirs.has(language))) return false
    }
    if (filters.cityScope === 'same-city' && viewer.city && row.city.toLowerCase() !== viewer.city.toLowerCase()) {
      return false
    }
    if (filters.cityScope === 'same-state' && viewer.state && (row.state || '').toLowerCase() !== viewer.state.toLowerCase()) {
      return false
    }
    return true
  })
  if (rows.length === 0) return null
  return rows[Math.floor(Math.random() * rows.length)]
}
