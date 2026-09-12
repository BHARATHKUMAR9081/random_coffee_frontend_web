import { OtherSelect, TextField } from '../ui/Field'
import { COUNTRIES, countryFlag, getCities, getStates } from '../../data/locations'
import { normalizeGstin } from '../../lib/validation'
import type { BillingInfo } from '../../types'

export function BillingForm({
  value,
  onChange,
  idPrefix = 'billing',
  verifiedGstin = '',
}: {
  value: BillingInfo
  onChange: (next: BillingInfo) => void
  idPrefix?: string
  verifiedGstin?: string
}) {
  const gstinLocked = Boolean(verifiedGstin || value.gstinVerified)
  const gstinValue = verifiedGstin || value.gstin

  function update<K extends keyof BillingInfo>(key: K, next: BillingInfo[K]) {
    onChange({ ...value, [key]: next })
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField
        id={`${idPrefix}LegalName`}
        label="Billing name"
        required
        value={value.legalName}
        onChange={(e) => update('legalName', e.target.value)}
        placeholder="Legal name on the invoice"
      />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor={`${idPrefix}Gstin`} className="text-sm font-medium text-navy-900">
            GSTIN
          </label>
          {gstinLocked && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
              Verified
            </span>
          )}
        </div>
        <input
          id={`${idPrefix}Gstin`}
          value={gstinValue}
          readOnly={gstinLocked}
          onChange={(e) => {
            if (gstinLocked) return
            update('gstin', normalizeGstin(e.target.value))
          }}
          placeholder={gstinLocked ? undefined : 'Optional'}
          className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-shadow focus:outline-none ${
            gstinLocked
              ? 'cursor-not-allowed border-green-200 bg-green-50 text-navy-950'
              : 'border-navy-900/10 bg-navy-950/[0.03] text-navy-950 placeholder:text-navy-900/35 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-gold-500/40'
          }`}
        />
        {gstinLocked && (
          <p className="text-xs text-green-700">This GSTIN was verified and cannot be changed.</p>
        )}
      </div>
      <TextField
        id={`${idPrefix}Email`}
        label="Billing email"
        type="email"
        required
        value={value.billingEmail}
        onChange={(e) => update('billingEmail', e.target.value)}
      />
      <TextField
        id={`${idPrefix}Phone`}
        label="Billing mobile"
        required
        value={value.billingPhone}
        onChange={(e) => update('billingPhone', e.target.value)}
        placeholder="10-digit mobile"
      />
      <div className="sm:col-span-2">
        <TextField
          id={`${idPrefix}Address`}
          label="Address"
          required
          value={value.addressLine}
          onChange={(e) => update('addressLine', e.target.value)}
          placeholder="Building, street, area"
        />
      </div>
      <OtherSelect
        id={`${idPrefix}Country`}
        label="Country"
        required
        value={value.country}
        options={COUNTRIES.map((country) => country.name)}
        optionLabel={(name) => `${countryFlag(name)} ${name}`.trim()}
        emptyLabel="Select country"
        customLabel="Custom country"
        onChange={(country) => onChange({ ...value, country, state: '', city: '' })}
      />
      <OtherSelect
        key={`${idPrefix}-state-${value.country}`}
        id={`${idPrefix}State`}
        label="State"
        required
        value={value.state}
        options={getStates(value.country)}
        emptyLabel="Select state"
        customLabel="Custom state"
        onChange={(state) => onChange({ ...value, state, city: '' })}
      />
      <OtherSelect
        key={`${idPrefix}-city-${value.country}-${value.state}`}
        id={`${idPrefix}City`}
        label="City"
        required
        value={value.city}
        options={getCities(value.country, value.state)}
        emptyLabel="Select city"
        customLabel="Custom city"
        onChange={(city) => update('city', city)}
      />
      <TextField
        id={`${idPrefix}Pincode`}
        label="PIN code"
        required
        value={value.pincode}
        onChange={(e) => update('pincode', e.target.value)}
        placeholder="6-digit PIN"
      />
    </div>
  )
}
