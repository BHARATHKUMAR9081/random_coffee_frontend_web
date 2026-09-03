import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthTestimonial {
  quote: string
  name: string
  role: string
}

const defaultTestimonials: AuthTestimonial[] = [
  {
    quote: 'Found a Coimbatore supplier in one two-minute call. No spam, no pitches.',
    name: 'Arun Kumar',
    role: 'Manufacturer, Kovai Precision',
  },
  {
    quote: 'Every person on the other side is a real business — that trust is the whole product.',
    name: 'Meena Iyer',
    role: 'Investor, Chennai',
  },
  {
    quote: 'We closed a retail partnership the same week. It actually stays business-only.',
    name: 'Divya Shankar',
    role: 'Retailer, Madurai',
  },
]

interface AuthSplitLayoutProps {
  children: ReactNode
  imageSrc?: string
  imageAlt?: string
  eyebrow?: string
  headline?: string
  testimonials?: AuthTestimonial[]
}

export function AuthSplitLayout({
  children,
  imageSrc = '/auth-networking.jpg',
  imageAlt = 'Business professionals networking over coffee',
  eyebrow = 'Verified introductions',
  headline = 'Real business conversations, as quick as a cup of coffee.',
  testimonials = defaultTestimonials,
}: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white">
      <aside className="relative hidden min-h-screen w-[65%] overflow-hidden lg:block">
        <img src={imageSrc} alt={imageAlt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/55 to-navy-950/15" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            <span className="text-gold-500">Random</span>Coffee
          </Link>

          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">{eyebrow}</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight">{headline}</h2>
            {testimonials.length > 0 && (
              <div className="mt-8 grid gap-3">
                {testimonials.map((item) => (
                  <figure key={item.name} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                    <blockquote className="text-sm leading-relaxed text-white/90">“{item.quote}”</blockquote>
                    <figcaption className="mt-3 text-xs text-white/60">
                      <span className="font-semibold text-gold-300">{item.name}</span>
                      <span className="mx-1.5">·</span>
                      {item.role}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      <section className="flex w-full flex-col justify-center overflow-y-auto px-4 py-8 sm:px-10 lg:w-[35%] lg:px-12">
        <Link to="/" className="mb-8 text-lg font-semibold text-navy-950 lg:hidden">
          <span className="text-gold-500">Random</span>Coffee
        </Link>
        {children}
      </section>
    </div>
  )
}
