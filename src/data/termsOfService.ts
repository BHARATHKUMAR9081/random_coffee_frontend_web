export const TERMS_UPDATED = '2/9/2026'
export const TERMS_BUSINESS_NAME = 'VIMIX TECHNOLOGIES LLP'
export const TERMS_PLATFORM_NAME = 'RandomCoffee'
export const TERMS_CONTACT = 'info@vimix.app'
export const TERMS_CONTACT_HREF = 'mailto:info@vimix.app'

export interface TermsSection {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export const TERMS_SECTIONS: TermsSection[] = [
  {
    title: 'Eligibility',
    paragraphs: [
      'You must be at least 18 years old to use RandomCoffee.',
      'You must provide accurate information, use your real identity, and represent your business truthfully. You must not create an account for another person without permission or impersonate an individual, company, organization, or brand.',
      'RandomCoffee may require identity or business verification before allowing access to matching or video features.',
    ],
  },
  {
    title: 'Platform Purpose',
    paragraphs: [
      'RandomCoffee is a professional networking platform. It helps users discover and communicate with potential business contacts, including customers, suppliers, buyers, service providers, partners, mentors, and investors.',
      'RandomCoffee does not guarantee business opportunities, sales, investments, employment, contracts, partnerships, product quality, payment, delivery, or outcomes from any connection made through the platform.',
      'Users are responsible for conducting their own due diligence before entering into any business, financial, legal, commercial, or personal arrangement.',
    ],
  },
  {
    title: 'Account Responsibility',
    paragraphs: [
      'You are responsible for all activity conducted through your account. You must keep your login details secure and notify us immediately at info@vimix.app if you suspect unauthorized access.',
      'You must not share your account, access credentials, or video-room access with another person.',
    ],
  },
  {
    title: 'Video Calls and Matching',
    paragraphs: [
      'RandomCoffee may match users based on profile information, business type, industry, location, language, interests, and connection preferences.',
      'A match does not mean that RandomCoffee endorses, guarantees, verifies, recommends, or approves another user, their company, their products, or their claims.',
      'You may end a call at any time. You may report or block another user if you experience inappropriate conduct, fraud, spam, or any policy violation.',
    ],
  },
  {
    title: 'Prohibited Conduct',
    paragraphs: ['You must not:'],
    bullets: [
      'Use RandomCoffee for adult, sexual, dating, escort, or explicit activity.',
      'Share nudity, sexual content, abusive content, violent content, or illegal material.',
      'Harass, threaten, stalk, discriminate against, or intimidate another person.',
      'Commit or attempt fraud, scams, phishing, impersonation, or misleading business activity.',
      'Promote illegal products, services, gambling, weapons, drugs, or prohibited financial schemes.',
      'Record, screenshot, distribute, stream, or share another user’s call, image, profile, or information without their permission.',
      'Use bots, scripts, scraping tools, automation, reverse engineering, or unauthorized access methods.',
      'Circumvent bans, verification, moderation controls, or platform restrictions.',
      'Use the platform for any unlawful purpose.',
    ],
  },
  {
    title: 'Moderation and Enforcement',
    paragraphs: [
      'RandomCoffee may use human review, user reports, technical safeguards, and automated safety systems to detect and respond to possible violations.',
      'We may investigate activity and take action including content removal, warnings, profile rejection, feature restrictions, temporary suspension, permanent account termination, or reporting to relevant authorities where required.',
      'RandomCoffee may act without prior notice when necessary to protect users, the platform, or the public.',
    ],
  },
  {
    title: 'User Content',
    paragraphs: [
      'You retain ownership of content you submit to RandomCoffee, including your profile details and business description. By submitting content, you grant RandomCoffee a limited, non-exclusive, worldwide license to host, process, display, and use that content solely to operate, improve, secure, and promote the platform.',
      'You confirm that you have the rights and permissions needed to submit your content.',
    ],
  },
  {
    title: 'Intellectual Property',
    paragraphs: [
      `RandomCoffee, its name, logo, software, designs, features, and content are owned by or licensed to ${TERMS_BUSINESS_NAME}. You may not copy, modify, distribute, sell, or exploit any part of the platform without written permission.`,
    ],
  },
  {
    title: 'Suspension and Termination',
    paragraphs: [
      'You may stop using RandomCoffee at any time.',
      'We may suspend or terminate your account if you violate these Terms, the Community Guidelines, applicable law, or platform safety requirements. Termination does not remove obligations that by their nature should continue, including dispute, liability, intellectual-property, and payment obligations.',
    ],
  },
  {
    title: 'Disclaimer',
    paragraphs: [
      'RandomCoffee is provided on an “as is” and “as available” basis. We do not guarantee uninterrupted availability, error-free operation, successful matches, or any particular commercial result.',
      'We are not responsible for the conduct, statements, products, services, transactions, or actions of other users.',
    ],
  },
  {
    title: 'Limitation of Liability',
    paragraphs: [
      `To the maximum extent permitted by law, ${TERMS_BUSINESS_NAME} will not be liable for indirect, incidental, special, consequential, or business losses arising from your use of RandomCoffee or interactions with other users.`,
    ],
  },
  {
    title: 'Governing Law',
    paragraphs: [
      'These Terms are governed by the laws of India. Courts located in Chennai, Tamil Nadu, India will have exclusive jurisdiction over disputes, subject to applicable law.',
    ],
  },
]
