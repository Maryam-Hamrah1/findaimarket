import { findCoupon } from '../data/coupons'
import { getProductPath } from '../data/productDetails'
import type { CartLine, SellerGroup } from '../types/cart'
import type {
  DeliverySelection,
  DemoOrder,
  OrderLine,
  OrderSeller,
  PaymentMethodId,
  ShippingAddress,
} from '../types/checkout'
import { calculateCheckoutTotals, getSelectedOption } from './shipping'

/** Alphabet without look-alike characters (no 0/O, 1/I). */
const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function randomIndex(max: number): number {
  const cryptoApi = globalThis.crypto
  if (cryptoApi?.getRandomValues) {
    return cryptoApi.getRandomValues(new Uint32Array(1))[0] % max
  }
  return Math.floor(Math.random() * max)
}

/**
 * A reference like "FAI-DEMO-261117-K7M2QX". The word DEMO is part of it so
 * nobody can mistake it for a real order number.
 */
export function generateOrderReference(
  date: Date = new Date(),
  pick: (max: number) => number = randomIndex,
): string {
  const yy = String(date.getUTCFullYear()).slice(2)
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(date.getUTCDate()).padStart(2, '0')

  let suffix = ''
  for (let index = 0; index < 6; index += 1) {
    suffix += REFERENCE_ALPHABET[pick(REFERENCE_ALPHABET.length)]
  }

  return `FAI-DEMO-${yy}${mm}${dd}-${suffix}`
}

/** A cart line as it is stored in an order: a copy, so later price changes cannot alter it. */
export function toOrderLine(line: CartLine): OrderLine {
  return {
    productId: line.product.id,
    name: line.product.name,
    image: line.details.gallery[0]?.src ?? '',
    choices: line.choices,
    quantity: line.item.quantity,
    unitPriceCents: line.unitPriceCents,
    totalCents: line.lineTotalCents,
    path: getProductPath(line.product),
  }
}

interface BuildOrderInput {
  address: ShippingAddress
  groups: readonly SellerGroup[]
  selection: DeliverySelection
  paymentMethodId: PaymentMethodId
  couponCode: string | null
  now?: Date
  reference?: string
}

/** Turns the checkout state into one order, split by seller. Nothing is sent anywhere. */
export function buildDemoOrder({
  address,
  groups,
  selection,
  paymentMethodId,
  couponCode,
  now = new Date(),
  reference = generateOrderReference(now),
}: BuildOrderInput): DemoOrder {
  const totals = calculateCheckoutTotals(groups, address.country, selection, couponCode)

  const sellers: OrderSeller[] = groups.map((group) => ({
    sellerId: group.id,
    storeName: group.storeName,
    storeSlug: group.store?.slug,
    lines: group.lines.map(toOrderLine),
    delivery: getSelectedOption(group, address.country, selection),
    subtotalCents: group.subtotalCents,
    shippingCents: totals.shippingBySeller[group.id] ?? 0,
  }))

  return {
    demo: true,
    reference,
    placedAt: now.toISOString(),
    customer: address,
    sellers,
    paymentMethodId,
    coupon: findCoupon(couponCode) ?? null,
    totals: {
      subtotalCents: totals.subtotalCents,
      discountCents: totals.discountCents,
      shippingCents: totals.shippingCents,
      totalCents: totals.totalCents,
    },
  }
}
