import type { ReactNode } from 'react'

export function SettingsCard({
  title,
  subtitle,
  actions,
  danger,
  children,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
  danger?: boolean
  children: ReactNode
}) {
  return (
    <section
      className={`mt-6 overflow-hidden rounded-2xl border bg-white text-navy-950 shadow-[0_8px_24px_-16px_rgba(10,22,40,0.2)] ${
        danger ? 'border-red-200' : 'border-navy-900/8'
      }`}
    >
      <div
        className={`flex flex-col gap-3 border-b px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:px-5 ${
          danger ? 'border-red-100 bg-red-50/70' : 'border-navy-900/8 bg-navy-950/[0.03]'
        }`}
      >
        <div>
          <h2 className={`text-sm font-semibold uppercase tracking-wide ${danger ? 'text-red-600' : 'text-navy-900/50'}`}>
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-sm text-navy-900/55">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  )
}
