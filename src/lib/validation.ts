const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Accepts 10-digit Indian mobile numbers, optionally with a +91/91 prefix, after stripping separators.
const MOBILE_RE = /^(\+?91)?[6-9]\d{9}$/
const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim())
}

export function isValidIndianMobile(value: string): boolean {
  return MOBILE_RE.test(value.trim().replace(/[\s-]/g, ''))
}

export function normalizeGstin(value: string): string {
  return value.replace(/[\s-]/g, '').toUpperCase()
}

export function isValidGstin(value: string): boolean {
  return GSTIN_RE.test(normalizeGstin(value))
}

export function normalizePincode(value: string): string {
  return value.replace(/[\s-]/g, '')
}

export function isValidPincode(value: string, country = 'India'): boolean {
  const pin = normalizePincode(value)
  if (country.trim().toLowerCase() === 'india' || country.trim().toLowerCase() === 'in') {
    return /^\d{6}$/.test(pin)
  }
  return /^[A-Za-z0-9]{3,12}$/.test(pin)
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
