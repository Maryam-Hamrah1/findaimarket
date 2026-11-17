import { findCoupon } from '../data/coupons'
import { getProductById, getProductDetails } from '../data/productDetails'
import { getStoreByName } from '../data/stores'
import type {
  AddResult,
  CartAction,
  CartItem,
  CartLine,
  CartState,
  CartSummary,
  Selection,
  SellerGroup,
} from '../types/cart'
import type { Product } from '../types/product'
import { toCents } from './money'

/* ---------------------------------------------------------
   Demo shipping rule. These are not real shipping quotes.
   --------------------------------------------------------- */

export const SHIPPING_PER_SELLER_CENTS = 500
export const FREE_SHIPPING_FROM_CENTS = 7500

export const EMPTY_CART: CartState = { items: [], coupon: null }

/* ---------------------------------------------------------
   Keys: same product with the same choices is the same line
   --------------------------------------------------------- */

export function makeCartKey(productId: number, selected: Selection): string {
  const choices = Object.entries(selected)
    .filter(([, value]) => value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, value]) => `${id}=${value}`)

  return [String(productId), ...choices].join('|')
}

/* ---------------------------------------------------------
   Stock: how many units can be bought for a product
   --------------------------------------------------------- */

const stockCache = new Map<number, number>()

export function getStock(product: Product): number {
  const cached = stockCache.get(product.id)
  if (cached !== undefined) return cached

  const stock = getProductDetails(product).stock
  stockCache.set(product.id, stock)
  return stock
}

/* ---------------------------------------------------------
   Reducer: every change to the cart goes through here
   --------------------------------------------------------- */

function clamp(quantity: number, stock: number): number {
  return Math.max(1, Math.min(Math.floor(quantity), Math.max(1, stock)))
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const product = getProductById(action.productId)
      if (!product) return state

      const key = makeCartKey(action.productId, action.selected)
      const stock = getStock(product)
      const existing = state.items.find((item) => item.key === key)

      if (existing) {
        // Adding again moves a saved item back into the cart
        return {
          ...state,
          items: state.items.map((item) =>
            item.key === key
              ? {
                  ...item,
                  savedForLater: false,
                  quantity: clamp(
                    (item.savedForLater ? 0 : item.quantity) + action.quantity,
                    stock,
                  ),
                }
              : item,
          ),
        }
      }

      const item: CartItem = {
        key,
        productId: action.productId,
        selected: action.selected,
        quantity: clamp(action.quantity, stock),
        savedForLater: false,
      }

      return { ...state, items: [...state.items, item] }
    }

    case 'setQuantity':
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.key !== action.key) return item
          const product = getProductById(item.productId)
          return {
            ...item,
            quantity: clamp(action.quantity, product ? getStock(product) : 1),
          }
        }),
      }

    case 'remove':
      return { ...state, items: state.items.filter((item) => item.key !== action.key) }

    case 'toggleSaved':
      return {
        ...state,
        items: state.items.map((item) =>
          item.key === action.key ? { ...item, savedForLater: !item.savedForLater } : item,
        ),
      }

    case 'clear':
      // A coupon belongs to a shopping session, so it goes with the items
      return EMPTY_CART

    case 'setCoupon':
      return { ...state, coupon: action.code }

    case 'replace':
      return action.state
  }
}

/** Checks a new add against stock before changing anything. */
export function checkAdd(
  state: CartState,
  productId: number,
  selected: Selection,
  quantity: number,
): AddResult {
  const product = getProductById(productId)
  if (!product) return { ok: false, reason: 'unknown-product', remaining: 0 }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return { ok: false, reason: 'bad-quantity', remaining: 0 }
  }

  const stock = getStock(product)
  if (stock <= 0) return { ok: false, reason: 'sold-out', remaining: 0 }

  const key = makeCartKey(productId, selected)
  const existing = state.items.find((item) => item.key === key && !item.savedForLater)
  const remaining = Math.max(0, stock - (existing?.quantity ?? 0))

  if (quantity > remaining) return { ok: false, reason: 'limit', remaining }

  return { ok: true, quantity }
}

/** Units of one product and variation currently in the cart (not saved for later). */
export function getQuantityInCart(
  state: CartState,
  productId: number,
  selected: Selection,
): number {
  const key = makeCartKey(productId, selected)
  const item = state.items.find((entry) => entry.key === key && !entry.savedForLater)
  return item?.quantity ?? 0
}

/* ---------------------------------------------------------
   Lines: cart items joined with the catalogue
   --------------------------------------------------------- */

