export const COMMUNITY_GUIDELINES_UPDATED = '2/9/2026'
export const COMMUNITY_GUIDELINES_CONTACT = 'Info@vimix.app'
export const COMMUNITY_GUIDELINES_CONTACT_HREF = 'mailto:info@vimix.app'

export interface GuidelineSection {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export const COMMUNITY_GUIDELINE_SECTIONS: GuidelineSection[] = [
  {
    title: 'Use RandomCoffee for Business',
    paragraphs: [
      'Use RandomCoffee only for professional networking, business introductions, collaboration, products, services, suppliers, buyers, partnerships, mentoring, investment discussions, and legitimate commercial opportunities.',
      'Keep your profile, company details, and conversation purpose truthful and relevant.',
    ],
  },
  {
    title: 'Be Respectful',
    paragraphs: [
      'Treat every person professionally. Respect their time, identity, culture, language, gender, religion, background, and business choices.',
      'Do not insult, threaten, shame, pressure, intimidate, discriminate against, or repeatedly contact another user after they have declined, ended a call, or blocked you.',
    ],
  },
  {
    title: 'No Adult or Sexual Content',
    paragraphs: [
      'RandomCoffee has zero tolerance for:',
      'Violation may result in immediate suspension or permanent removal.',
    ],
    bullets: [
      'Nudity or sexually explicit content.',
      'Sexual conversations, gestures, requests, or harassment.',
      'Dating, romance, escort, or adult-service promotion.',
      'Showing sexually inappropriate material on camera.',
      'Asking another user to move to an unsafe or adult platform.',
    ],
  },
  {
    title: 'No Scams or Misrepresentation',
    paragraphs: [
      'Do not use RandomCoffee to deceive people. This includes:',
      'Always verify a business opportunity independently before making payments, signing agreements, sharing confidential information, or sending products.',
    ],
    bullets: [
      'Fake business identities, fake job offers, fake investment opportunities, or fake supplier/buyer claims.',
      'Requests for passwords, OTPs, bank details, payment-card details, or confidential documents.',
      'Pyramid schemes, get-rich-quick schemes, unlawful financial schemes, or misleading earnings claims.',
      'Counterfeit products, illegal goods, stolen goods, or prohibited services.',
      'Pretending to represent a company or person without authorization.',
    ],
  },
  {
    title: 'Protect Privacy',
    paragraphs: [
      'Do not record, screenshot, screen-share, stream, publish, or distribute another user’s video call, profile information, or private conversation without clear permission.',
      'Do not ask for unnecessary personal information. Do not share another person’s information without permission.',
    ],
  },
  {
    title: 'Use Camera Professionally',
    paragraphs: ['When joining a video call:'],
    bullets: [
      'Use a professional and appropriate setting.',
      'Keep your face visible when required by the platform.',
      'Do not display explicit, violent, hateful, illegal, or offensive material.',
      'Do not use the platform while driving or in unsafe situations.',
      'End the call if you feel uncomfortable or unsafe.',
    ],
  },
  {
    title: 'Report and Block',
    paragraphs: [
      'Use the Report feature if someone behaves inappropriately, appears to be fraudulent, violates these guidelines, or makes you feel unsafe.',
      'Use the Block feature if you do not want to interact with a user again. Blocking prevents future matches between you and that user.',
      'Do not misuse the reporting system to harm competitors, retaliate after a disagreement, or submit false claims.',
    ],
  },
  {
    title: 'Enforcement',
    paragraphs: [
      'RandomCoffee may review reports, profiles, and relevant platform activity. Depending on the seriousness or repetition of a violation, action may include:',
      'Serious violations, including sexual content, fraud, impersonation, harassment, threats, and illegal activity, may result in immediate removal without warning.',
    ],
    bullets: [
      'Warning',
      'Profile correction request',
      'Temporary feature restriction',
      'Temporary suspension',
      'Permanent account ban',
      'Referral to law enforcement or relevant authorities when required',
    ],
  },
  {
    title: 'Help Us Maintain Trust',
    paragraphs: [
      'Use real information. Be clear about what you offer and what you are looking for. Respect “no” and end conversations professionally. The goal is not random chatting—it is creating safe, valuable business connections.',
    ],
  },
]
