export const REFUND_POLICY_UPDATED = '2/9/2026'
export const REFUND_POLICY_BUSINESS = 'VIMIX TECHNOLOGIES LLP'
export const REFUND_POLICY_CONTACT = 'info@vimix.app'
export const REFUND_POLICY_CONTACT_HREF = 'mailto:info@vimix.app'

export interface RefundPolicySection {
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export const REFUND_POLICY_SECTIONS: RefundPolicySection[] = [
  {
    title: 'Free Access',
    paragraphs: [
      'RandomCoffee may offer free registration, profile creation, verification, matchmaking, or limited video-networking features. No refund applies to free services because no payment is collected.',
    ],
  },
  {
    title: 'Paid Plans',
    paragraphs: [
      'If RandomCoffee introduces paid subscriptions, premium memberships, featured business profiles, verification services, event access, advertising, lead-generation services, or other paid features, the pricing and applicable benefits will be displayed before payment.',
      'Unless a separate written agreement states otherwise, payments are non-refundable once a paid service, subscription period, featured placement, verification process, event access, or digital feature has been activated or delivered.',
    ],
  },
  {
    title: 'Cancellation',
    paragraphs: [
      'You may cancel a recurring subscription through your account settings or by contacting info@vimix.app.',
      'Cancellation stops future renewal charges. Your paid access will continue until the end of the current billing period unless otherwise stated at the time of purchase.',
      'Deleting your account does not automatically cancel an active subscription. You must cancel the subscription separately before the next renewal date.',
    ],
  },
  {
    title: 'Refund Requests',
    paragraphs: [
      'Refund requests may be considered only in limited situations, such as:',
      'To request a review, email info@vimix.app within 7 days of payment and include your registered email address, transaction ID, payment date, and a clear description of the issue.',
      'Approved refunds, if any, will be processed to the original payment method within 7–14 business days, subject to payment-provider processing timelines.',
    ],
    bullets: [
      'Duplicate payment caused by a technical error.',
      'An incorrect amount charged due to a verified platform billing error.',
      'A paid feature was not activated due to a confirmed technical failure caused by RandomCoffee.',
      'A refund is required under applicable law.',
    ],
  },
  {
    title: 'No Refund Situations',
    paragraphs: ['Refunds will generally not be provided for:'],
    bullets: [
      'Change of mind after purchasing a plan.',
      'Failure to use the service.',
      'Unsatisfactory business outcomes, lack of leads, lack of sales, or lack of successful matches.',
      'Account restrictions, suspension, or termination caused by a violation of the Terms or Community Guidelines.',
      'Services already delivered, activated, consumed, or used.',
      'Delays caused by incomplete verification information submitted by the user.',
    ],
  },
  {
    title: 'Changes',
    paragraphs: [
      'We may revise pricing, plans, features, and this policy in the future. Changes will apply from the stated effective date.',
    ],
  },
]
