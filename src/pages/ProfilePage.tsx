import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { ProfilePhotoField } from '../components/ui/ProfilePhotoField'
import { IdentitySelfieField } from '../components/ui/IdentitySelfieField'
import { ProfileStepper } from '../components/ui/ProfileStepper'
import { VerificationBadges } from '../components/ui/VerificationBadges'
import { IndustrySelect, OtherSelect, SelectField, TextAreaField, TextField } from '../components/ui/Field'
import { COUNTRIES, countryFlag, getCities, getStates } from '../data/locations'
import { isValidGstin, isValidIndianMobile, normalizeGstin } from '../lib/validation'
import {
  isProfileComplete,
  isShortDescriptionValid,
  prepareIdentityImage,
  SHORT_DESCRIPTION_MIN,
  validateProfilePhoto,
} from '../services/profileService'
import { IDENTITY_DOCUMENT_TYPES, NON_BUSINESS_TYPES, type BusinessProfile, type BusinessType, type ConnectionIntent, type IdentityDocumentType } from '../types'

const businessTypes: BusinessType[] = [
  'Business Owner',
  'Startup Founder',
  'Aspiring Founder',
  'Co-founder Seeker',
  'Student',
  'Professional',
  'Freelancer',
  'Buyer',
  'Supplier',
  'Service Provider',
  'Manufacturer',
  'Trader',
  'Retailer',
  'Investor',
  'Mentor',
  'Other',
]

const connectionIntents: ConnectionIntent[] = [
  'Customers',
  'Suppliers',
  'Buyers',
  'Business Partners',
  'Investors',
  'Mentors',
  'Service Providers',
  'General Networking',
]

const idTypes = ['GSTIN', 'Certificate of Incorporation', 'Udyam Registration', 'International equivalent']

type SetupStep = 1 | 2 | 3

function parseStep(value: string | null, fallback: SetupStep): SetupStep {
  const parsed = Number(value)
  return parsed === 1 || parsed === 2 || parsed === 3 ? parsed : fallback
}

function startingStep(profileComplete: boolean, businessVerified: boolean, identityVerified: boolean): SetupStep {
  if (!profileComplete) return 1
  if (!businessVerified) return 2
  if (!identityVerified) return 3
  return 1
}

