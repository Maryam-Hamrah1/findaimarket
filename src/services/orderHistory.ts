import type { DemoOrder } from '../types/checkout'

/*
  Demo orders placed by a signed-in person, kept in this browser only.
  They are the sample orders created by the demo checkout, not real purchases.
*/

export const ORDERS_KEY = 'findaimarket-demo-orders-v1'
const MAX_ORDERS_PER_USER = 50

type OrderStore = Record<string, DemoOrder[]>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function looksLikeOrder(value: unknown): value is DemoOrder {
  if (!isRecord(value)) return false
  return (
    value.demo === true &&
    typeof value.reference === 'string' &&
    typeof value.placedAt === 'string' &&
    Array.isArray(value.sellers) &&
    isRecord(value.totals) &&
    typeof value.totals.totalCents === 'number' &&
    isRecord(value.customer)
  )
}

export function parseOrders(raw: string | null): OrderStore {
  if (raw === null) return {}

  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return {}
  }
  if (!isRecord(data)) return {}

  const result: OrderStore = {}
  for (const [userId, orders] of Object.entries(data)) {
    if (Array.isArray(orders)) result[userId] = orders.filter(looksLikeOrder)
  }
  return result
}

function readAll(): OrderStore {
  try {
    return parseOrders(window.localStorage.getItem(ORDERS_KEY))
  } catch {
    return {}
  }
}

/** Newest first. */
export function loadOrders(userId: string): DemoOrder[] {
  return [...(readAll()[userId] ?? [])].sort((a, b) => b.placedAt.localeCompare(a.placedAt))
}

export function saveOrder(userId: string, order: DemoOrder): void {
  try {
    const all = readAll()
    all[userId] = [order, ...(all[userId] ?? [])].slice(0, MAX_ORDERS_PER_USER)
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(all))
  } catch {
    // The confirmation still shows; it just will not appear in the order list
  }
}
