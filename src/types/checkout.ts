import type { Coupon } from './cart'

/* ---------- Steps ---------- */

export type CheckoutStep = 'shipping' | 'delivery' | 'payment' | 'review'

export const CHECKOUT_STEPS: ReadonlyArray<{ id: CheckoutStep; label: string }> = [
  { id: 'shipping', label: 'Shipping' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
]

/* ---------- Address ---------- */

export interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  /** ISO 3166-1 alpha-2 code, e.g. "AF", "US". Empty until chosen. */
  country: string
  region: string
  city: string
  street: string
  apartment: string
  postalCode: string
}

export type AddressField = keyof ShippingAddress

export type AddressErrors = Partial<Record<AddressField, string>>

export const EMPTY_ADDRESS: ShippingAddress = {
  fullName: '',
  email: '',
  phone: '',
  country: '',
  region: '',
  city: '',
  street: '',
  apartment: '',
  postalCode: '',
}

/** How a country treats one address part. */
export type FieldRule = 'required' | 'optional' | 'none'

export interface Country {
  code: string
  name: string
  /** State, province, county... what people there call it */
  regionLabel: string
  region: FieldRule
  postal: FieldRule
  /** Postal code format, when the country has a well-known one */
  postalPattern?: RegExp
  /** Example shown as the placeholder */
  postalExample?: string
}

/* ---------- Delivery ---------- */

export type DeliveryMethodId = 'economy' | 'standard' | 'express'

export interface DeliveryOption {
  id: DeliveryMethodId
  label: string
  description: string
  minDays: number
  maxDays: number
  priceCents: number
}

/** Chosen delivery method per seller (key = seller id from the cart groups). */
export type DeliverySelection = Readonly<Record<string, DeliveryMethodId>>

/* ---------- Payment ---------- */

export type PaymentMethodId = 'card' | 'paypal' | 'bank-transfer' | 'cash-on-delivery'

export interface PaymentMethod {
  id: PaymentMethodId
  label: string
  description: string
  /** Country codes where the method is offered, or "all" */
  availableIn: 'all' | readonly string[]
  /** What the demo explains to the customer once chosen */
  demoNote: string
}

/* ---------- Order (ready to send to a backend later) ---------- */

export interface OrderLine {
  productId: number
  name: string
  /** First product photo, or empty when the product has none */
  image: string
  /** e.g. [["Size","M"],["Color","Black"]] */
  choices: Array<[label: string, value: string]>
  quantity: number
  unitPriceCents: number
  totalCents: number
  /** Link back to the product page */
  path: string
}

export interface OrderSeller {
  sellerId: string
  storeName: string
  storeSlug: string | undefined
  lines: OrderLine[]
  delivery: DeliveryOption
  subtotalCents: number
  shippingCents: number
}

export interface OrderTotals {
  subtotalCents: number
  discountCents: number
  shippingCents: number
  totalCents: number
}

/**
 * Everything checkout collected. One order per customer, split by seller, so
 * a backend can later create one fulfilment order for each seller.
 */
export interface DemoOrder {
  /** Always true: nothing here was sent anywhere or paid for */
  demo: true
  reference: string
  placedAt: string
  customer: ShippingAddress
  sellers: OrderSeller[]
  paymentMethodId: PaymentMethodId
  coupon: Coupon | null
  totals: OrderTotals
}
