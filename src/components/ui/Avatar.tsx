import { resolveMediaUrl } from '../../services/profileService'

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'RC'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

const sizeClasses = {
  sm: 'h-8 w-8 text-[11px]',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-sm',
  xl: 'h-20 w-20 text-lg',
}

export function Avatar({
  src,
  name,
  size = 'md',
  className = '',
  fallbackClassName = 'bg-gold-500 text-navy-950',
}: {
  src?: string | null
  name: string
  size?: keyof typeof sizeClasses
  className?: string
  fallbackClassName?: string
}) {
  const url = resolveMediaUrl(src)
  const frame = `${sizeClasses[size]} rounded-full ${className}`
  if (url) {
    return <img src={url} alt="" className={`${frame} object-cover`} />
  }
  return (
    <div className={`flex items-center justify-center font-semibold ${frame} ${fallbackClassName}`}>
      {initials(name)}
    </div>
  )
}