export function buildLine(item: CartItem): CartLine | undefined {
  const product = getProductById(item.productId)
  if (!product) return undefined

  const details = getProductDetails(product)
  const stock = details.stock

  const choices: Array<[string, string]> = []
  let optionOk = true

  for (const option of details.options) {
    const value = item.selected[option.id]
    if (value === undefined) continue

    choices.push([option.label, value])

    const match = option.values.find((candidate) => candidate.value === value)
    if (!match || !match.available) optionOk = false
  }

  const status = stock <= 0 ? 'out-of-stock' : optionOk ? 'ok' : 'option-unavailable'
  const unitPriceCents = toCents(product.price)

  return {
    item,
    product,
    details,
    store: getStoreByName(product.store),
    status,
    maxQuantity: stock,
    unitPriceCents,
    lineTotalCents: status === 'ok' ? unitPriceCents * item.quantity : 0,
    choices,
  }
}

export function buildLines(items: readonly CartItem[]): CartLine[] {
  return items.flatMap((item) => {
    const line = buildLine(item)
    return line ? [line] : []
  })
}

/* ---------------------------------------------------------
   Seller groups and totals
   --------------------------------------------------------- */

export function groupBySeller(lines: readonly CartLine[]): SellerGroup[] {
  const groups = new Map<string, SellerGroup>()

  for (const line of lines) {
    const id = line.store?.slug ?? line.product.store
    let group = groups.get(id)

    if (!group) {
      group = {
        id,
        storeName: line.store?.name ?? line.product.store,
        store: line.store,
        lines: [],
        subtotalCents: 0,
        shippingCents: 0,
      }
      groups.set(id, group)
    }

    group.lines.push(line)
    group.subtotalCents += line.lineTotalCents
  }

  return Array.from(groups.values()).map((group) => ({
    ...group,
    shippingCents: getShippingCents(group.subtotalCents),
  }))
}

/** Demo shipping for one seller. Nothing to ship means nothing to charge. */
export function getShippingCents(sellerSubtotalCents: number): number {
  if (sellerSubtotalCents <= 0) return 0
  return sellerSubtotalCents >= FREE_SHIPPING_FROM_CENTS ? 0 : SHIPPING_PER_SELLER_CENTS
}

export function calculateSummary(
  groups: readonly SellerGroup[],
  couponCode: string | null,
): CartSummary {
  const coupon = findCoupon(couponCode) ?? null

  let subtotalCents = 0
  let rawShippingCents = 0
  let itemCount = 0
  let saleSavingsCents = 0

  for (const group of groups) {
    subtotalCents += group.subtotalCents
    rawShippingCents += group.shippingCents

    for (const line of group.lines) {
      if (line.status !== 'ok') continue
      itemCount += line.item.quantity

      if (line.product.oldPrice) {
        saleSavingsCents +=
          (toCents(line.product.oldPrice) - line.unitPriceCents) * line.item.quantity
      }
    }
  }

  const discountCents = coupon?.percent
    ? Math.round((subtotalCents * coupon.percent) / 100)
    : 0
  const shippingCents = coupon?.freeShipping ? 0 : rawShippingCents

  return {
    itemCount,
    subtotalCents,
    discountCents,
    shippingCents,
    totalCents: subtotalCents - discountCents + shippingCents,
    coupon,
    saleSavingsCents,
  }
}

/* ---------------------------------------------------------
   Saving to the browser
   --------------------------------------------------------- */

export const CART_STORAGE_KEY = 'findaimarket-cart-v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseSelection(value: unknown): Selection | undefined {
  if (!isRecord(value)) return undefined

  const result: Record<string, string> = {}
  for (const [id, choice] of Object.entries(value)) {
    if (typeof choice !== 'string') return undefined
    result[id] = choice
  }
  return result
}

/**
 * Reads what was saved earlier. Anything unexpected (edited by hand, an old
 * product that no longer exists) is dropped instead of crashing the page.
 */
export function parseStoredCart(raw: string | null): CartState {
  if (raw === null) return EMPTY_CART

  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return EMPTY_CART
  }

  if (!isRecord(data) || !Array.isArray(data.items)) return EMPTY_CART

  const items = new Map<string, CartItem>()

  for (const entry of data.items) {
    if (!isRecord(entry)) continue

    const productId = entry.productId
    const quantity = entry.quantity
    const selected = parseSelection(entry.selected)

    if (typeof productId !== 'number' || !Number.isInteger(productId)) continue
    if (typeof quantity !== 'number' || !Number.isFinite(quantity) || quantity < 1) continue
    if (!selected) continue

    const product = getProductById(productId)
    if (!product) continue

    const key = makeCartKey(productId, selected)
    const previous = items.get(key)

    items.set(key, {
      key,
      productId,
      selected,
      quantity: clamp((previous?.quantity ?? 0) + quantity, getStock(product)),
      savedForLater: entry.savedForLater === true,
    })
  }

  const coupon =
    typeof data.coupon === 'string' && findCoupon(data.coupon)
      ? data.coupon.trim().toUpperCase()
      : null

  return { items: Array.from(items.values()), coupon }
}

export function serializeCart(state: CartState): string {
  return JSON.stringify({
    items: state.items.map(({ productId, selected, quantity, savedForLater }) => ({
      productId,
      selected,
      quantity,
      savedForLater,
    })),
    coupon: state.coupon,
  })
}
