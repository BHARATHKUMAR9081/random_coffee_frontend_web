import type { BillingInfo, PlanId } from '../types'
import { postJson } from './http'
import type { UserPayload } from './authService'

export interface RazorpayOrder {
  keyId: string
  orderId: string
  amount: number
  currency: string
  planId: PlanId
  planName: string
  prefill: {
    name: string
    email: string
    contact: string
  }
}

export interface RazorpaySuccess {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

interface RazorpayCheckout {
  open: () => void
  close: () => void
}

interface RazorpayConstructor {
  new (options: Record<string, unknown>): RazorpayCheckout
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor
  }
}

export function createPlanOrder(planId: PlanId, billing: BillingInfo): Promise<RazorpayOrder> {
  return postJson<RazorpayOrder>('/api/accounts/payments/order/', { planId, billing })
}

export function verifyPlanPayment(payload: RazorpaySuccess): Promise<UserPayload> {
  return postJson<UserPayload>('/api/accounts/payments/verify/', payload)
}

export function loadRazorpay(): Promise<RazorpayConstructor> {
  if (window.Razorpay) return Promise.resolve(window.Razorpay)
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-razorpay="checkout"]')
    if (existing) {
      existing.addEventListener('load', () => (window.Razorpay ? resolve(window.Razorpay) : reject(new Error('Razorpay failed to load.'))))
      existing.addEventListener('error', () => reject(new Error('Could not load Razorpay.')))
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.dataset.razorpay = 'checkout'
    script.onload = () => (window.Razorpay ? resolve(window.Razorpay) : reject(new Error('Razorpay failed to load.')))
    script.onerror = () => reject(new Error('Could not load Razorpay.'))
    document.body.appendChild(script)
  })
}

export function openRazorpayCheckout(order: RazorpayOrder): Promise<RazorpaySuccess> {
  return loadRazorpay().then(
    (Razorpay) =>
      new Promise((resolve, reject) => {
        const checkout = new Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: 'RandomCoffee',
          description: `${order.planName} plan`,
          order_id: order.orderId,
          prefill: order.prefill,
          notes: { planId: order.planId },
          theme: { color: '#C69B56' },
          handler: (response: RazorpaySuccess) => resolve(response),
          modal: {
            ondismiss: () => reject(new Error('Payment was cancelled.')),
          },
        })
        checkout.open()
      }),
  )
}
