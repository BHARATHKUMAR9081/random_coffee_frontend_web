import type { BusinessType, MatchFilters, MatchedProfile, MatchSessionLog } from '../types'
import { findFilteredMatch, getRandomMatch } from '../data/mockMatches'
import { getJson, patchJson, postJson } from './http'
import { toQuery, type ListQuery, type PageMeta } from './paging'

export type { MatchedProfile as MockMatchedUser }

export interface MatchCallCredentials {
  url: string
  token: string
  roomName: string
}

export interface MatchResult {
  session: MatchSessionLog
  user: MatchedProfile
  connectedUser: MatchedProfile
  otherUser?: MatchedProfile
  call?: MatchCallCredentials
  filters?: MatchSessionLog['filters']
}

export function findRandomMatch(): MatchedProfile {
  return getRandomMatch()
}

export function findDemoMatch(
  filters: {
    industry: string
    businessType: BusinessType | ''
    preferredLanguages: string[]
    cityScope: MatchFilters['cityScope']
  },
  viewer: { city?: string; state?: string; country?: string },
): MatchedProfile | null {
  return findFilteredMatch(
    {
      industry: filters.industry,
      businessTypes: filters.businessType ? [filters.businessType] : [],
      preferredLanguages: filters.preferredLanguages,
      cityScope: filters.cityScope,
    },
    viewer,
  )
}

export function requestMatch(filters: {
  industry: string
  businessType: BusinessType | ''
  preferredLanguages: string[]
  cityScope: MatchFilters['cityScope']
}): Promise<MatchResult> {
  return postJson<MatchResult>('/matches/find/', {
    industry: filters.industry,
    businessType: filters.businessType,
    preferredLanguages: filters.preferredLanguages,
    preferredLanguage: filters.preferredLanguages[0] ?? '',
    cityScope: filters.cityScope,
  })
}

export function stopMatching(): Promise<{ ok: boolean; isAvailable: boolean }> {
  return postJson('/matches/stop/', {})
}

export function fetchMatchSession(sessionId: string): Promise<MatchResult> {
  return getJson<MatchResult>(`/matches/sessions/${sessionId}/`)
}

export function listMatchSessions(query?: ListQuery): Promise<{ sessions: MatchResult[] } & PageMeta> {
  return getJson(`/matches/sessions/${toQuery(query)}`)
}

export function updateMatchSession(
  sessionId: string,
  payload: {
    durationSeconds?: number
    outcome?: string
    endedReason?: string
    ended?: boolean
    callStarted?: boolean
    status?: string
  },
): Promise<MatchResult> {
  return patchJson<MatchResult>(`/matches/sessions/${sessionId}/`, payload)
}
