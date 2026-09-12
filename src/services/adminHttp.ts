import { ApiError, buildUrl } from './http'

const STORAGE_KEY = 'randomcoffee.adminAuth'

export interface StaffAdmin {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'moderator' | string
  isActive: boolean
  lastLogin: string | null
  createdAt: string | null
}

export interface AdminSession {
  accessToken: string
  refreshToken?: string
  admin: StaffAdmin
}

export function readAdminSession(): AdminSession | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminSession
  } catch {
    return null
  }
}

export function writeAdminSession(session: AdminSession) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearAdminSession() {
  sessionStorage.removeItem(STORAGE_KEY)
}

export function getAdminAccessToken() {
  return readAdminSession()?.accessToken ?? null
}

async function readError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string }
    return data.error ?? 'Request failed.'
  } catch {
    return 'Request failed.'
  }
}

export async function adminRequest<T>(path: string, options: { method?: string; body?: unknown; auth?: boolean } = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = auth ? getAdminAccessToken() : null
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(buildUrl(path), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (err) {
    throw new ApiError(
      err instanceof Error ? err.message : 'Network request failed. Please check your connection.',
      0,
    )
  }

  if (!response.ok) {
    throw new ApiError(await readError(response), response.status)
  }
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export function adminGet<T>(path: string): Promise<T> {
  return adminRequest<T>(path)
}

export function adminPost<T>(path: string, body: unknown = {}, auth = true): Promise<T> {
  return adminRequest<T>(path, { method: 'POST', body, auth })
}

export function adminPatch<T>(path: string, body: unknown): Promise<T> {
  return adminRequest<T>(path, { method: 'PATCH', body })
}

export function adminPut<T>(path: string, body: unknown): Promise<T> {
  return adminRequest<T>(path, { method: 'PUT', body })
}

export function adminDelete<T>(path: string): Promise<T> {
  return adminRequest<T>(path, { method: 'DELETE' })
}
