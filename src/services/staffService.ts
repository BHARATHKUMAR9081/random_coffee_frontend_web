import type { BillingInfo } from '../types'
import type { UsageLogEntry, UsageSummary } from './authService'
import { adminDelete, adminGet, adminPatch, adminPost, adminPut, type StaffAdmin } from './adminHttp'
import type { CatalogFeature, CatalogPlan, PlanCatalog } from './planCatalog'
import { toQuery, type ListQuery, type PageMeta } from './paging'
import type { SupportTicket, TicketComment } from './ticketService'

export interface StaffPlanStat {
  id: string
  name: string
  price: number
  users: number
  monthlyRevenue: number
}

export interface StaffOverviewPoint {
  month: string
  label: string
  users: number
  cumulativeUsers: number
  revenue: number
}

export interface StaffOverview {
  admin: StaffAdmin
  users: number
  activeUsers: number
  loggedInUsers: number
  availableUsers: number
  verifiedUsers: number
  activeSessions: number
  totalSessions: number
  openTickets: number
  openReports: number
  paidUsers: number
  monthlyRevenue: number
  plans: StaffPlanStat[]
  series: StaffOverviewPoint[]
}

export interface StaffUserRow {
  id: string
  firstName?: string
  lastName?: string
  fullName: string
  email: string
  mobileNumber?: string
  companyName: string
  companyWebsite?: string
  businessType: string
  industry?: string
  city: string
  state?: string
  country?: string
  planId?: string
  verificationStatus: string
  isActive: boolean
  isLogin?: boolean
  lastLogin: string | null
  createdAt: string | null
  preferredLanguages?: string[]
  shortDescription?: string
  lookingFor?: string[]
  isProfileVerified?: boolean
  isIdentityVerified?: boolean
  profilePhotoUrl?: string | null
}

export interface StaffUserActivity {
  id: string
  event: string
  title: string
  createdAt: string | null
}

export interface StaffUserSession {
  id: string
  otherName: string
  timestamp: string | null
  durationSeconds: number
  outcome: string
  status: string
}

export interface StaffUserDetail extends StaffUserRow {
  plan?: { id: string; startedAt?: string | null }
  verification?: { status?: string; id_type?: string; id_number?: string; verified_at?: string | null }
  billing?: BillingInfo | null
  activity?: StaffUserActivity[]
  sessions?: StaffUserSession[]
  usage?: UsageSummary
  usageLogs?: UsageLogEntry[]
}

export interface StaffTicket extends SupportTicket {
  accountId: string
  requesterName: string
  requesterEmail: string
  adminNote: string
  resolvedBy?: string | null
}

export interface StaffReport {
  id: string
  reportedId: string
  reporterName: string
  reportedName: string
  reason: string
  details: string | null
  source: string
  status: string
  adminNote: string
  createdAt: string | null
}

export interface StaffSession {
  id: string
  userAName: string
  userBName: string
  timestamp: string | null
  durationSeconds: number
  outcome: string
  status: string
}

export interface StaffAudit {
  id: string
  timestamp: string | null
  actor: string
  action: string
  target: string
}

export function loginStaff(email: string, password: string) {
  return adminPost<{ accessToken: string; refreshToken?: string; admin: StaffAdmin }>(
    '/staff/login/',
    { email, password },
    false,
  )
}

export function fetchStaffOverview() {
  return adminGet<StaffOverview>('/staff/overview/')
}

export function listStaffUsers(query?: ListQuery) {
  return adminGet<{ users: StaffUserRow[] } & PageMeta>(`/staff/users/${toQuery(query)}`)
}

export function fetchStaffUser(userId: string) {
  return adminGet<StaffUserDetail>(`/staff/users/${userId}/`)
}

export function updateStaffUser(userId: string, payload: Record<string, unknown>) {
  return adminPatch<StaffUserDetail>(`/staff/users/${userId}/`, payload)
}

export function setStaffUserActive(userId: string, isActive: boolean) {
  return updateStaffUser(userId, { isActive })
}

export function listStaffTickets(query?: ListQuery) {
  return adminGet<{ tickets: StaffTicket[] } & PageMeta>(`/staff/tickets/${toQuery(query)}`)
}

export function fetchStaffTicket(ticketId: string) {
  return adminGet<StaffTicket>(`/staff/tickets/${ticketId}/`)
}

export function updateStaffTicket(ticketId: string, payload: { status?: string; adminNote?: string }) {
  return adminPatch<StaffTicket>(`/staff/tickets/${ticketId}/`, payload)
}

export function addStaffTicketComment(ticketId: string, body: string) {
  return adminPost<TicketComment>(`/staff/tickets/${ticketId}/comments/`, { body })
}

export function listStaffReports(query?: ListQuery) {
  return adminGet<{ reports: StaffReport[] } & PageMeta>(`/staff/reports/${toQuery(query)}`)
}

export function updateStaffReport(reportId: string, payload: { status: string; adminNote?: string }) {
  return adminPatch<StaffReport>(`/staff/reports/${reportId}/`, payload)
}

export function listStaffSessions(query?: ListQuery) {
  return adminGet<{ sessions: StaffSession[] } & PageMeta>(`/staff/sessions/${toQuery(query)}`)
}

export function listStaffAdmins(query?: ListQuery) {
  return adminGet<{ admins: StaffAdmin[] } & PageMeta>(`/staff/admins/${toQuery(query)}`)
}

export function createStaffAdmin(payload: { email: string; name: string; password: string; role: string }) {
  return adminPost<StaffAdmin>('/staff/admins/', payload)
}

export function updateStaffAdmin(adminId: string, payload: { isActive?: boolean; role?: string }) {
  return adminPatch<StaffAdmin>(`/staff/admins/${adminId}/`, payload)
}

export function listStaffAudit(query?: ListQuery) {
  return adminGet<{ auditLog: StaffAudit[] } & PageMeta>(`/staff/audit/${toQuery(query)}`)
}

export function listStaffUsage(query?: ListQuery) {
  return adminGet<{ usageLogs: UsageLogEntry[] } & PageMeta>(`/staff/usage/${toQuery(query)}`)
}

export function fetchStaffPlanCatalog() {
  return adminGet<PlanCatalog>('/staff/plans/')
}

export function saveStaffPlanCatalog(payload: PlanCatalog) {
  return adminPut<PlanCatalog>('/staff/plans/', payload)
}

export function createStaffPlan(payload: {
  slug: string
  name: string
  price: number
  includes?: string
  isFeatured?: boolean
  isActive?: boolean
}) {
  return adminPost<CatalogPlan>('/staff/plans/create/', payload)
}

export function updateStaffPlan(planId: string, payload: Partial<CatalogPlan> & { sortOrder?: number }) {
  return adminPatch<CatalogPlan>(`/staff/plans/${planId}/`, payload)
}

export function deleteStaffPlan(planId: string) {
  return adminDelete<CatalogPlan | { ok: boolean }>(`/staff/plans/${planId}/`)
}

export function createStaffPlanFeature(payload: { label: string; note?: string }) {
  return adminPost<PlanCatalog>('/staff/plan-features/', payload)
}

export function updateStaffPlanFeature(
  featureId: string,
  payload: Partial<Pick<CatalogFeature, 'label' | 'note'>> & { values?: Record<string, string>; sortOrder?: number },
) {
  return adminPatch<PlanCatalog>(`/staff/plan-features/${featureId}/`, payload)
}

export function deleteStaffPlanFeature(featureId: string) {
  return adminDelete<PlanCatalog>(`/staff/plan-features/${featureId}/`)
}
