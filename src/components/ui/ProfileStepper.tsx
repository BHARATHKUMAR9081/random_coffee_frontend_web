const STEPS = [
  { id: 1, label: 'Business details' },
  { id: 2, label: 'Business verification' },
  { id: 3, label: 'Identity verification' },
] as const

export function ProfileStepper({ step }: { step: 1 | 2 | 3 }) {
  return (
    <ol className="mt-5 grid grid-cols-3 gap-2">
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
