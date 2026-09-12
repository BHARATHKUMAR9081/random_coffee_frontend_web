export const PRIVACY_POLICY_UPDATED = '2/9/2026'
export const PRIVACY_POLICY_BUSINESS = 'VIMIX TECHNOLOGIES LLP'
export const PRIVACY_POLICY_CONTACT = 'info@vimix.app'
export const PRIVACY_POLICY_CONTACT_HREF = 'mailto:info@vimix.app'
export const PRIVACY_POLICY_ADDRESS = '1131, National Colony, Sivakasi, Tamil Nadu - 626189'

export interface PrivacyPolicySection {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export const PRIVACY_POLICY_SECTIONS: PrivacyPolicySection[] = [
  {
    title: 'Information We Collect',
    paragraphs: ['We may collect:'],
    bullets: [
      'Name, mobile number, email address, profile photo, and login information.',
      'Business details such as company name, business type, industry, city, language, business description, website, and LinkedIn profile.',
      'Verification information and documents submitted for account verification.',
      'Match preferences, connection history, feedback, reports, blocks, and moderation-related records.',
      'Technical information such as device type, browser, IP address, approximate location, log data, cookies, and usage activity.',
      'Communications sent to our support, moderation, or administration teams.',
    ],
  },
  {
    title: 'Video and Camera Use',
    paragraphs: [
      'RandomCoffee requests access to your camera and microphone only when you choose to join a video conversation.',
      'Calls are not recorded by default. However, users may report another user during or after a call. Reports, account activity, technical logs, and information voluntarily submitted to our moderation team may be reviewed to investigate misuse, fraud, harassment, or policy violations.',
      'Future safety features may use automated systems to identify potentially unsafe or prohibited activity. Where such systems are used, RandomCoffee may restrict, review, suspend, or investigate accounts in accordance with its Community Guidelines.',
    ],
  },
  {
    title: 'How We Use Information',
    paragraphs: ['We use your information to:'],
    bullets: [
      'Create and manage your account.',
      'Verify users and business profiles.',
      'Match you with relevant business connections.',
      'Provide video calling, profile, and networking features.',
      'Prevent fraud, spam, impersonation, harassment, and misuse.',
      'Investigate reports and enforce our Terms and Community Guidelines.',
      'Improve platform performance, user experience, safety, and matching quality.',
      'Send important service, security, account, and policy communications.',
      'Meet legal, regulatory, and business obligations.',
    ],
  },
  {
    title: 'When We Share Information',
    paragraphs: [
      'We may share limited profile information with other matched users, such as your name, business name, business category, city, language, and business description.',
      'We may also share information with trusted service providers that help us operate the platform, including hosting, authentication, video communication, analytics, security, payment, and customer-support providers.',
      'We may disclose information when required by law, to protect users or the public, to investigate fraud or abuse, or during a merger, acquisition, restructuring, or sale of business assets.',
      'We do not sell your personal information.',
    ],
  },
  {
    title: 'Data Security',
    paragraphs: [
      'We use reasonable technical and organizational safeguards to protect personal information. However, no online platform, transmission, or storage system can be guaranteed to be completely secure. You are responsible for keeping your login credentials confidential.',
    ],
  },
  {
    title: 'Data Retention',
    paragraphs: [
      'We retain your information only as long as necessary to provide the service, comply with legal obligations, resolve disputes, enforce agreements, and maintain platform safety.',
      'You may request account deletion by contacting info@vimix.app. Some information, such as reports, moderation records, audit logs, fraud-prevention data, and information required by law, may be retained for a longer period where necessary.',
    ],
  },
  {
    title: 'Your Choices',
    paragraphs: [
      'You may update your profile and preferences through your account settings. You may withdraw camera or microphone permission through your browser or device settings, but some video features may not work without those permissions.',
      'You may request access, correction, deletion, or clarification regarding your personal information by contacting info@vimix.app.',
    ],
  },
  {
    title: 'Children',
    paragraphs: [
      'RandomCoffee is intended only for users aged 18 years or older. We do not knowingly collect personal information from children.',
    ],
  },
  {
    title: 'Changes to This Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised “Last updated” date. Continued use of RandomCoffee after changes become effective means you accept the updated policy.',
    ],
  },
]
