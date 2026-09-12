import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'md' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-gold-500 text-navy-950 shadow-[0_1px_2px_rgba(0,0,0,0.15)] hover:bg-gold-400 hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:translate-y-0',
  secondary: 'bg-navy-800 text-white hover:bg-navy-700 disabled:opacity-50',
  ghost: 'bg-transparent text-navy-800 hover:bg-navy-900/5 disabled:opacity-50',
  danger: 'bg-red-600 text-white hover:bg-red-500 disabled:opacity-50',
}

const sizeClasses: Record<Size, string> = {
  md: 'min-h-11 rounded-full px-5 py-2.5 text-sm font-semibold',
  sm: 'h-7 min-h-0 rounded-md px-2.5 text-xs font-medium leading-none',
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 transition-all duration-150 touch-manipulation disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
