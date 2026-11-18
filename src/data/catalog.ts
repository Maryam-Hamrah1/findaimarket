import { productRegistry } from '../services/productRegistry'
import { storeRegistry } from '../services/storeRegistry'
import type { Product } from '../types/product'
import type { StoreRecord } from '../types/onboarding'
import type { SellerProductRecord } from '../types/seller'
import { PRODUCTS } from './products'

/*
  The one product list the whole shop reads.
  Sample products (data/products.ts) plus the Active products sellers made in
  their dashboard. Drafts are never in here, so they cannot appear in Explore,
  search, storefronts, related products, the cart or a product page.
*/

function wordsOf(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length >= 3)
}

/** Turns a seller's product into the catalogue shape. Undefined when its store is gone. */
export function recordToProduct(record: SellerProductRecord, store: StoreRecord | undefined): Product | undefined {
  if (!store) return undefined

  return {
    id: record.id,
    name: record.name,
    category: record.category,
    price: record.price,
    oldPrice: record.oldPrice,
    rating: 0,
    reviews: 0,
    image: record.images[0] ?? '',
    // Read from the store, so renaming the store keeps its products attached
    store: store.store.name,
    location: store.store.country,
    condition: 'new',
    inStock: record.stock > 0,
    isNew: true,
    sales: 0,
    views: 0,
    addedAt: record.createdAt.slice(0, 10),
    tags: Array.from(new Set([...wordsOf(record.name), ...wordsOf(record.brand), record.category, ...record.colors.map((c) => c.toLowerCase())])),
  }
}

let cacheProducts: ReadonlyArray<SellerProductRecord> | null = null
let cacheStores: ReadonlyArray<StoreRecord> | null = null
let cached: ReadonlyArray<Product> = PRODUCTS

/** Every product shoppers can see. Same array until something changes, so it is safe to subscribe to. */
export function getPublicProducts(): ReadonlyArray<Product> {
  const records = productRegistry.list()
  const stores = storeRegistry.list()

  if (records !== cacheProducts || stores !== cacheStores) {
    cacheProducts = records
    cacheStores = stores

    const created = records.flatMap((record) => {
      if (record.status !== 'active') return []
      const product = recordToProduct(record, stores.find((entry) => entry.store.id === record.storeId))
      return product ? [product] : []
    })

    cached = created.length === 0 ? PRODUCTS : [...PRODUCTS, ...created]
  }

  return cached
}

export function subscribeCatalog(listener: () => void): () => void {
  const stopProducts = productRegistry.subscribe(listener)
  const stopStores = storeRegistry.subscribe(listener)
  return () => {
    stopProducts()
    stopStores()
  }
}

/** Largest id in use, drafts included, so a new product never reuses an id. */
export function nextProductId(): number {
  const highest = Math.max(0, ...PRODUCTS.map((product) => product.id), ...productRegistry.list().map((record) => record.id))
  return Math.max(1000, highest + 1)
}
