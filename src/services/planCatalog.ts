import { getJson } from './http'

export interface PlanRules {
  introductionsLimit: number
  introductionsPeriod: 'lifetime' | 'month' | string
  connectionCost: number
  receiverCost: number
  matchingPriority: string
  followupAllowed: boolean
  followupNote: boolean
  postsLimit: number
  badgeTier: string
  analyticsLevel: string
  filtersLocation: string
}

export const EMPTY_PLAN_RULES: PlanRules = {
  introductionsLimit: 50,
  introductionsPeriod: 'lifetime',
  connectionCost: 1,
  receiverCost: 1,
  matchingPriority: 'queue',
  followupAllowed: false,
  followupNote: false,
  postsLimit: 0,
  badgeTier: 'simple',
  analyticsLevel: 'none',
  filtersLocation: 'anywhere',
}

export interface CatalogPlan {
  id: string
  slug: string
  name: string
  price: number
  priceLabel: string
  includes: string
  sortOrder: number
  isActive: boolean
  isFeatured: boolean
  rules: PlanRules
}

export interface CatalogFeature {
  id: string
  label: string
  note: string
  sortOrder: number
  values: Record<string, string>
}

export interface PlanCatalog {
  plans: CatalogPlan[]
  features: CatalogFeature[]
}

export function fetchPlanCatalog(): Promise<PlanCatalog> {
  return getJson<PlanCatalog>('/accounts/plans/')
}
