export const PLAN_COMPARISON_ROWS = [
  {
    feature: 'New unique introductions',
    free: '50 lifetime',
    basic: '150 per month',
    pro: '500 per month',
  },
  {
    feature: 'Connection balance',
    free: '−1 per introduction we initiate',
    basic: '−1 per introduction we initiate',
    pro: '−1 per introduction we initiate',
  },
  {
    feature: 'Instant matching',
    free: 'Queue-based instant matching',
    basic: 'Priority-based instant matching',
    pro: 'Highest-priority instant matching',
  },
  {
    feature: 'Chat after networking',
    free: 'Yes',
    basic: 'Yes',
    pro: 'Yes',
  },
  {
    feature: 'Follow-up meeting request',
    free: 'No',
    basic: 'Yes',
    pro: 'Yes, with a written note',
  },
  {
    feature: 'Industry filters',
    free: 'Basic industry and business-type filters. Location is fixed as “Anywhere.”',
    basic: 'Advanced industry filters with language and location: Anywhere, Same State, or Same City',
    pro: 'Advanced filters with India, USA, UK, specific state, city, or selected range. Includes problem-based matching such as looking for a co-founder or angel investor',
  },
  {
    feature: 'Profile page',
    free: 'Basic personal/business profile',
    basic: 'Enhanced profile with cover picture',
    pro: 'Enhanced profile with cover picture and priority presentation',
  },
  {
    feature: 'Verified badge',
    free: 'Simple verified tick',
    basic: 'Blue verified tick',
    pro: 'Gold verified tick',
  },
  {
    feature: 'Verification eligibility',
    free: 'Basic platform verification',
    basic: 'GST verification',
    pro: 'GST, MSME, incorporation number, LinkedIn profile, and other approved verification',
  },
  {
    feature: 'Service/achievement posts',
    free: 'Not available',
    basic: 'Up to 5 active posts',
    pro: 'Unlimited posts',
  },
  {
    feature: 'Follow-up reminders',
    free: 'No',
    basic: 'Yes',
    pro: 'Yes',
  },
  {
    feature: 'Connection analytics',
    free: 'No',
    basic: 'View professional roles of people you connected with, such as CEO, Founder, MD, Manager, Buyer, Supplier, or Investor',
    pro: 'Advanced analytics: professional roles, industries, business types, locations, connection activity, and follow-up status',
  },
  {
    feature: 'Support',
    free: 'Standard support',
    basic: 'Priority support',
    pro: 'Premium support',
  },
] as const

export const CONNECTION_BALANCE_NOTE =
  'Connection balance decreases by 1 after each successful networked connection initiated from our side. It decreases even if the receiver does not accept. If the receiver accepts, one introduction also decreases from the receiver’s balance.'
