import { findCoupon } from '../data/coupons'
import { getCountryCodeByName } from '../data/countries'
import type { CartLine, SellerGroup } from '../types/cart'
import type {
  DeliveryMethodId,
  DeliveryOption,
  DeliverySelection,
  OrderTotals,
} from '../types/checkout'
import { FREE_SHIPPING_FROM_CENTS, groupBySeller } from './cart'

/*
  DEMO shipping. These prices and times are invented for the prototype and
  are not real rates. A real shipping service replaces this file later; the
  rest of checkout only calls the functions exported here.
*/

export const DEFAULT_DELIVERY: DeliveryMethodId = 'standard'

/** International orders qualify for free standard delivery from this subtotal. */
const FREE_INTERNATIONAL_FROM_CENTS = FREE_SHIPPING_FROM_CENTS * 2

interface Rate {
  label: string
  description: string
  domestic: { days: [number, number]; priceCents: number }
  international: { days: [number, number]; priceCents: number }
}

const RATES: Record<DeliveryMethodId, Rate> = {
  economy: {
    label: 'Economy Delivery',
    description: 'Slowest and cheapest. Good when you are not in a hurry.',
    domestic: { days: [5, 8], priceCents: 300 },
    international: { days: [12, 20], priceCents: 900 },
  },
  standard: {
    label: 'Standard Delivery',
    description: 'A good balance of speed and price.',
    domestic: { days: [3, 5], priceCents: 500 },
    international: { days: [7, 12], priceCents: 1400 },
  },
  express: {
    label: 'Express Delivery',
    description: 'Fastest option, tracked all the way.',
    domestic: { days: [1, 2], priceCents: 1200 },
    international: { days: [3, 5], priceCents: 2800 },
  },
}

const ORDER: readonly DeliveryMethodId[] = ['economy', 'standard', 'express']

/** True when the seller's store is in the same country as the delivery address. */
function isDomestic(group: SellerGroup, destination: string): boolean {
  const storeCountry = group.store ? getCountryCodeByName(group.store.country) : undefined
  return storeCountry !== undefined && storeCountry === destination
}

/**
 * Delivery options one seller offers to the destination country.
 * Options differ by seller: unverified stores need an extra day to prepare the
 * parcel, and only verified stores offer express shipping abroad.
 */
export function getDeliveryOptions(
  group: SellerGroup,
  destination: string,
): DeliveryOption[] {
  const domestic = isDomestic(group, destination)
  const verified = group.store?.verified === true
  const handlingDays = verified ? 0 : 1
  const freeFrom = domestic ? FREE_SHIPPING_FROM_CENTS : FREE_INTERNATIONAL_FROM_CENTS

  return ORDER.filter((id) => id !== 'express' || domestic || verified).map((id) => {
    const rate = RATES[id]
    const where = domestic ? rate.domestic : rate.international
    const free = id === 'standard' && group.subtotalCents >= freeFrom

    return {
      id,
      label: rate.label,
      description: free
        ? `${rate.description} Free on this seller's orders over the demo threshold.`
        : rate.description,
      minDays: where.days[0] + handlingDays,
      maxDays: where.days[1] + handlingDays,
      priceCents: free ? 0 : where.priceCents,
    }
  })
}

/** The chosen option, or Standard (or the first one offered) when the choice is missing. */
export function getSelectedOption(
  group: SellerGroup,
  destination: string,
  selection: DeliverySelection,
): DeliveryOption {
  const options = getDeliveryOptions(group, destination)
  const wanted = selection[group.id] ?? DEFAULT_DELIVERY

  return (
    options.find((option) => option.id === wanted) ??
    options.find((option) => option.id === DEFAULT_DELIVERY) ??
    options[0]
  )
}

export function formatDeliveryTime(option: DeliveryOption): string {
  return option.minDays === option.maxDays
    ? `${option.minDays} business ${option.minDays === 1 ? 'day' : 'days'}`
    : `${option.minDays}–${option.maxDays} business days`
}

/* ---------------------------------------------------------
   Groups and totals
   --------------------------------------------------------- */

/** Cart lines that can be bought now (not saved for later, not unavailable), by seller. */
export function getCheckoutGroups(lines: readonly CartLine[]): SellerGroup[] {
  return groupBySeller(
    lines.filter((line) => !line.item.savedForLater && line.status === 'ok'),
  )
}

export interface CheckoutTotals extends OrderTotals {
  /** Shipping per seller after any coupon, keyed by seller id */
  shippingBySeller: Record<string, number>
}

export function calculateCheckoutTotals(
  groups: readonly SellerGroup[],
  destination: string,
  selection: DeliverySelection,
  couponCode: string | null,
): CheckoutTotals {
  const coupon = findCoupon(couponCode)
  const subtotalCents = groups.reduce((sum, group) => sum + group.subtotalCents, 0)

  const discountCents = coupon?.percent
    ? Math.round((subtotalCents * coupon.percent) / 100)
    : 0

  const shippingBySeller: Record<string, number> = {}
  let shippingCents = 0

  for (const group of groups) {
    const option = getSelectedOption(group, destination, selection)
    const price = coupon?.freeShipping ? 0 : option.priceCents
    shippingBySeller[group.id] = price
    shippingCents += price
  }

  return {
    subtotalCents,
    discountCents,
    shippingCents,
    totalCents: subtotalCents - discountCents + shippingCents,
    shippingBySeller,
  }
}
