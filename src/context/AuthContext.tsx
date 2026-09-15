import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import {
  callHistoryAdded,
  changePlanThunk,
  clearAuth,
  hydrateAuth,
  loginThunk,
  loginWithLinkedInThunk,
  registerThunk,
  saveBillingThunk,
  saveProfileThunk,
  uploadProfilePhotoThunk,
  verifyBusinessThunk,
  verifyIdentityThunk,
} from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { emptyBilling } from '../services/billing'
import { computeCompletionPercent, emptyProfile, isProfileComplete } from '../services/profileService'
import { logoutAccount } from '../services/authService'
import type { BillingInfo, BusinessProfile, CallHistoryEntry, IdentityDocumentType, PlanId, UserAccount, VerificationStatus } from '../types'

interface AuthResult {
  success: boolean
  error?: string
  profilePhotoUrl?: string | null
}

interface AuthContextValue {
  isLoggedIn: boolean
  user: UserAccount
  callHistory: CallHistoryEntry[]
  register: (
    email: string,
    password: string,
    details: { firstName: string; lastName: string; termsAccepted: boolean; refundPolicyAccepted: boolean; privacyPolicyAccepted: boolean },
  ) => Promise<AuthResult>
  login: (email: string, password: string) => Promise<AuthResult>
  loginWithLinkedIn: (code: string, redirectUri?: string) => Promise<AuthResult>
  logout: () => void
  saveProfile: (profile: BusinessProfile) => Promise<AuthResult>
  uploadProfilePhoto: (file: File) => Promise<AuthResult>
  verifyBusiness: (businessIdNumber: string, idType?: string) => Promise<{ success: boolean; status: VerificationStatus; error?: string }>
  verifyIdentity: (
    selfie: File,
    document: File,
    documentType: IdentityDocumentType,
  ) => Promise<AuthResult>
  addCallHistoryEntry: (entry: CallHistoryEntry) => void
  changePlan: (planId: PlanId, billing?: BillingInfo) => Promise<AuthResult>
  saveBilling: (billing: BillingInfo) => Promise<AuthResult>
  billing: BillingInfo
  profileCompletionPercent: number
}

const AuthContext = createContext<AuthContextValue | null>(null)

function thunkError(error: unknown, fallback: string): string {
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  return fallback
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  useEffect(() => {
    void dispatch(hydrateAuth())
  }, [dispatch])

  const value = useMemo<AuthContextValue>(() => {
    const user: UserAccount = {
      id: auth.account?.id ?? '',
      profile: auth.profile ?? emptyProfile,
      verificationStatus: auth.verificationStatus,
      isIdentityVerified: Boolean(auth.isIdentityVerified),
      identitySelfieUrl: auth.identitySelfieUrl ?? null,
      identityVerification: auth.identityVerification ?? {
        status: 'UNVERIFIED',
        document_type: '',
        verified_at: null,
        similarity: null,
        name_on_id: '',
        failed_reason: null,
      },
      businessIdNumber: auth.businessIdNumber,
      planId: auth.planId,
    }

    return {
      isLoggedIn: auth.sessionKind === 'api' && Boolean(auth.account && auth.account.id !== 'demo'),
      user,
      callHistory: auth.callHistory,
      register: async (email, password, details) => {
        try {
          await dispatch(
            registerThunk({
              firstName: details.firstName,
              lastName: details.lastName,
              email,
              password,
              termsAccepted: details.termsAccepted,
              refundPolicyAccepted: details.refundPolicyAccepted,
              privacyPolicyAccepted: details.privacyPolicyAccepted,
            }),
          ).unwrap()
          return { success: true }
        } catch (error) {
          return { success: false, error: thunkError(error, 'Could not create your account.') }
        }
      },
      login: async (email, password) => {
        try {
          await dispatch(loginThunk({ email, password })).unwrap()
          return { success: true }
        } catch (error) {
          return { success: false, error: thunkError(error, 'Could not sign in.') }
        }
      },
      loginWithLinkedIn: async (code, redirectUri) => {
        try {
          await dispatch(loginWithLinkedInThunk({ code, redirectUri })).unwrap()
          return { success: true }
        } catch (error) {
          return { success: false, error: thunkError(error, 'Could not sign in with LinkedIn.') }
        }
      },
      logout: () => {
        if (auth.sessionKind === 'api') {
          void logoutAccount().catch(() => undefined)
        }
        dispatch(clearAuth())
      },
      saveProfile: async (profile) => {
        try {
          await dispatch(saveProfileThunk(profile)).unwrap()
          return { success: true }
        } catch (error) {
          return { success: false, error: thunkError(error, 'Could not save your profile.') }
        }
      },
      uploadProfilePhoto: async (file) => {
        try {
          const payload = await dispatch(uploadProfilePhotoThunk(file)).unwrap()
          return { success: true, profilePhotoUrl: payload.profile.profilePhotoUrl ?? null }
        } catch (error) {
          return { success: false, error: thunkError(error, 'Could not upload your photo.') }
        }
      },
      verifyBusiness: async (businessIdNumber, idType = 'GSTIN') => {
        try {
          const payload = await dispatch(verifyBusinessThunk({ idNumber: businessIdNumber, idType })).unwrap()
          const status = payload.profile.verification?.status ?? 'UNVERIFIED'
          return { success: status === 'VERIFIED', status }
        } catch (error) {
          return {
            success: false,
            status: 'UNVERIFIED',
            error: thunkError(error, 'Could not verify your business.'),
          }
        }
      },
      verifyIdentity: async (selfie, document, documentType) => {
        try {
          await dispatch(verifyIdentityThunk({ selfie, document, documentType })).unwrap()
          return { success: true }
        } catch (error) {
          return { success: false, error: thunkError(error, 'Could not verify your identity.') }
        }
      },
      addCallHistoryEntry: (entry) => {
        dispatch(callHistoryAdded(entry))
      },
      changePlan: async (planId, billing) => {
        try {
          await dispatch(changePlanThunk({ planId, billing })).unwrap()
          return { success: true }
        } catch (error) {
          return { success: false, error: thunkError(error, 'Could not update your plan.') }
        }
      },
      saveBilling: async (billing) => {
        try {
          await dispatch(saveBillingThunk(billing)).unwrap()
          return { success: true }
        } catch (error) {
          return { success: false, error: thunkError(error, 'Could not save billing details.') }
        }
      },
      billing: auth.billing ?? emptyBilling(),
      profileCompletionPercent: computeCompletionPercent(user.profile),
    }
  }, [auth, dispatch])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { isProfileComplete }
