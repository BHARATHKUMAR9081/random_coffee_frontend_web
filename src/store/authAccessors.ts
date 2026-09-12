export interface AuthAccessors {
  getAccessToken: () => string | null
  getRefreshToken: () => string | null
  setTokens: (tokens: { accessToken: string; refreshToken?: string }) => void
  clearAuth: () => void
}

const authAccessors: AuthAccessors = {
  getAccessToken: () => null,
  getRefreshToken: () => null,
  setTokens: () => undefined,
  clearAuth: () => undefined,
}

export function bindAuthAccessors(next: AuthAccessors) {
  authAccessors.getAccessToken = next.getAccessToken
  authAccessors.getRefreshToken = next.getRefreshToken
  authAccessors.setTokens = next.setTokens
  authAccessors.clearAuth = next.clearAuth
}

export function getAccessToken() {
  return authAccessors.getAccessToken()
}

export function getRefreshToken() {
  return authAccessors.getRefreshToken()
}

export function cacheTokens(tokens: { accessToken: string; refreshToken?: string }) {
  authAccessors.setTokens(tokens)
}

export function clearCachedAuth() {
  authAccessors.clearAuth()
}
