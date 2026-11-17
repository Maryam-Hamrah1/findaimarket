import type { Product } from './product'
import type { ProductDetails } from './productDetails'
import type { Store } from './store'

/** Chosen value per option id, e.g. { size: "M", color: "Black" }. */
export type Selection = Readonly<Record<string, string>>

/**
 * What is stored in the cart. Only ids and choices are saved: name, price,
 * photo and store are always read from the catalogue, so they can never go
 * out of date or disagree with the rest of the site.
 */
export interface CartItem {
  /** Product id plus selected variations. Same key means same cart line. */
  key: string
  productId: number
  selected: Selection
  quantity: number
  savedForLater: boolean
}

export interface CartState {
  items: CartItem[]
  /** Applied coupon code, or null */
  coupon: string | null
}

export type CartAction =
  | { type: 'add'; productId: number; selected: Selection; quantity: number }
  | { type: 'setQuantity'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'toggleSaved'; key: string }
  | { type: 'clear' }
  | { type: 'setCoupon'; code: string | null }
  | { type: 'replace'; state: CartState }

export type AddFailure = 'unknown-product' | 'sold-out' | 'limit' | 'bad-quantity'

export type AddResult =
  | { ok: true; quantity: number }
  | { ok: false; reason: AddFailure; remaining: number }

/** Why a line cannot be bought right now. "ok" means it can. */
export type LineStatus = 'ok' | 'out-of-stock' | 'option-unavailable'

export interface CartLine {
  item: CartItem
  product: Product
  details: ProductDetails
  /** Undefined only if the catalogue has no store with that name */
  store: Store | undefined
  status: LineStatus
  /** Most units that can be in the cart for this line */
  maxQuantity: number
  unitPriceCents: number
  /** Amount for this line; 0 when it cannot be bought */
  lineTotalCents: number
  /** Readable choices, e.g. [["Size","M"],["Color","Black"]] */
  choices: Array<[label: string, value: string]>
}

/** Cart lines of one seller. Checkout can later turn each group into one order. */
export interface SellerGroup {
  /** Store slug, or the store name when the store record is missing */
  id: string
  storeName: string
  store: Store | undefined
  lines: CartLine[]
  subtotalCents: number
  shippingCents: number
}

export interface Coupon {
  code: string
  label: string
  /** Percentage off the subtotal */
  percent?: number
  freeShipping?: boolean
}

export type CouponResult =
  | { ok: true; coupon: Coupon }
  | { ok: false; message: string }

export interface CartSummary {
  /** Units that can be bought (saved-for-later and unavailable lines excluded) */
  itemCount: number
  subtotalCents: number
  discountCents: number
  shippingCents: number
  totalCents: number
  coupon: Coupon | null
  /** What the sale prices already save compared with the old prices */
  saleSavingsCents: number
}
