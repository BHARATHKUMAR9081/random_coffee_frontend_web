import {
  PRIVACY_POLICY_ADDRESS,
  PRIVACY_POLICY_BUSINESS,
  PRIVACY_POLICY_CONTACT,
  PRIVACY_POLICY_CONTACT_HREF,
  PRIVACY_POLICY_SECTIONS,
  PRIVACY_POLICY_UPDATED,
} from '../../data/privacyPolicy'

export function PrivacyPolicyContent({ compact = false }: { compact?: boolean }) {
  const headingClass = compact ? 'text-base font-semibold text-navy-950' : 'text-2xl font-semibold text-navy-950'
  const sectionTitleClass = compact
    ? 'text-sm font-semibold text-navy-950'
    : 'text-base font-semibold text-navy-950'
  const bodyClass = compact ? 'text-xs leading-relaxed text-navy-900/70' : 'text-sm leading-relaxed text-navy-900/70'

  return (
    <article>
      <h2 className={headingClass}>Privacy Policy</h2>
      <p className={`mt-1 ${compact ? 'text-[11px] text-navy-900/45' : 'text-sm text-navy-900/50'}`}>
        Last updated: {PRIVACY_POLICY_UPDATED}
        <span className="mx-1.5">·</span>
        Business name: {PRIVACY_POLICY_BUSINESS}
        <span className="mx-1.5">·</span>
        Platform name: RandomCoffee
      </p>
      <p className={`mt-4 ${bodyClass}`}>
        RandomCoffee is a professional business-networking platform that helps verified entrepreneurs, founders,
        manufacturers, traders, retailers, suppliers, buyers, freelancers, and service providers discover and connect
        with relevant business people through profiles, matching, and video conversations.
      </p>

      <div className={compact ? 'mt-4 space-y-4' : 'mt-6 space-y-6'}>
        {PRIVACY_POLICY_SECTIONS.map((section) => (
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
        For privacy questions or requests, contact {PRIVACY_POLICY_BUSINESS} at{' '}
        <a href={PRIVACY_POLICY_CONTACT_HREF} className="font-medium text-gold-600 hover:underline">
          {PRIVACY_POLICY_CONTACT}
        </a>
        . Registered address: {PRIVACY_POLICY_ADDRESS}.
      </p>
    </article>
  )
}