export function ProfilePage() {
  const { user, saveProfile, uploadProfilePhoto, verifyBusiness, verifyIdentity } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const isNonBusiness = NON_BUSINESS_TYPES.has(user.profile.businessType)
  const profileComplete = isProfileComplete(user.profile)
  const businessVerified = user.verificationStatus === 'VERIFIED' || isNonBusiness
  const defaultStep = startingStep(profileComplete, businessVerified, user.isIdentityVerified)
  const step = parseStep(searchParams.get('step'), defaultStep)
  const [form, setForm] = useState<BusinessProfile>(user.profile)
  const [idType, setIdType] = useState(idTypes[0])
  const [idNumber, setIdNumber] = useState(user.businessIdNumber ?? '')
  const [documentType, setDocumentType] = useState<IdentityDocumentType>('passport')
  const [selfie, setSelfie] = useState<File | null>(null)
  const [idDocument, setIdDocument] = useState<File | null>(null)
  const [idPreview, setIdPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [identityError, setIdentityError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [identitySaving, setIdentitySaving] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const gstinLocked = businessVerified && isValidGstin(user.businessIdNumber ?? '')
  const titles = useMemo(
    () =>
      ({
        1: {
          heading: 'Business details',
          copy: 'Add a photo and the details matching uses to pair you with the right people.',
        },
        2: {
          heading: 'Business verification',
          copy: 'Verify GSTIN or another business identifier. Matching unlocks after a successful check.',
        },
        3: {
          heading: 'Identity verification',
          copy: 'Take a live selfie and photograph your ID. This is checked now, then used again when a call starts.',
        },
      }) as const,
    [],
  )

  function goToStep(next: SetupStep) {
    setError(null)
    setIdentityError(null)
    setSearchParams({ step: String(next) }, { replace: true })
  }

  function update<K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggleIntent(intent: ConnectionIntent) {
    setForm((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(intent)
        ? prev.lookingFor.filter((i) => i !== intent)
        : [...prev.lookingFor, intent],
    }))
  }

  async function handlePhoto(file: File) {
    setError(null)
    setPhotoUploading(true)
    const uploaded = await uploadProfilePhoto(file)
    setPhotoUploading(false)
    if (!uploaded.success) {
      setError(uploaded.error ?? 'Could not upload your photo.')
      return
    }
    update('profilePhotoUrl', uploaded.profilePhotoUrl ?? null)
  }

  async function handleIdDocument(file: File | undefined) {
    setIdentityError(null)
    if (!file) return
    const invalid = validateProfilePhoto(file)
    if (invalid) {
      setIdentityError(invalid)
      return
    }
    try {
      const prepared = await prepareIdentityImage(file)
      setIdDocument(prepared)
      setIdPreview(URL.createObjectURL(prepared))
    } catch (err) {
      setIdentityError(err instanceof Error ? err.message : 'Could not use that ID photo.')
    }
  }

  async function handleStepOne(e: React.FormEvent) {
    e.preventDefault()
    if (!form.profilePhotoUrl) {
      setError('Add a profile photo.')
      return
    }
    const formIsNonBusiness = NON_BUSINESS_TYPES.has(form.businessType)
    if (
      !form.firstName ||
      !form.lastName ||
      (!formIsNonBusiness && !form.companyName) ||
      !form.businessType ||
      !form.industry.trim() ||
      !form.city ||
      !isShortDescriptionValid(form.shortDescription) ||
      form.lookingFor.length === 0
    ) {
      setError(
        `Please fill in your name, ${formIsNonBusiness ? '' : 'company, '}business type, industry, city, a short description of at least ${SHORT_DESCRIPTION_MIN} characters, and at least one "looking for" option.`,
      )
      return
    }
    if (!isValidIndianMobile(form.mobileNumber)) {
      setError('Enter a valid 10-digit Indian mobile number.')
      return
    }
    setError(null)
    setIsSaving(true)
    const saved = await saveProfile({
      ...form,
      preferredLanguages: form.preferredLanguages && form.preferredLanguages.length > 0 ? form.preferredLanguages : ['English'],
      fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
    })
    setIsSaving(false)
    if (!saved.success) {
      setError(saved.error ?? 'Could not save your profile.')
      return
    }
    goToStep(2)
  }

  async function handleStepTwo(e: React.FormEvent) {
    e.preventDefault()
    if (gstinLocked) {
      goToStep(3)
      return
    }
    const trimmedId = idType === 'GSTIN' ? normalizeGstin(idNumber) : idNumber.trim()
    if (!trimmedId) {
      setError(`Enter your ${idType}.`)
      return
    }
    if (idType === 'GSTIN' && !isValidGstin(trimmedId)) {
      setError('Enter a valid 15-character GSTIN.')
      return
    }
    setError(null)
    setIsSaving(true)
    const verified = await verifyBusiness(trimmedId, idType)
    setIsSaving(false)
    if (verified.error) {
      setError(verified.error)
      return
    }
    goToStep(3)
  }

  async function handleIdentityVerify() {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setIdentityError('Save your first and last name in step 1 before identity verification.')
      return
    }
    if (!selfie) {
      setIdentityError('Take a live selfie with the camera. A gallery photo is not accepted.')
      return
    }
    if (!idDocument) {
      setIdentityError('Upload a photo of your passport, driving licence, or voter ID.')
      return
    }
    setIdentityError(null)
    setIdentitySaving(true)
    const result = await verifyIdentity(selfie, idDocument, documentType)
    setIdentitySaving(false)
    if (!result.success) {
      setIdentityError(result.error ?? 'Could not verify your identity.')
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-navy-900/55 hover:text-navy-950"
      >
        ← Back
      </button>
      <h1 className="text-xl font-semibold text-navy-950 sm:text-2xl">{titles[step].heading}</h1>
      <p className="mt-1 text-sm text-navy-900/55">{titles[step].copy}</p>
      <VerificationBadges className="mt-3" business={businessVerified} identity={user.isIdentityVerified} />
      <ProfileStepper step={step} />

      {step === 1 && (
        <form onSubmit={handleStepOne} className="mt-6 flex flex-col gap-6 rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
          <ProfilePhotoField
            value={form.profilePhotoUrl}
            name={`${form.firstName} ${form.lastName}`.trim() || user.profile.email || 'You'}
            uploading={photoUploading}
            disabled={isSaving}
            onFile={(file) => void handlePhoto(file)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="firstName"
              label="First name"
              required
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
            />
            <TextField
              id="lastName"
              label="Last name"
              required
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
            />
            <TextField id="mobileNumber" label="Mobile number" required value={form.mobileNumber} onChange={(e) => update('mobileNumber', e.target.value)} />
            <TextField id="email" label="Email address" value={form.email} disabled />
            <TextField
              id="companyName"
              label={NON_BUSINESS_TYPES.has(form.businessType) ? 'Company / Organization (optional)' : 'Company name'}
              required={!NON_BUSINESS_TYPES.has(form.businessType)}
              value={form.companyName}
              onChange={(e) => update('companyName', e.target.value)}
            />
            <TextField
              id="companyWebsite"
              label="Company website or LinkedIn (optional)"
              value={form.companyWebsite}
              onChange={(e) => update('companyWebsite', e.target.value)}
            />
            <SelectField
              id="businessType"
              label="Business type"
              required
              value={form.businessType}
              onChange={(e) => update('businessType', e.target.value as BusinessType)}
            >
              <option value="">Select business type</option>
              {businessTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </SelectField>
            <IndustrySelect
              id="industry"
              label="Industry / category"
              required
              value={form.industry}
              onChange={(value) => update('industry', value)}
            />
            <div className="grid gap-4 sm:col-span-2 sm:grid-cols-3">
              <OtherSelect
                id="country"
                label="Country"
                value={form.country}
                options={COUNTRIES.map((country) => country.name)}
                optionLabel={(name) => `${countryFlag(name)} ${name}`.trim()}
                emptyLabel="Select country"
                customLabel="Custom country"
                onChange={(country) => setForm((prev) => ({ ...prev, country, state: '', city: '' }))}
              />
              <OtherSelect
                key={`state-${form.country}`}
                id="state"
                label="State"
                value={form.state}
                options={getStates(form.country)}
                emptyLabel="Select state"
                customLabel="Custom state"
                onChange={(state) => setForm((prev) => ({ ...prev, state, city: '' }))}
              />
              <OtherSelect
                key={`city-${form.country}-${form.state}`}
                id="city"
                label="City"
                required
                value={form.city}
                options={getCities(form.country, form.state)}
                emptyLabel="Select city"
                customLabel="Custom city"
                onChange={(city) => update('city', city)}
              />
            </div>
          </div>

          <div>
            <TextAreaField
              id="shortDescription"
              label="Short business description"
              required
              minLength={SHORT_DESCRIPTION_MIN}
              value={form.shortDescription}
              onChange={(e) => update('shortDescription', e.target.value)}
              placeholder="What does your business do? At least 50 characters."
            />
            <p className={`mt-1 text-xs ${isShortDescriptionValid(form.shortDescription) ? 'text-navy-900/45' : 'text-navy-900/60'}`}>
              {form.shortDescription.trim().length}/{SHORT_DESCRIPTION_MIN} characters minimum
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-navy-900">
              What are you looking for? <span className="text-gold-500">*</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {connectionIntents.map((intent) => {
                const active = form.lookingFor.includes(intent)
                return (
                  <button
                    type="button"
                    key={intent}
                    onClick={() => toggleIntent(intent)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? 'border-gold-500 bg-gold-500/15 text-navy-950'
                        : 'border-navy-900/15 text-navy-900/70 hover:border-navy-900/30'
                    }`}
                  >
                    {intent}
                  </button>
                )
              })}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="submit" className="w-full sm:w-auto" disabled={isSaving || photoUploading}>
              {isSaving ? 'Saving…' : 'Save and continue'}
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleStepTwo} className="mt-6 flex flex-col gap-5 rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-navy-950">Business identifier</h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                businessVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {businessVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
          <SelectField
            id="idType"
            label="Identifier type"
            value={idType}
            disabled={gstinLocked}
            onChange={(e) => setIdType(e.target.value)}
          >
            {idTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </SelectField>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="idNumber" className="text-sm font-medium text-navy-900">
                {idType} <span className="text-gold-500">*</span>
              </label>
              {gstinLocked && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                  Verified
                </span>
              )}
            </div>
            <input
              id="idNumber"
              value={idNumber}
              readOnly={gstinLocked}
              placeholder={idType === 'GSTIN' ? 'e.g. 03AAAAA0000A1Z5' : 'Business identifier'}
              onChange={(e) => {
                if (gstinLocked) return
                setIdNumber(idType === 'GSTIN' ? normalizeGstin(e.target.value) : e.target.value)
              }}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-shadow focus:outline-none ${
                gstinLocked
                  ? 'cursor-not-allowed border-green-200 bg-green-50 text-navy-950'
                  : 'border-navy-900/10 bg-navy-950/[0.03] text-navy-950 placeholder:text-navy-900/35 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-gold-500/40'
              }`}
            />
          </div>
          <p className="text-xs text-navy-900/50">
            {gstinLocked
              ? 'This GSTIN was verified and cannot be changed.'
              : idType === 'GSTIN'
                ? 'GSTIN is checked against the GST registry. Matching unlocks after a successful Active GSTIN verification.'
                : 'We run instant verification on this identifier when you continue.'}
          </p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => goToStep(1)}>
              Back
            </Button>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => goToStep(3)}>
                Skip for now
              </Button>
              <Button type="submit" className="w-full sm:w-auto" disabled={isSaving}>
                {isSaving ? 'Verifying…' : gstinLocked ? 'Continue' : 'Verify and continue'}
              </Button>
            </div>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-navy-900/8 bg-white p-4 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-navy-950">Confirm who you are</h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                user.isIdentityVerified ? 'bg-sky-100 text-sky-800' : 'bg-navy-900/10 text-navy-900/55'
              }`}
            >
              {user.isIdentityVerified ? 'Identity verified' : 'Identity unverified'}
            </span>
          </div>
          <IdentitySelfieField
            storedUrl={user.identitySelfieUrl}
            captured={selfie}
            disabled={isSaving || identitySaving}
            onCapture={setSelfie}
          />
          <SelectField
            id="documentType"
            label="ID document"
            required
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as IdentityDocumentType)}
          >
            {IDENTITY_DOCUMENT_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </SelectField>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="idDocument" className="text-sm font-medium text-navy-900">
              Photo of ID <span className="text-gold-500">*</span>
            </label>
            <input
              id="idDocument"
              type="file"
              accept="image/*"
              disabled={isSaving || identitySaving}
              onChange={(event) => {
                void handleIdDocument(event.target.files?.[0])
                event.target.value = ''
              }}
              className="block w-full text-sm text-navy-900/70 file:mr-3 file:rounded-full file:border-0 file:bg-navy-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-800"
            />
            {idPreview && (
              <img src={idPreview} alt="ID preview" className="mt-1 h-36 w-full max-w-xs rounded-xl object-cover ring-1 ring-navy-900/10" />
            )}
            <p className="text-xs text-navy-900/45">Passport, driving licence, or voter ID. The ID photo is checked, then discarded.</p>
          </div>
          {user.identityVerification.failed_reason && !user.isIdentityVerified && (
            <p className="text-xs text-red-600">{user.identityVerification.failed_reason}</p>
          )}
          {identityError && <p className="text-sm text-red-600">{identityError}</p>}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => goToStep(2)}>
              Back
            </Button>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => navigate('/dashboard')}>
                Finish later
              </Button>
              <Button
                type="button"
                className="w-full sm:w-auto"
                disabled={isSaving || identitySaving || photoUploading}
                onClick={() => void handleIdentityVerify()}
              >
                {identitySaving ? 'Checking identity…' : user.isIdentityVerified ? 'Re-verify identity' : 'Verify identity'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
