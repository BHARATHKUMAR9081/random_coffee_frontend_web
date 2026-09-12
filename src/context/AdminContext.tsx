import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { seedMatchSessions, seedReports, seedUsers } from '../data/mockAdminSeed'
import type { AccountStatus, AdminUserRow, AuditLogEntry, MatchSessionEntry, ReportEntry } from '../types'

const STORAGE_KEY = 'randomcoffee.admin'

interface AdminState {
  users: AdminUserRow[]
  reports: ReportEntry[]
  matchSessions: MatchSessionEntry[]
  auditLog: AuditLogEntry[]
}

function loadState(): AdminState {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      return JSON.parse(raw) as AdminState
    } catch {
      // fall through to seed
    }
  }
  return {
    users: seedUsers,
    reports: seedReports,
    matchSessions: seedMatchSessions,
    auditLog: [],
  }
}

interface AdminContextValue extends AdminState {
  setUserStatus: (userId: string, status: AccountStatus) => void
  resolveReport: (reportId: string) => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>(loadState)

  function persist(next: AdminState) {
    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  function logAction(action: string, target: string, next: AdminState) {
    const entry: AuditLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actor: 'Moderator (you)',
      action,
      target,
    }
    persist({ ...next, auditLog: [entry, ...next.auditLog] })
  }

  function setUserStatus(userId: string, status: AccountStatus) {
    const user = state.users.find((u) => u.id === userId)
    if (!user) return
    const users = state.users.map((u) => (u.id === userId ? { ...u, accountStatus: status } : u))
    logAction(`Set account status to "${status}"`, user.fullName, { ...state, users })
  }

  function resolveReport(reportId: string) {
    const report = state.reports.find((r) => r.id === reportId)
    if (!report) return
    const reports = state.reports.map((r) => (r.id === reportId ? { ...r, status: 'resolved' as const } : r))
    logAction('Resolved report', `${report.reportedName} (reported by ${report.reporterName})`, { ...state, reports })
  }

  const value = useMemo<AdminContextValue>(
    () => ({ ...state, setUserStatus, resolveReport }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
