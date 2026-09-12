import {
  TERMS_BUSINESS_NAME,
  TERMS_CONTACT,
  TERMS_CONTACT_HREF,
  TERMS_PLATFORM_NAME,
  TERMS_SECTIONS,
  TERMS_UPDATED,
} from '../../data/termsOfService'

export function TermsOfServiceContent({ compact = false }: { compact?: boolean }) {
  const headingClass = compact ? 'text-base font-semibold text-navy-950' : 'text-2xl font-semibold text-navy-950'
  const sectionTitleClass = compact
    ? 'text-sm font-semibold text-navy-950'
    : 'text-base font-semibold text-navy-950'
  const bodyClass = compact ? 'text-xs leading-relaxed text-navy-900/70' : 'text-sm leading-relaxed text-navy-900/70'

  return (
    <article>
      <h2 className={headingClass}>Terms of Service</h2>
      <p className={`mt-1 ${compact ? 'text-[11px] text-navy-900/45' : 'text-sm text-navy-900/50'}`}>
        Last updated: {TERMS_UPDATED}
        <span className="mx-1.5">·</span>
        Business name: {TERMS_BUSINESS_NAME}
        <span className="mx-1.5">·</span>
        Platform name: {TERMS_PLATFORM_NAME}
      </p>
      <p className={`mt-4 ${bodyClass}`}>
        These Terms of Service govern your use of RandomCoffee, including the website, mobile experience, profiles,
        matching system, video calls, messages, and related services.
      </p>
      <p className={`mt-2 ${bodyClass}`}>
        By creating an account or using RandomCoffee, you agree to these Terms, the Privacy Policy, and the Community
        Guidelines.
      </p>

      <div className={compact ? 'mt-4 space-y-4' : 'mt-6 space-y-6'}>
        {TERMS_SECTIONS.map((section) => (
          <section key={section.title}>
            <h3 className={sectionTitleClass}>{section.title}</h3>
            {section.paragraphs.slice(0, section.bullets ? 1 : undefined).map((paragraph) => (
              <p key={paragraph} className={`mt-1.5 ${bodyClass}`}>
                {paragraph}
              </p>
            ))}
            {section.bullets && (
              <ul className={`mt-2 list-disc space-y-1 pl-5 ${bodyClass}`}>
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.bullets &&
              section.paragraphs.slice(1).map((paragraph) => (
                <p key={paragraph} className={`mt-2 ${bodyClass}`}>
                  {paragraph}
                </p>
              ))}
          </section>
        ))}
      </div>

      <p className={`mt-5 ${bodyClass}`}>
        For support or legal questions, contact{' '}
        <a href={TERMS_CONTACT_HREF} className="font-medium text-gold-600 hover:underline">
          {TERMS_CONTACT}
        </a>
        .
      </p>
    </article>
  )
}
