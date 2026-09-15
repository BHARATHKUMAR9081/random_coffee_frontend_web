const STEPS = [
  { id: 1, label: 'Business details' },
  { id: 2, label: 'Business verification' },
  { id: 3, label: 'Identity verification' },
] as const

export function ProfileStepper({
  step,
  compact = false,
  className,
}: {
  step: 1 | 2 | 3
  compact?: boolean
  className?: string
}) {
  if (compact) {
    return (
      <nav aria-label="Steps" className={className || 'flex items-center'}>
        <ol className="flex items-center gap-1.5 sm:gap-2">
          {STEPS.map((item, index) => {
            const done = step > item.id
            const current = step === item.id
            return (
              <li key={item.id} className="flex items-center gap-1.5 text-xs">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                    done
                      ? 'bg-gold-500 text-navy-950 shadow-xs'
                      : current
                        ? 'bg-navy-950 text-white shadow-xs'
                        : 'bg-navy-900/10 text-navy-900/40'
                  }`}
                >
                  {done ? '✓' : item.id}
                </span>
                <span
                  className={`hidden sm:inline text-xs ${
                    current ? 'font-semibold text-navy-950' : done ? 'font-medium text-navy-900/70' : 'text-navy-900/40'
                  }`}
                >
                  {item.label}
                </span>
                {index < STEPS.length - 1 && (
                  <span className="text-navy-900/25 ml-1 select-none font-light">›</span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }

  return (
    <ol className={className || 'mt-5 grid grid-cols-3 gap-2'}>
      {STEPS.map((item, index) => {
        const done = step > item.id
        const current = step === item.id
        return (
          <li key={item.id} className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  done
                    ? 'bg-gold-500 text-navy-950'
                    : current
                      ? 'bg-navy-950 text-white'
                      : 'bg-navy-900/10 text-navy-900/45'
                }`}
              >
                {done ? '✓' : item.id}
              </span>
              {index < STEPS.length - 1 && (
                <span className={`hidden h-px flex-1 sm:block ${done ? 'bg-gold-500' : 'bg-navy-900/10'}`} />
              )}
            </div>
            <p className={`mt-2 text-[11px] font-medium leading-tight sm:text-xs ${current ? 'text-navy-950' : 'text-navy-900/45'}`}>
              {item.label}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
