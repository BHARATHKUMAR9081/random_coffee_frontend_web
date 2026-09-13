import { useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { INDUSTRY_PRESETS } from '../../types'
import { LANGUAGES } from '../../data/locations'

interface FieldWrapperProps {
  label: string
  htmlFor: string
  required?: boolean
  compact?: boolean
  children: ReactNode
}

export function FieldWrapper({ label, htmlFor, required, compact, children }: FieldWrapperProps) {
  return (
    <div className={`flex flex-col ${compact ? 'gap-1' : 'gap-1.5'}`}>
      <label htmlFor={htmlFor} className={`${compact ? 'text-xs font-semibold' : 'text-sm font-medium'} text-navy-900`}>
        {label}
        {required && <span className="text-gold-500"> *</span>}
      </label>
      {children}
    </div>
  )
}

const inputClasses =
  'w-full min-h-11 rounded-xl border border-navy-900/10 bg-navy-950/[0.03] px-3.5 py-2.5 text-base text-navy-950 placeholder:text-navy-900/35 transition-shadow focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/40 sm:text-sm'

const compactInputClasses =
  'w-full h-9 min-h-9 rounded-lg border border-navy-900/10 bg-navy-950/[0.03] px-3 py-1.5 text-xs text-navy-950 placeholder:text-navy-900/35 transition-shadow focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/40 sm:text-sm'

export function TextField({
  label,
  required,
  compact,
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; required?: boolean; compact?: boolean }) {
  return (
    <FieldWrapper label={label} htmlFor={props.id} required={required} compact={compact}>
      <input className={`${compact ? compactInputClasses : inputClasses} ${className}`.trim()} required={required} {...props} />
    </FieldWrapper>
  )
}

function EyeIcon({ off }: { off?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.75" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  )
}

export function PasswordField({
  label,
  required,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: string; id: string; required?: boolean }) {
  const [visible, setVisible] = useState(false)
  return (
    <FieldWrapper label={label} htmlFor={props.id} required={required}>
      <div className="relative">
        <input
          className={`${inputClasses} pr-11`}
          required={required}
          {...props}
          type={visible ? 'text' : 'password'}
        />
        <button
          type="button"
          onClick={() => setVisible((open) => !open)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-navy-900/45 hover:text-navy-900"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          <EyeIcon off={visible} />
        </button>
      </div>
    </FieldWrapper>
  )
}

export function TextAreaField({
  label,
  required,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; id: string; required?: boolean }) {
  return (
    <FieldWrapper label={label} htmlFor={props.id} required={required}>
      <textarea className={`${inputClasses} min-h-24 resize-y`} required={required} {...props} />
    </FieldWrapper>
  )
}

export function SelectField({
  label,
  required,
  compact,
  children,
  className = '',
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; id: string; required?: boolean; compact?: boolean }) {
  return (
    <FieldWrapper label={label} htmlFor={props.id} required={required} compact={compact}>
      <select
        className={`${compact ? compactInputClasses : inputClasses} ${className}`.trim()}
        required={required}
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  )
}

export function OtherSelect({
  id,
  label,
  required,
  compact,
  value,
  onChange,
  options,
  emptyLabel = 'Select',
  customLabel = 'Custom',
  optionLabel,
}: {
  id: string
  label: string
  required?: boolean
  compact?: boolean
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  emptyLabel?: string
  customLabel?: string
  optionLabel?: (option: string) => string
}) {
  const isPreset = options.includes(value)
  const [usingOther, setUsingOther] = useState(() => Boolean(value) && !isPreset)
  const showCustom = !isPreset && (usingOther || Boolean(value))
  const selected = showCustom ? 'Other' : value

  return (
    <div className={showCustom ? 'flex flex-col gap-2 sm:col-span-2' : undefined}>
      <SelectField
        id={id}
        label={label}
        required={required}
        compact={compact}
        value={selected}
        onChange={(e) => {
          const next = e.target.value
          if (next === 'Other') {
            setUsingOther(true)
            if (isPreset) onChange('')
            return
          }
          setUsingOther(false)
          onChange(next)
        }}
      >
        <option value="">{emptyLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabel ? optionLabel(option) : option}
          </option>
        ))}
        <option value="Other">Other</option>
      </SelectField>
      {showCustom && (
        <TextField
          id={`${id}Custom`}
          label={customLabel}
          required={required}
          compact={compact}
          placeholder={`Enter ${label.toLowerCase()}`}
          value={isPreset ? '' : value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}

export function IndustrySelect({
  id,
  label,
  required,
  compact,
  value,
  onChange,
  emptyLabel = 'Select industry',
}: {
  id: string
  label: string
  required?: boolean
  compact?: boolean
  value: string
  onChange: (value: string) => void
  emptyLabel?: string
}) {
  return (
    <OtherSelect
      id={id}
      label={label}
      required={required}
      compact={compact}
      value={value}
      onChange={onChange}
      options={INDUSTRY_PRESETS}
      emptyLabel={emptyLabel}
      customLabel="Custom industry"
    />
  )
}

export function LanguagePicker({
  label,
  required,
  values,
  onChange,
}: {
  label: string
  required?: boolean
  values: string[]
  onChange: (values: string[]) => void
}) {
  const [custom, setCustom] = useState('')
  const extras = values.filter((item) => !LANGUAGES.includes(item))

  function toggle(language: string) {
    onChange(values.includes(language) ? values.filter((item) => item !== language) : [...values, language])
  }

  function addCustom() {
    const next = custom.trim()
    if (!next) return
    if (!values.includes(next)) onChange([...values, next])
    setCustom('')
  }

  return (
    <div className="sm:col-span-2">
      <p className="mb-2 text-sm font-medium text-navy-900">
        {label}
        {required && <span className="text-gold-500"> *</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((language) => {
          const active = values.includes(language)
          return (
            <button
              type="button"
              key={language}
              onClick={() => toggle(language)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? 'border-gold-500 bg-gold-500/15 text-navy-950'
                  : 'border-navy-900/15 text-navy-900/70 hover:border-navy-900/30'
              }`}
            >
              {language}
            </button>
          )
        })}
        {extras.map((language) => (
          <button
            type="button"
            key={language}
            onClick={() => toggle(language)}
            className="rounded-full border border-gold-500 bg-gold-500/15 px-3 py-1.5 text-xs font-medium text-navy-950"
          >
            {language}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          id="customLanguage"
          className={inputClasses}
          placeholder="Other language"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addCustom()
            }
          }}
        />
        <button
          type="button"
          onClick={addCustom}
          className="min-h-11 shrink-0 rounded-xl border border-navy-900/15 px-4 text-sm font-medium text-navy-900 hover:border-navy-900/30"
        >
          Add
        </button>
      </div>
    </div>
  )
}
