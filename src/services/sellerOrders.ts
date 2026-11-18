import type { OrderLine } from '../types/checkout'
import type { OrderStatus, SellerOrder, Tracking } from '../types/seller'
import { isImageDataUrl } from '../utils/images'
import { allowedNextStatuses, hasTracking } from '../utils/sellerOrders'
import type { KeyValueStorage } from './demoAuth'
import { browserStorage, createPersistentList } from './persistentList'

/*
  Seller-side orders (demo, kept in this browser).
  Checkout adds one record per store in the customer's order. A store can read
  and change only the records that carry its own store id.
*/

export const SELLER_ORDERS_KEY = 'findaimarket-demo-seller-orders-v1'

const STATUSES: ReadonlyArray<OrderStatus> = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
const str = (value: unknown): string => (typeof value === 'string' ? value : '')
const cents = (value: unknown): number => (typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.round(value) : 0)

function parseLine(value: unknown): OrderLine | undefined {
  if (!isRecord(value) || typeof value.productId !== 'number') return undefined
  const image = str(value.image)
  const choices = Array.isArray(value.choices)
    ? value.choices.flatMap((pair): Array<[string, string]> =>
        Array.isArray(pair) && typeof pair[0] === 'string' && typeof pair[1] === 'string' ? [[pair[0], pair[1]]] : [],
      )
    : []
  const path = str(value.path)

  return {
    productId: value.productId,
    name: str(value.name),
    image: image.startsWith('https://') || isImageDataUrl(image) ? image : '',
    choices,
    quantity: Math.max(1, Math.floor(cents(value.quantity))),
    unitPriceCents: cents(value.unitPriceCents),
    totalCents: cents(value.totalCents),
    path: path.startsWith('/') && !path.startsWith('//') ? path : '/explore',
  }
}

export function parseSellerOrders(raw: string | null): SellerOrder[] {
  if (!raw) return []

  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return []
  }
  if (!Array.isArray(data)) return []

  const seen = new Set<string>()
  const orders: SellerOrder[] = []

  for (const item of data) {
    if (!isRecord(item)) continue
    const id = str(item.id)
    const status = STATUSES.find((candidate) => candidate === item.status)
    if (id === '' || seen.has(id) || typeof item.storeId !== 'number' || !status) continue
    seen.add(id)

    const lines = Array.isArray(item.lines) ? item.lines.flatMap((line) => parseLine(line) ?? []) : []
    const tracking = isRecord(item.tracking) ? { carrier: str(item.tracking.carrier), number: str(item.tracking.number) } : undefined

    orders.push({
      id,
      reference: str(item.reference),
      storeId: item.storeId,
      placedAt: str(item.placedAt),
      customerKey: str(item.customerKey),
      customerName: str(item.customerName),
      city: str(item.city),
      country: str(item.country),
      lines,
      subtotalCents: cents(item.subtotalCents),
      shippingCents: cents(item.shippingCents),
      totalCents: cents(item.totalCents),
      status,
      tracking: hasTracking(tracking) ? tracking : undefined,
      updatedAt: str(item.updatedAt) || str(item.placedAt),
      sample: item.sample === true,
    })
  }

  return orders
}

export type OrderResult =
  | { ok: true; order: SellerOrder }
  | { ok: false; reason: 'not-found' | 'not-owner' | 'not-allowed' | 'tracking-required' | 'storage-failed'; message: string }

type Failure = Extract<OrderResult, { ok: false }>['reason']

const MESSAGES: Record<Failure, string> = {
  'not-found': 'This order no longer exists.',
  'not-owner': 'This order belongs to another store.',
  'not-allowed': 'This order cannot be moved to that status.',
  'tracking-required': 'Add a carrier and tracking number before marking the order as shipped.',
  'storage-failed': 'Your browser could not save the change (storage may be full or blocked).',
}

export interface SellerOrderLedger {
  list(): ReadonlyArray<SellerOrder>
  /** Only this store's orders */
  getByStore(storeId: number): SellerOrder[]
  /** Adds orders that are not in the ledger yet */
  add(orders: readonly SellerOrder[]): boolean
  setStatus(storeId: number, id: string, status: OrderStatus, now?: Date): OrderResult
  setTracking(storeId: number, id: string, tracking: Tracking | undefined, now?: Date): OrderResult
  subscribe(listener: () => void): () => void
}

export function createSellerOrderLedger(storage: KeyValueStorage): SellerOrderLedger {
  const store = createPersistentList<SellerOrder>(storage, SELLER_ORDERS_KEY, parseSellerOrders)

  function modify(
    storeId: number,
    id: string,
    apply: (order: SellerOrder) => SellerOrder | Failure,
  ): OrderResult {
    let failure: Failure | null = null
    let saved: SellerOrder | null = null

    const result = store.commit((current) => {
      const index = current.findIndex((order) => order.id === id)
      const existing = current[index]
      if (!existing) {
        failure = 'not-found'
        return null
      }
      // The check every change goes through: a store never reaches another store's order
      if (existing.storeId !== storeId) {
        failure = 'not-owner'
        return null
      }
      const next = apply(existing)
      if (typeof next === 'string') {
        failure = next
        return null
      }
      saved = next
      return current.map((order, position) => (position === index ? next : order))
    })

    if (failure) return { ok: false, reason: failure, message: MESSAGES[failure] }
    if (result !== 'ok' || !saved) return { ok: false, reason: 'storage-failed', message: MESSAGES['storage-failed'] }
    return { ok: true, order: saved }
  }

  return {
    list: () => store.get(),
    getByStore: (storeId) => store.get().filter((order) => order.storeId === storeId),

    add(orders) {
      if (orders.length === 0) return true
      let added = 0
      const result = store.commit((current) => {
        const known = new Set(current.map((order) => order.id))
        const fresh = orders.filter((order) => !known.has(order.id))
        added = fresh.length
        return fresh.length === 0 ? null : [...current, ...fresh]
      })
      return result === 'ok' || added === 0
    },

    setStatus: (storeId, id, status, now = new Date()) =>
      modify(storeId, id, (order) => {
        if (!allowedNextStatuses(order.status).includes(status)) return 'not-allowed'
        if (status === 'shipped' && !hasTracking(order.tracking)) return 'tracking-required'
        return { ...order, status, updatedAt: now.toISOString() }
      }),

    setTracking: (storeId, id, tracking, now = new Date()) =>
      modify(storeId, id, (order) => {
        if (order.status === 'cancelled' || order.status === 'refunded') return 'not-allowed'
        // A shipped order keeps its tracking: it can be corrected but not removed
        if ((order.status === 'shipped' || order.status === 'delivered') && !hasTracking(tracking)) return 'tracking-required'
        return {
          ...order,
          tracking: hasTracking(tracking) ? { carrier: tracking.carrier.trim(), number: tracking.number.trim() } : undefined,
          updatedAt: now.toISOString(),
        }
      }),

    subscribe: store.subscribe,
  }
}

/** The one ledger the whole app shares. */
export const sellerOrders: SellerOrderLedger = createSellerOrderLedger(browserStorage(SELLER_ORDERS_KEY))
