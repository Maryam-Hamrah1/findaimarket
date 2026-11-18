import type { CategoryId } from '../types/product'
import type { ProductStatus, SellerProductRecord } from '../types/seller'
import { isImageDataUrl } from '../utils/images'
import { browserStorage, createPersistentList } from './persistentList'
import type { KeyValueStorage } from './demoAuth'

/*
  Products sellers made in the dashboard (demo, kept in this browser).
  The sample catalogue stays in data/products.ts. data/catalog.ts joins the two,
  so Explore, storefronts, product pages, cart and wishlist all read one source.
  Every change names the store that makes it, and a store can only touch its own products.
*/

export const PRODUCTS_KEY = 'findaimarket-demo-products-v1'

const CATEGORIES: ReadonlyArray<CategoryId> = ['fashion', 'electronics', 'accessories', 'home-living', 'beauty', 'sports']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const str = (value: unknown): string => (typeof value === 'string' ? value : '')
const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

/** Reads saved products defensively: damaged items are dropped, never trusted. */
export function parseProductRecords(raw: string | null): SellerProductRecord[] {
  if (!raw) return []

  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return []
  }
  if (!Array.isArray(data)) return []

  const ids = new Set<number>()
  const slugs = new Set<string>()
  const records: SellerProductRecord[] = []

  for (const item of data) {
    if (!isRecord(item)) continue
    const { id, storeId, price, stock } = item
    const category = CATEGORIES.find((candidate) => candidate === item.category)
    const slug = str(item.slug)
    if (typeof id !== 'number' || !Number.isInteger(id) || typeof storeId !== 'number') continue
    if (typeof price !== 'number' || !(price >= 0) || typeof stock !== 'number' || !(stock >= 0)) continue
    if (!category || slug === '' || str(item.name) === '' || ids.has(id) || slugs.has(slug)) continue
    ids.add(id)
    slugs.add(slug)

    records.push({
      id,
      storeId,
      slug,
      name: str(item.name),
      shortDescription: str(item.shortDescription),
      description: str(item.description),
      category,
      price,
      oldPrice: typeof item.oldPrice === 'number' && item.oldPrice > price ? item.oldPrice : undefined,
      images: strings(item.images).filter(isImageDataUrl),
      sku: str(item.sku),
      brand: str(item.brand),
      weight: str(item.weight),
      dimensions: str(item.dimensions),
      shipping: str(item.shipping),
      sizes: strings(item.sizes),
      colors: strings(item.colors),
      stock: Math.floor(stock),
      status: item.status === 'draft' ? 'draft' : 'active',
      createdAt: str(item.createdAt),
      updatedAt: str(item.updatedAt) || str(item.createdAt),
    })
  }

  return records
}

export type ProductChange = Partial<Omit<SellerProductRecord, 'id' | 'storeId' | 'createdAt' | 'updatedAt'>>

export type ProductResult =
  | { ok: true; record: SellerProductRecord }
  | { ok: false; reason: 'not-found' | 'not-owner' | 'duplicate' | 'storage-failed'; message: string }

const FAILED: Record<'not-found' | 'not-owner' | 'duplicate' | 'storage-failed', string> = {
  'not-found': 'This product no longer exists.',
  'not-owner': 'This product belongs to another store.',
  duplicate: 'A product with this id or address already exists. Please try again.',
  'storage-failed': 'Your browser could not save the change (storage may be full or blocked). Try removing some images.',
}

export interface ProductRegistry {
  list(): ReadonlyArray<SellerProductRecord>
  getById(id: number): SellerProductRecord | undefined
  getBySlug(slug: string): SellerProductRecord | undefined
  getByStore(storeId: number): SellerProductRecord[]
  add(record: SellerProductRecord): ProductResult
  /** Changes a product, but only when it belongs to `storeId` */
  update(storeId: number, productId: number, change: ProductChange, now?: Date): ProductResult
  setStatus(storeId: number, productId: number, status: ProductStatus, now?: Date): ProductResult
  setStock(storeId: number, productId: number, stock: number, now?: Date): ProductResult
  remove(storeId: number, productId: number): ProductResult
  /** Called by checkout when a customer buys: lowers the stock, never below zero. */
  sell(sales: ReadonlyArray<{ productId: number; quantity: number }>, now?: Date): void
  subscribe(listener: () => void): () => void
}

