export const API_URL = (
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://127.0.0.1:8001' : '')
).replace(/\/+$/, '')

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

export function buildUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const base = `${API_URL}${normalizedPath}`
  // When communicating over ngrok tunnels, append ngrok-skip-browser-warning so ngrok never intercepts API GET requests with an HTML warning
  if (API_URL.includes('ngrok')) {
    const sep = base.includes('?') ? '&' : '?'
    if (!base.includes('ngrok-skip-browser-warning')) {
      return `${base}${sep}ngrok-skip-browser-warning=1`
    }
  }
  return base
}

async function refreshAccessToken(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight
  refreshInFlight = (async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return false
    try {
      const response = await fetch(buildUrl('/api/accounts/refresh/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          clearCachedAuth()
        }
        return false
      }
      const data = (await response.json()) as { accessToken: string; refreshToken?: string }
      cacheTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
      return true
    } catch {
      // Do not clear auth on temporary network interruptions
      return false
    }
  })().finally(() => {
    refreshInFlight = null
  })
  return refreshInFlight
}

export async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, retry = true } = options
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  const accessToken = auth ? getAccessToken() : null
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

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
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  const accessToken = auth ? getAccessToken() : null
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  let response: Response
  try {
    response = await fetch(buildUrl(path), {
      method: 'POST',
      headers,
      body,
    })
  } catch (err) {
    throw new ApiError(
      err instanceof Error ? err.message : 'Network request failed. Please check your connection.',
      0,
    )
  }

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
