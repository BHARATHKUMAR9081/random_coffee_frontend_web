import {
  COMMUNITY_GUIDELINE_SECTIONS,
  COMMUNITY_GUIDELINES_CONTACT,
  COMMUNITY_GUIDELINES_CONTACT_HREF,
  COMMUNITY_GUIDELINES_UPDATED,
} from '../../data/communityGuidelines'

export function CommunityGuidelinesContent({ compact = false }: { compact?: boolean }) {
  const headingClass = compact ? 'text-base font-semibold text-navy-950' : 'text-2xl font-semibold text-navy-950'
  const sectionTitleClass = compact
    ? 'text-sm font-semibold text-navy-950'
    : 'text-base font-semibold text-navy-950'
  const bodyClass = compact ? 'text-xs leading-relaxed text-navy-900/70' : 'text-sm leading-relaxed text-navy-900/70'

  return (
    <article>
      <h2 className={headingClass}>Community Guidelines</h2>
      <p className={`mt-1 ${compact ? 'text-[11px] text-navy-900/45' : 'text-sm text-navy-900/50'}`}>
        Last updated: {COMMUNITY_GUIDELINES_UPDATED}
        <span className="mx-1.5">·</span>
        Platform name: RandomCoffee
      </p>
      <p className={`mt-4 ${bodyClass}`}>
        RandomCoffee exists for genuine professional connections. Every user should feel safe, respected, and able to
        discuss legitimate business opportunities.
      </p>

      <div className={compact ? 'mt-4 space-y-4' : 'mt-6 space-y-6'}>
        {COMMUNITY_GUIDELINE_SECTIONS.map((section) => (
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
        For safety concerns, contact:{' '}
        <a href={COMMUNITY_GUIDELINES_CONTACT_HREF} className="font-medium text-gold-600 hover:underline">
          {COMMUNITY_GUIDELINES_CONTACT}
        </a>
        .
      </p>
    </article>
  )
}
