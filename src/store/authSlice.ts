import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { createDemoAccountRecord } from '../data/demoAccount'
import { ApiError } from '../services/http'
import {
  changeAccountPlan,
  fetchCurrentUser,
  loginAccount,
  registerAccount,
  saveAccountBilling,
  saveAccountProfile,
  uploadAccountProfilePhoto,
  verifyAccountBusiness,
  verifyAccountIdentity,
  type AuthSession,
  type SessionAccount,
  type SessionProfile,
  type UserPayload,
} from '../services/authService'
import { billingFromProfile, emptyBilling } from '../services/billing'
import { verifyPlanPayment, type RazorpaySuccess } from '../services/paymentService'
import { emptyProfile, verifyBusinessId } from '../services/profileService'
import { asLanguageList, type BillingInfo, type BusinessProfile, type CallHistoryEntry, type IdentityDocumentType, type IdentityVerification, type PlanId, type VerificationStatus } from '../types'

export type SessionKind = 'anonymous' | 'api' | 'demo'

export interface AuthState {
  sessionKind: SessionKind
  accessToken: string | null
  refreshToken: string | null
  account: SessionAccount | null
  profile: BusinessProfile
  isProfileVerified: boolean
  isIdentityVerified: boolean
  identitySelfieUrl: string | null
  identityVerification: IdentityVerification
  verificationStatus: VerificationStatus
  businessIdNumber: string | null
  planId: PlanId
  billing: BillingInfo
  callHistory: CallHistoryEntry[]
  status: 'idle' | 'loading'
  error: string | null
}

function asPlanId(value: string | undefined): PlanId {
  if (value === 'priority') return 'basic'
  if (value === 'premium') return 'pro'
  if (value === 'remove-ads' || value === 'filters' || !value?.trim()) return 'free'
  return value.trim()
}

function toBusinessProfile(profile: SessionProfile | BusinessProfile | null | undefined): BusinessProfile {
  if (!profile) return { ...emptyProfile }
  return {
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    fullName: profile.fullName ?? '',
    profilePhotoUrl: profile.profilePhotoUrl ?? null,
    mobileNumber: profile.mobileNumber ?? '',
    email: profile.email ?? '',
    companyName: profile.companyName ?? '',
    companyWebsite: profile.companyWebsite ?? '',
    businessType: profile.businessType ?? '',
    industry: profile.industry ?? '',
    city: profile.city ?? '',
    state: profile.state ?? '',
    country: profile.country || 'India',
    preferredLanguages: asLanguageList(
      'preferredLanguages' in profile ? profile.preferredLanguages : (profile as { preferredLanguage?: string }).preferredLanguage,
    ),
    shortDescription: profile.shortDescription ?? '',
    lookingFor: profile.lookingFor ?? [],
  }
}

function emptyIdentityVerification(): IdentityVerification {
  return {
    status: 'UNVERIFIED',
    document_type: '',
    verified_at: null,
    similarity: null,
    name_on_id: '',
    failed_reason: null,
  }
}

function applyUserPayload(state: AuthState, payload: UserPayload) {
  state.account = payload.account
  state.profile = toBusinessProfile(payload.profile)
  state.isProfileVerified = payload.profile.isProfileVerified
  state.isIdentityVerified = Boolean(payload.profile.isIdentityVerified)
  state.identitySelfieUrl = payload.profile.identitySelfieUrl ?? null
  state.identityVerification = payload.profile.identityVerification ?? emptyIdentityVerification()
  state.verificationStatus = payload.profile.verification?.status ?? 'UNVERIFIED'
  state.businessIdNumber = payload.profile.verification?.id_number || null
  state.planId = asPlanId(payload.account.plan?.id)
  if (payload.billing) state.billing = emptyBilling(payload.billing)
  state.status = 'idle'
  state.error = null
}

function applySession(state: AuthState, session: AuthSession) {
  state.sessionKind = 'api'
  state.accessToken = session.accessToken
  state.refreshToken = session.refreshToken
  applyUserPayload(state, session)
}

function rejectMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  return fallback
}

const initialState: AuthState = {
  sessionKind: 'anonymous',
  accessToken: null,
  refreshToken: null,
  account: null,
  profile: emptyProfile,
  isProfileVerified: false,
  isIdentityVerified: false,
  identitySelfieUrl: null,
  identityVerification: {
    status: 'UNVERIFIED',
    document_type: '',
    verified_at: null,
    similarity: null,
    name_on_id: '',
    failed_reason: null,
  },
  verificationStatus: 'UNVERIFIED',
  businessIdNumber: null,
  planId: 'free',
  billing: emptyBilling(),
  callHistory: [],
  status: 'idle',
  error: null,
}

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (
    payload: { firstName: string; lastName: string; email: string; password: string; termsAccepted: boolean; refundPolicyAccepted: boolean; privacyPolicyAccepted: boolean },
    { rejectWithValue },
  ) => {
    try {
      return await registerAccount(payload)
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Could not create your account.'))
    }
  },
)

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await loginAccount(payload.email, payload.password)
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Could not sign in.'))
    }
  },
)

export const hydrateAuth = createAsyncThunk('auth/hydrate', async (_, { getState, rejectWithValue }) => {
  const { auth } = getState() as { auth: AuthState }
  if (auth.sessionKind !== 'api' || !auth.refreshToken) return null
  try {
    return await fetchCurrentUser()
  } catch (error) {
    return rejectWithValue(rejectMessage(error, 'Session expired.'))
  }
})

export const saveProfileThunk = createAsyncThunk(
  'auth/saveProfile',
  async (profile: BusinessProfile, { rejectWithValue }) => {
    try {
      return await saveAccountProfile(profile)
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Could not save your profile.'))
    }
  },
)

export const uploadProfilePhotoThunk = createAsyncThunk(
  'auth/uploadProfilePhoto',
  async (file: File, { rejectWithValue }) => {
    try {
      return await uploadAccountProfilePhoto(file)
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Could not upload your photo.'))
    }
  },
)

export const verifyBusinessThunk = createAsyncThunk(
  'auth/verifyBusiness',
  async (payload: { idNumber: string; idType: string }, { rejectWithValue }) => {
    try {
      return await verifyAccountBusiness(payload.idNumber, payload.idType)
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Could not verify your business.'))
    }
  },
)

export const verifyIdentityThunk = createAsyncThunk(
  'auth/verifyIdentity',
  async (
    payload: { selfie: File; document: File; documentType: IdentityDocumentType },
    { rejectWithValue },
  ) => {
    try {
      return await verifyAccountIdentity(payload.selfie, payload.document, payload.documentType)
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Could not verify your identity.'))
    }
  },
)

export const changePlanThunk = createAsyncThunk(
  'auth/changePlan',
  async (payload: { planId: PlanId; billing?: BillingInfo }, { rejectWithValue }) => {
    try {
      return await changeAccountPlan(payload.planId, payload.billing)
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Could not update your plan.'))
    }
  },
)

export const verifyPaymentThunk = createAsyncThunk(
  'auth/verifyPayment',
  async (payload: RazorpaySuccess, { rejectWithValue }) => {
    try {
      return await verifyPlanPayment(payload)
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Could not confirm your payment.'))
    }
  },
)

