import { getCountry } from '../data/countries'
import type { DemoOrder, OrderLine } from '../types/checkout'
import type { OrderStatus, SellerOrder, SellerProductRecord, Tracking } from '../types/seller'

export const ORDER_STATUSES: ReadonlyArray<{ value: OrderStatus; label: string }> = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
]

export function statusLabel(status: OrderStatus): string {
  return ORDER_STATUSES.find((item) => item.value === status)?.label ?? status
}

const NEXT: Record<OrderStatus, ReadonlyArray<OrderStatus>> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
}

/** The statuses a seller may move this order to from where it is now. */
export function allowedNextStatuses(status: OrderStatus): ReadonlyArray<OrderStatus> {
  return NEXT[status]
}

/** Cancelled and refunded orders bring in no money. */
export function countsAsSale(order: SellerOrder): boolean {
  return order.status !== 'cancelled' && order.status !== 'refunded'
}

export function hasTracking(tracking: Tracking | undefined): tracking is Tracking {
  return tracking !== undefined && tracking.carrier.trim() !== '' && tracking.number.trim() !== ''
}

export function orderId(reference: string, storeId: number): string {
  return `${reference}-S${storeId}`
}

/**
 * Splits one checkout into the part each store must fulfil. Only stores that
 * exist as seller stores (`resolveStoreId` finds them) get an order.
 */
export function buildSellerOrders(
  order: DemoOrder,
  resolveStoreId: (storeSlug: string | undefined) => number | undefined,
  buyerId?: string,
): SellerOrder[] {
  const result: SellerOrder[] = []

  for (const seller of order.sellers) {
    const storeId = resolveStoreId(seller.storeSlug)
    if (storeId === undefined) continue

    result.push({
      id: orderId(order.reference, storeId),
      reference: order.reference,
      storeId,
      placedAt: order.placedAt,
      customerKey: buyerId ?? `guest:${order.customer.email.trim().toLowerCase()}`,
      customerName: order.customer.fullName.trim(),
      city: order.customer.city.trim(),
      country: getCountry(order.customer.country)?.name ?? order.customer.country,
      lines: seller.lines,
      subtotalCents: seller.subtotalCents,
      shippingCents: seller.shippingCents,
      totalCents: seller.subtotalCents + seller.shippingCents,
      status: 'pending',
      updatedAt: order.placedAt,
      sample: false,
    })
  }

  return result
}

export function countUnits(order: SellerOrder): number {
  return order.lines.reduce((sum, line) => sum + line.quantity, 0)
}

export interface OrderFilter {
  query: string
  status: OrderStatus | 'all'
}

export function filterOrders(orders: readonly SellerOrder[], { query, status }: OrderFilter): SellerOrder[] {
  const needle = query.trim().toLowerCase()

  return orders.filter((order) => {
    if (status !== 'all' && order.status !== status) return false
    if (needle === '') return true
    return (
      order.id.toLowerCase().includes(needle) ||
      order.customerName.toLowerCase().includes(needle) ||
      order.lines.some((line) => line.name.toLowerCase().includes(needle))
    )
  })
}

export function newestFirst(orders: readonly SellerOrder[]): SellerOrder[] {
  return [...orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt))
}

export interface OrderSummary {
  /** Items and shipping of orders that are not cancelled or refunded */
  salesCents: number
  orderCount: number
  pendingCount: number
}

export function summariseOrders(orders: readonly SellerOrder[]): OrderSummary {
  return {
    salesCents: orders.filter(countsAsSale).reduce((sum, order) => sum + order.totalCents, 0),
    orderCount: orders.length,
    pendingCount: orders.filter((order) => order.status === 'pending').length,
  }
}

export interface TopProduct {
  productId: number
  name: string
  image: string
  units: number
  revenueCents: number
}

export function topProducts(orders: readonly SellerOrder[], limit = 5): TopProduct[] {
  const byProduct = new Map<number, TopProduct>()

  for (const order of orders.filter(countsAsSale)) {
    for (const line of order.lines) {
      const entry = byProduct.get(line.productId) ?? {
        productId: line.productId,
        name: line.name,
        image: line.image,
        units: 0,
        revenueCents: 0,
      }
      entry.units += line.quantity
      entry.revenueCents += line.totalCents
      byProduct.set(line.productId, entry)
    }
  }

  return [...byProduct.values()]
    .sort((a, b) => b.revenueCents - a.revenueCents || a.name.localeCompare(b.name))
    .slice(0, limit)
}

