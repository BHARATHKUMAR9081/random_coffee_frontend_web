import type { BusinessType, MatchFilters, MatchedProfile, MatchSessionLog } from '../types'
import { getRandomMatch } from '../data/mockMatches'
import { getJson, patchJson, requestJson } from './http'
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

export interface MatchTimeoutResponse {
  status: 'timeout'
  message: string
}

export type MatchResponse = MatchResult | MatchTimeoutResponse

export function isMatchResult(response: MatchResponse): response is MatchResult {
  return 'connectedUser' in response && response.connectedUser !== undefined
}

export function findRandomMatch(): MatchedProfile {
  return getRandomMatch()
}

export function requestMatch(filters: {
  industry: string
  businessType: BusinessType | ''
  preferredLanguages: string[]
  cityScope: MatchFilters['cityScope']
}): Promise<MatchResponse> {
  const payload = {
    industry: filters.industry ?? '',
    businessType: filters.businessType ?? '',
    preferredLanguages: filters.preferredLanguages ?? [],
    preferredLanguage: (filters.preferredLanguages && filters.preferredLanguages[0]) ?? '',
    cityScope: filters.cityScope ?? 'anywhere',
  }

  // Explicitly dispatch matchmaking trigger as POST with JSON body payload
  return requestJson<MatchResponse>('/matches/find/', {
    method: 'POST',
    body: payload,
    auth: true,
  })
}

export function stopMatching(): Promise<{ ok: boolean; isAvailable: boolean }> {
  return requestJson<{ ok: boolean; isAvailable: boolean }>('/matches/stop/', {
    method: 'POST',
    body: {},
    auth: true,
  })
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
