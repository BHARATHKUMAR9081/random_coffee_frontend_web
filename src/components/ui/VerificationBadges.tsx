export function VerificationBadges({
  business,
  identity,
  className = '',
}: {
  business?: boolean
  identity?: boolean
  className?: string
}) {
  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`.trim()}>
      <span
        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
          business ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}
      >
        {business ? 'Business verified' : 'Business unverified'}
      </span>
      <span
        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
          identity ? 'bg-sky-100 text-sky-800' : 'bg-navy-900/10 text-navy-900/55'
        }`}
      >
        {identity ? 'Identity verified' : 'Identity unverified'}
      </span>
    </div>
  )
}