export interface CustomerSummary {
  key: string
  name: string
  country: string
  orderCount: number
  spentCents: number
  lastOrderAt: string
}

/** Customers of one store, built from its own orders. Names and countries only, no contact details. */
export function customersFrom(orders: readonly SellerOrder[]): CustomerSummary[] {
  const byKey = new Map<string, CustomerSummary>()

  for (const order of orders) {
    const entry = byKey.get(order.customerKey) ?? {
      key: order.customerKey,
      name: order.customerName,
      country: order.country,
      orderCount: 0,
      spentCents: 0,
      lastOrderAt: order.placedAt,
    }
    entry.orderCount += 1
    if (countsAsSale(order)) entry.spentCents += order.totalCents
    if (order.placedAt > entry.lastOrderAt) {
      entry.lastOrderAt = order.placedAt
      entry.name = order.customerName
    }
    byKey.set(order.customerKey, entry)
  }

  return [...byKey.values()].sort((a, b) => b.lastOrderAt.localeCompare(a.lastOrderAt))
}

/* ---------- Sample orders (clearly labelled demo data) ---------- */

const SAMPLE_CUSTOMERS: ReadonlyArray<{ name: string; city: string; country: string }> = [
  { name: 'Alex Morgan', city: 'Leeds', country: 'United Kingdom' },
  { name: 'Sofia Bianchi', city: 'Milan', country: 'Italy' },
  { name: 'Daniel Okafor', city: 'Lagos', country: 'Nigeria' },
  { name: 'Mei Tanaka', city: 'Osaka', country: 'Japan' },
  { name: 'Lucas Meyer', city: 'Hamburg', country: 'Germany' },
  { name: 'Priya Nair', city: 'Pune', country: 'India' },
]

const SAMPLE_STATUSES: ReadonlyArray<OrderStatus> = [
  'pending', 'pending', 'processing', 'shipped', 'delivered', 'delivered', 'delivered', 'cancelled', 'refunded',
]

/** Small deterministic random numbers, so the same store gets the same sample orders. */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createSampleOrders(
  storeId: number,
  products: readonly SellerProductRecord[],
  now: Date = new Date(),
  count = 8,
): SellerOrder[] {
  if (products.length === 0) return []
  const random = seededRandom(storeId * 7919 + products.length)
  const pick = (max: number) => Math.floor(random() * max)

  return Array.from({ length: count }, (_, index) => {
    const customer = SAMPLE_CUSTOMERS[pick(SAMPLE_CUSTOMERS.length)] ?? SAMPLE_CUSTOMERS[0]!
    const lineCount = 1 + pick(Math.min(3, products.length))
    const chosen = [...products].sort(() => random() - 0.5).slice(0, lineCount)

    const lines: OrderLine[] = chosen.map((product) => {
      const quantity = 1 + pick(3)
      const unit = Math.round(product.price * 100)
      const choices: Array<[string, string]> = []
      if (product.sizes[0]) choices.push(['Size', product.sizes[0]])
      if (product.colors[0]) choices.push(['Color', product.colors[0]])
      return {
        productId: product.id,
        name: product.name,
        image: product.images[0] ?? '',
        choices,
        quantity,
        unitPriceCents: unit,
        totalCents: unit * quantity,
        path: `/product/${product.slug}`,
      }
    })

    const subtotalCents = lines.reduce((sum, line) => sum + line.totalCents, 0)
    const shippingCents = subtotalCents >= 7500 ? 0 : 500
    const placed = new Date(now.getTime() - (index * 2 + pick(2) + 1) * 86_400_000)
    const reference = `FAI-SAMPLE-${storeId}-${String(index + 1).padStart(2, '0')}`
    const status = SAMPLE_STATUSES[pick(SAMPLE_STATUSES.length)] ?? 'pending'

    return {
      id: orderId(reference, storeId),
      reference,
      storeId,
      placedAt: placed.toISOString(),
      customerKey: `sample:${customer.name.toLowerCase()}`,
      customerName: customer.name,
      city: customer.city,
      country: customer.country,
      lines,
      subtotalCents,
      shippingCents,
      totalCents: subtotalCents + shippingCents,
      status,
      tracking: status === 'shipped' || status === 'delivered' ? { carrier: 'Sample Post', number: `SP${storeId}${index}00123` } : undefined,
      updatedAt: placed.toISOString(),
      sample: true,
    }
  })
}
