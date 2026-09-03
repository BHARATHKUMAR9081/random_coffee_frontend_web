export const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8001'

import { cacheTokens, clearCachedAuth, getAccessToken, getRefreshToken } from '../store/authAccessors'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions {
  method?: string
  body?: unknown
  auth?: boolean
  retry?: boolean
}

let refreshInFlight: Promise<boolean> | null = null

async function readError(response: Response): Promise<string> {
  const raw = await response.text()
  try {
    const data = JSON.parse(raw) as { error?: string }
    if (data.error) return data.error
  } catch {
    /* HTML/debug responses from the API */
  }
  if (response.status === 402) return 'Pay for this plan before it can be activated.'
  if (response.status === 404) return 'No one online matches your filters right now. Try again or widen your filters.'
  if (response.status >= 500) return 'The server hit an error. Please try again.'
  return 'Request failed.'
}

async function refreshAccessToken(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight
  refreshInFlight = (async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return false
    const response = await fetch(`${API_URL}/api/accounts/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!response.ok) {
      clearCachedAuth()
      return false
    }
    const data = (await response.json()) as { accessToken: string; refreshToken?: string }
    cacheTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
    return true
  })().finally(() => {
    refreshInFlight = null
  })
  return refreshInFlight
}

export async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, retry = true } = options
  const headers: Record<string, string> = {}
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  const accessToken = auth ? getAccessToken() : null
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (response.status === 401 && auth && retry && getRefreshToken()) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      return requestJson<T>(path, { ...options, retry: false })
    }
  }

  if (!response.ok) {
    throw new ApiError(await readError(response), response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

export async function postForm<T>(path: string, body: FormData, auth = true, retry = true): Promise<T> {
  const headers: Record<string, string> = {}
  const accessToken = auth ? getAccessToken() : null
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers,
    body,
  })

  if (response.status === 401 && auth && retry && getRefreshToken()) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      return postForm<T>(path, body, auth, false)
    }
  }

  if (!response.ok) {
    throw new ApiError(await readError(response), response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

export function postJson<T>(path: string, body: unknown, auth = true): Promise<T> {
  return requestJson<T>(path, { method: 'POST', body, auth })
}

export function getJson<T>(path: string): Promise<T> {
  return requestJson<T>(path, { method: 'GET', auth: true })
}

export function putJson<T>(path: string, body: unknown): Promise<T> {
  return requestJson<T>(path, { method: 'PUT', body, auth: true })
}

export function patchJson<T>(path: string, body: unknown): Promise<T> {
  return requestJson<T>(path, { method: 'PATCH', body, auth: true })
}
