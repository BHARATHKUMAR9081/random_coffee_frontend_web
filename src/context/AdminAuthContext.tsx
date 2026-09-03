import { createContext, useContext, useState, type ReactNode } from 'react'
import { currentStaffAdmin, isAdminSessionActive, loginAdmin, logoutAdmin } from '../services/adminAuthService'
import type { StaffAdmin } from '../services/adminHttp'

interface AdminAuthContextValue {
  isAdminLoggedIn: boolean
  admin: StaffAdmin | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<StaffAdmin | null>(currentStaffAdmin)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(isAdminSessionActive)

  async function login(email: string, password: string) {
    const session = await loginAdmin(email, password)
    setAdmin(session.admin)
    setIsAdminLoggedIn(true)
    return true
  }

  function logout() {
    logoutAdmin()
    setAdmin(null)
    setIsAdminLoggedIn(false)
  }

  return (
    <AdminAuthContext.Provider value={{ isAdminLoggedIn, admin, login, logout }}>{children}</AdminAuthContext.Provider>
  )
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