export const saveBillingThunk = createAsyncThunk(
  'auth/saveBilling',
  async (billing: BillingInfo, { rejectWithValue }) => {
    try {
      return await saveAccountBilling(billing)
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Could not save billing details.'))
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) {
      state.accessToken = action.payload.accessToken
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken
      }
    },
    clearAuth() {
      return initialState
    },
    loginDemo(state) {
      const demo = createDemoAccountRecord()
      state.sessionKind = 'demo'
      state.accessToken = null
      state.refreshToken = null
      state.account = {
        id: 'demo',
        firstName: demo.profile.firstName,
        lastName: demo.profile.lastName,
        email: demo.profile.email,
        plan: { id: demo.planId, started_at: null },
        isActive: true,
        isLogin: true,
        lastLogin: new Date().toISOString(),
        isAvailable: false,
        termsAccepted: true,
        refundPolicyAccepted: true,
        privacyPolicyAccepted: true,
        createdAt: null,
      }
      state.profile = demo.profile
      state.isProfileVerified = demo.verificationStatus === 'VERIFIED'
      state.isIdentityVerified = false
      state.identitySelfieUrl = null
      state.identityVerification = {
        status: 'UNVERIFIED',
        document_type: '',
        verified_at: null,
        similarity: null,
        name_on_id: '',
        failed_reason: null,
      }
      state.verificationStatus = demo.verificationStatus
      state.businessIdNumber = demo.businessIdNumber
      state.planId = demo.planId
      state.billing = billingFromProfile(demo.profile, {
        legalName: demo.profile.fullName,
        gstin: demo.businessIdNumber,
        addressLine: '12 Avinashi Road',
        pincode: '641014',
      })
      state.callHistory = demo.callHistory
      state.status = 'idle'
      state.error = null
    },
    profileSavedLocal(state, action: PayloadAction<BusinessProfile>) {
      state.profile = action.payload
    },
    verifiedLocal(state, action: PayloadAction<{ idNumber: string; status: VerificationStatus }>) {
      state.businessIdNumber = action.payload.idNumber
      state.verificationStatus = action.payload.status
      state.isProfileVerified = action.payload.status === 'VERIFIED'
    },
    identityVerifiedLocal(state) {
      state.isIdentityVerified = true
      state.identityVerification = {
        status: 'VERIFIED',
        document_type: 'passport',
        verified_at: new Date().toISOString(),
        similarity: 100,
        name_on_id: `${state.profile.firstName} ${state.profile.lastName}`.trim(),
        failed_reason: null,
      }
    },
    planChangedLocal(state, action: PayloadAction<PlanId>) {
      state.planId = action.payload
      if (state.account) {
        state.account.plan = { id: action.payload, started_at: state.account.plan.started_at }
      }
    },
    billingSavedLocal(state, action: PayloadAction<BillingInfo>) {
      state.billing = action.payload
    },
    callHistoryAdded(state, action: PayloadAction<CallHistoryEntry>) {
      state.callHistory = [action.payload, ...state.callHistory]
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        applySession(state, action.payload)
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = 'idle'
        state.error = (action.payload as string | undefined) ?? 'Could not create your account.'
      })
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        applySession(state, action.payload)
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'idle'
        state.error = (action.payload as string | undefined) ?? 'Could not sign in.'
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        if (action.payload) applyUserPayload(state, action.payload)
      })
      .addCase(hydrateAuth.rejected, () => initialState)
      .addCase(saveProfileThunk.fulfilled, (state, action) => {
        applyUserPayload(state, action.payload)
      })
      .addCase(uploadProfilePhotoThunk.fulfilled, (state, action) => {
        applyUserPayload(state, action.payload)
      })
      .addCase(verifyBusinessThunk.fulfilled, (state, action) => {
        applyUserPayload(state, action.payload)
      })
      .addCase(verifyIdentityThunk.fulfilled, (state, action) => {
        applyUserPayload(state, action.payload)
      })
      .addCase(changePlanThunk.fulfilled, (state, action) => {
        applyUserPayload(state, action.payload)
      })
      .addCase(saveBillingThunk.fulfilled, (state, action) => {
        applyUserPayload(state, action.payload)
      })
      .addCase(verifyPaymentThunk.fulfilled, (state, action) => {
        applyUserPayload(state, action.payload)
      })
  },
})

export const {
  setTokens,
  clearAuth,
  loginDemo,
  profileSavedLocal,
  verifiedLocal,
  identityVerifiedLocal,
  planChangedLocal,
  billingSavedLocal,
  callHistoryAdded,
} = authSlice.actions

export { verifyBusinessId }

export default authSlice.reducer
