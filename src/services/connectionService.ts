import type { MatchedProfile } from '../types'
import { getJson, postJson } from './http'
import { toQuery, type ListQuery, type PageMeta } from './paging'

export interface ConnectionRecord {
  id: string
  status: 'pending' | 'accepted' | 'declined' | 'blocked' | string
  matchSessionId: string | null
  requestedById: string
  direction: 'sent' | 'received'
  canAccept: boolean
  canDecline: boolean
  canCancel?: boolean
  canChat?: boolean
  otherUser: MatchedProfile
  lastMessageAt: string | null
  lastMessagePreview: string | null
  unreadCount?: number
  acceptedAt: string | null
  createdAt: string | null
  updatedAt: string | null
}

export function listConnections(statusOrQuery?: string | ListQuery): Promise<{ connections: ConnectionRecord[] } & Partial<PageMeta>> {
  if (typeof statusOrQuery === 'string') {
    return getJson(`/connections/${toQuery({ status: statusOrQuery })}`)
  }
  return getJson(`/connections/${toQuery(statusOrQuery)}`)
}

export function sendConnectionRequest(accountId: string, matchSessionId?: string): Promise<ConnectionRecord> {
  return postJson('/connections/', { accountId, matchSessionId })
}

export function acceptConnection(connectionId: string): Promise<ConnectionRecord> {
  return postJson(`/connections/${connectionId}/accept/`, {})
}

export function declineConnection(connectionId: string): Promise<ConnectionRecord> {
  return postJson(`/connections/${connectionId}/decline/`, {})
}

export function cancelConnection(connectionId: string): Promise<ConnectionRecord> {
  return postJson(`/connections/${connectionId}/cancel/`, {})
}

export function fetchConnection(connectionId: string): Promise<ConnectionRecord> {
  return getJson(`/connections/${connectionId}/`)
}
