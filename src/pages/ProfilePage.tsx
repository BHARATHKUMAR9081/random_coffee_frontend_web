import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { ProfilePhotoField } from '../components/ui/ProfilePhotoField'
import { IdentitySelfieField } from '../components/ui/IdentitySelfieField'
import { ProfileStepper } from '../components/ui/ProfileStepper'
import { VerificationBadges } from '../components/ui/VerificationBadges'
import { IndustrySelect, OtherSelect, SelectField, TextField } from '../components/ui/Field'
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
    <div className={`mx-auto ${step === 1 ? 'max-w-6xl' : 'max-w-2xl'}`}>
      {/* Sleek Compact Header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-navy-900/8 pb-2.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1 rounded-lg border border-navy-900/10 bg-white px-2.5 py-1 text-xs font-medium text-navy-900/70 shadow-xs hover:bg-navy-900/5 hover:text-navy-950 transition"
          >
            ← Back
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-navy-950 sm:text-lg">{titles[step].heading}</h1>
              <VerificationBadges business={businessVerified} identity={user.isIdentityVerified} />
            </div>
            <p className="text-xs text-navy-900/55 hidden sm:block">{titles[step].copy}</p>
          </div>
        </div>
        <ProfileStepper step={step} compact />
      </div>

      {step === 1 && (
        <form
          onSubmit={handleStepOne}
          className="rounded-2xl border border-navy-900/8 bg-white p-4 sm:p-5 text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.12)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Personal & Company Details (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-2.5">
              {/* Row 1: Profile Photo + Names */}
              <div className="flex items-center gap-3.5">
                <ProfilePhotoField
                  value={form.profilePhotoUrl}
                  name={`${form.firstName} ${form.lastName}`.trim() || user.profile.email || 'You'}
                  uploading={photoUploading}
                  disabled={isSaving}
                  compact
                  onFile={(file) => void handlePhoto(file)}
                />
                <div className="grid flex-1 grid-cols-2 gap-2.5">
                  <TextField
                    id="firstName"
                    label="First name"
                    required
                    compact
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                  />
                  <TextField
                    id="lastName"
                    label="Last name"
                    required
                    compact
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                  />
                </div>
              </div>

              {/* Row 2: Mobile & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <TextField
                  id="mobileNumber"
                  label="Mobile number"
                  required
                  compact
                  value={form.mobileNumber}
                  onChange={(e) => update('mobileNumber', e.target.value)}
                />
                <TextField
                  id="email"
                  label="Email address"
                  compact
                  value={form.email}
                  disabled
                />
              </div>

              {/* Row 3: Company & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <TextField
                  id="companyName"
                  label={NON_BUSINESS_TYPES.has(form.businessType) ? 'Company / Org (optional)' : 'Company name'}
                  required={!NON_BUSINESS_TYPES.has(form.businessType)}
                  compact
                  value={form.companyName}
                  onChange={(e) => update('companyName', e.target.value)}
                />
                <TextField
                  id="companyWebsite"
                  label="Website / LinkedIn (opt)"
                  compact
                  value={form.companyWebsite}
                  onChange={(e) => update('companyWebsite', e.target.value)}
                />
              </div>

              {/* Row 4: Business Type & Industry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <SelectField
                  id="businessType"
                  label="Business type"
                  required
                  compact
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
                  compact
                  value={form.industry}
                  onChange={(value) => update('industry', value)}
                />
              </div>

              {/* Row 5: Country, State, City */}
              <div className="grid grid-cols-3 gap-2">
                <OtherSelect
                  id="country"
                  label="Country"
                  compact
                  value={form.country}
                  options={COUNTRIES.map((country) => country.name)}
                  optionLabel={(name) => `${countryFlag(name)} ${name}`.trim()}
                  emptyLabel="Country"
                  customLabel="Custom"
                  onChange={(country) => setForm((prev) => ({ ...prev, country, state: '', city: '' }))}
                />
                <OtherSelect
                  key={`state-${form.country}`}
                  id="state"
                  label="State"
                  compact
                  value={form.state}
                  options={getStates(form.country)}
                  emptyLabel="State"
                  customLabel="Custom"
                  onChange={(state) => setForm((prev) => ({ ...prev, state, city: '' }))}
                />
                <OtherSelect
                  key={`city-${form.country}-${form.state}`}
                  id="city"
                  label="City"
                  required
                  compact
                  value={form.city}
                  options={getCities(form.country, form.state)}
                  emptyLabel="City"
                  customLabel="Custom"
                  onChange={(city) => update('city', city)}
                />
              </div>
            </div>

            {/* Right Column (5 cols): Description, Looking For intents, and Action button */}
            <div className="lg:col-span-5 flex flex-col justify-between self-stretch border-t border-navy-900/8 pt-3 lg:border-t-0 lg:border-l lg:pl-5 lg:pt-0 gap-3">
              {/* Short business description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="shortDescription" className="text-xs font-semibold text-navy-900">
                    Short business description <span className="text-gold-500">*</span>
                  </label>
                  <span className={`text-[11px] font-medium ${isShortDescriptionValid(form.shortDescription) ? 'text-emerald-600' : 'text-navy-900/50'}`}>
                    {form.shortDescription.trim().length}/{SHORT_DESCRIPTION_MIN} min
                  </span>
                </div>
                <textarea
                  id="shortDescription"
                  rows={3}
                  required
                  minLength={SHORT_DESCRIPTION_MIN}
                  value={form.shortDescription}
                  onChange={(e) => update('shortDescription', e.target.value)}
                  placeholder="What does your business do? How do you create value for customers or partners? (min 50 characters)"
                  className="w-full rounded-xl border border-navy-900/10 bg-navy-950/[0.03] p-2.5 text-xs text-navy-950 placeholder:text-navy-900/35 transition-shadow focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/40 resize-none h-20 leading-relaxed"
                />
              </div>

              {/* What are you looking for? */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-navy-900">
                    What are you looking for? <span className="text-gold-500">*</span>
                  </p>
                  <span className="text-[11px] text-navy-900/45">Select all relevant</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {connectionIntents.map((intent) => {
                    const active = form.lookingFor.includes(intent)
                    return (
                      <button
                        type="button"
                        key={intent}
                        onClick={() => toggleIntent(intent)}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                          active
                            ? 'border-gold-500 bg-gold-500/20 text-navy-950 font-semibold shadow-xs'
                            : 'border-navy-900/10 bg-navy-900/[0.02] text-navy-900/70 hover:border-navy-900/25 hover:bg-navy-900/5'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}{intent}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Submit & Error area */}
              <div className="pt-1">
                {error && (
                  <div className="mb-2 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700 flex items-start gap-1.5">
                    <span>⚠️</span>
                    <span className="flex-1">{error}</span>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full py-2.5 text-sm font-semibold shadow-md transition-transform active:scale-[0.99]"
                  disabled={isSaving || photoUploading}
                >
                  {isSaving ? 'Saving…' : 'Save and continue →'}
                </Button>
                <p className="mt-1 text-center text-[10px] text-navy-900/40">
                  Profile details are used to match you with relevant connections
                </p>
              </div>
            </div>
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
