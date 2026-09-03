import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

export function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const { isAdminLoggedIn } = useAdminAuth()
  if (!isAdminLoggedIn) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