export function createProductRegistry(storage: KeyValueStorage): ProductRegistry {
  const store = createPersistentList<SellerProductRecord>(storage, PRODUCTS_KEY, parseProductRecords)

  function modify(
    storeId: number,
    productId: number,
    apply: (record: SellerProductRecord) => SellerProductRecord,
  ): ProductResult {
    let failure: 'not-found' | 'not-owner' | null = null
    let saved: SellerProductRecord | null = null

    const result = store.commit((current) => {
      const index = current.findIndex((record) => record.id === productId)
      const existing = current[index]
      if (!existing) {
        failure = 'not-found'
        return null
      }
      if (existing.storeId !== storeId) {
        failure = 'not-owner'
        return null
      }
      saved = apply(existing)
      return current.map((record, position) => (position === index ? (saved as SellerProductRecord) : record))
    })

    if (failure) return { ok: false, reason: failure, message: FAILED[failure] }
    if (result === 'storage-failed' || !saved) return { ok: false, reason: 'storage-failed', message: FAILED['storage-failed'] }
    return { ok: true, record: saved }
  }

  return {
    list: () => store.get(),
    getById: (id) => store.get().find((record) => record.id === id),
    getBySlug: (slug) => store.get().find((record) => record.slug === slug),
    getByStore: (storeId) => store.get().filter((record) => record.storeId === storeId),

    add(record) {
      let duplicate = false
      const result = store.commit((current) => {
        if (current.some((existing) => existing.id === record.id || existing.slug === record.slug)) {
          duplicate = true
          return null
        }
        return [...current, record]
      })
      if (duplicate) return { ok: false, reason: 'duplicate', message: FAILED.duplicate }
      if (result !== 'ok') return { ok: false, reason: 'storage-failed', message: FAILED['storage-failed'] }
      return { ok: true, record }
    },

    update: (storeId, productId, change, now = new Date()) =>
      modify(storeId, productId, (record) => ({ ...record, ...change, updatedAt: now.toISOString() })),

    setStatus: (storeId, productId, status, now = new Date()) =>
      modify(storeId, productId, (record) => ({ ...record, status, updatedAt: now.toISOString() })),

    setStock: (storeId, productId, stock, now = new Date()) =>
      modify(storeId, productId, (record) => ({
        ...record,
        stock: Math.max(0, Math.floor(stock)),
        updatedAt: now.toISOString(),
      })),

    remove(storeId, productId) {
      let failure: 'not-found' | 'not-owner' | null = null
      let removed: SellerProductRecord | null = null

      const result = store.commit((current) => {
        const existing = current.find((record) => record.id === productId)
        if (!existing) {
          failure = 'not-found'
          return null
        }
        if (existing.storeId !== storeId) {
          failure = 'not-owner'
          return null
        }
        removed = existing
        return current.filter((record) => record.id !== productId)
      })

      if (failure) return { ok: false, reason: failure, message: FAILED[failure] }
      if (result !== 'ok' || !removed) return { ok: false, reason: 'storage-failed', message: FAILED['storage-failed'] }
      return { ok: true, record: removed }
    },

    sell(sales, now = new Date()) {
      if (sales.length === 0) return
      store.commit((current) => {
        let changed = false
        const next = current.map((record) => {
          const quantity = sales
            .filter((sale) => sale.productId === record.id)
            .reduce((sum, sale) => sum + sale.quantity, 0)
          if (quantity === 0) return record
          changed = true
          return { ...record, stock: Math.max(0, record.stock - quantity), updatedAt: now.toISOString() }
        })
        return changed ? next : null
      })
    },

    subscribe: store.subscribe,
  }
}

/** The one registry the whole app shares. */
export const productRegistry: ProductRegistry = createProductRegistry(browserStorage(PRODUCTS_KEY))
