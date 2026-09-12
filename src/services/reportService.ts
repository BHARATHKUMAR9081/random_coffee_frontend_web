import { getJson, postJson } from './http'
import { toQuery, type ListQuery, type PageMeta } from './paging'
import type { ReportReason } from '../types'

export type ReportSource = 'call' | 'chat' | 'other'
export type SafetyReportStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed' | string

export interface SafetyReport {
  id: string
  reportedId: string
  reason: ReportReason | string
  details: string | null
  source: ReportSource | string
  matchSessionId: string | null
  connectionId: string | null
  imageUrl: string | null
  status: SafetyReportStatus
  createdAt: string | null
  updatedAt: string | null
  resolvedAt: string | null
}

export function listMyReports(query?: ListQuery): Promise<{ reports: SafetyReport[] } & Partial<PageMeta>> {
  return getJson(`/reports/${toQuery(query)}`)
}

export function createReport(payload: {
  reportedId: string
  reason: ReportReason | string
  details?: string
  source: ReportSource
  matchSessionId?: string
  connectionId?: string
  imageUrl?: string
  imagePath?: string
}): Promise<SafetyReport> {
  return postJson('/reports/', payload)
}
