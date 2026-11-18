import type { OrderLine } from './checkout'
import type { CategoryId } from './product'

/*
  Seller dashboard models. The same shapes can be sent to a backend later.
  Every record carries the id of the store that owns it, and every seller
  query filters by that id.
*/

export type ProductStatus = 'active' | 'draft'

/** A product made in the seller dashboard. Turned into a catalogue Product by data/catalog.ts. */
export interface SellerProductRecord {
  id: number
  /** Owner. Names can change, ids never do. */
  storeId: number
  /** Unique across the whole catalogue, used in /product/:slug */
  slug: string
  name: string
  shortDescription: string
  description: string
  category: CategoryId
  /** Dollars, like the sample catalogue */
  price: number
  oldPrice?: number
  /** Small data URLs made in the browser. The first one is the main photo. */
  images: string[]
  sku: string
  brand: string
  weight: string
  dimensions: string
  shipping: string
  sizes: string[]
  colors: string[]
  stock: number
  status: ProductStatus
  /** ISO date-time */
  createdAt: string
  /** ISO date-time, also shown as "Last updated" in the inventory */
  updatedAt: string
}

/** What the product form edits. Everything is text until it is validated. */
export interface ProductFormValues {
  name: string
  shortDescription: string
  description: string
  category: string
  price: string
  oldPrice: string
  images: string[]
  sku: string
  stock: string
  brand: string
  weight: string
  dimensions: string
  shipping: string
  /** Comma separated, e.g. "S, M, L" */
  sizes: string
  colors: string
  status: ProductStatus
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface Tracking {
  carrier: string
  number: string
}

/**
 * The part of a customer's order that belongs to one store. A checkout with
 * products from three stores becomes three of these, and each seller can only
 * read and change their own.
 */
export interface SellerOrder {
  /** `${reference}-S${storeId}` */
  id: string
  /** The customer's order reference, shared by all stores in the same checkout */
  reference: string
  storeId: number
  /** ISO date-time */
  placedAt: string
  /** Groups repeat customers without exposing contact details */
  customerKey: string
  customerName: string
  city: string
  country: string
  lines: OrderLine[]
  subtotalCents: number
  shippingCents: number
  /** What this store earns from the order (items plus its own shipping) */
  totalCents: number
  status: OrderStatus
  tracking?: Tracking
  /** ISO date-time */
  updatedAt: string
  /** True for orders made with the "Create sample orders" button */
  sample: boolean
}

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'
