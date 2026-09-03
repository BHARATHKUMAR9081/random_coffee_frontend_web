import { clearAdminSession, readAdminSession, writeAdminSession, type AdminSession, type StaffAdmin } from './adminHttp'
import { loginStaff } from './staffService'

export function isAdminSessionActive(): boolean {
  return Boolean(readAdminSession()?.accessToken)
}

export function currentStaffAdmin(): StaffAdmin | null {
  return readAdminSession()?.admin ?? null
}

export async function loginAdmin(email: string, password: string): Promise<AdminSession> {
  const session = await loginStaff(email, password)
  writeAdminSession(session)
  return session
}

export function logoutAdmin() {
  clearAdminSession()
}
