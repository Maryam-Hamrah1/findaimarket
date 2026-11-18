import type { Product } from '../types/product'
import type { StoreProduct, StoreSection } from '../types/store'
import { getCategoryName } from './categories'
import { getPublicProducts } from './catalog'

/*
  Each store groups its own products in its own way (a fashion store has "Bags",
  an electronics store has "Audio"). The keys are product ids from data/products.ts.
  A product without an entry falls back to its marketplace category name.
*/
const STORE_SECTIONS: Readonly<Record<number, string>> = {
  // Modern Style
  1: 'Bags', 4: 'Bags', 17: 'Accessories', 18: 'Accessories',
  // Atelier Nord
  2: 'Knitwear', 8: 'Knitwear', 5: 'Essentials', 6: 'Outerwear',
  // Casa Luna
  3: 'Style', 21: 'Style', 24: 'Home', 28: 'Home', 30: 'Home', 36: 'Beauty',
  // Urban Thread
  7: 'Jackets', 20: 'Accessories', 41: 'Fitness',
  // Peak & Pace
  38: 'Running Shoes', 39: 'Running Shoes', 40: 'Training', 25: 'Hydration',
  42: 'Hydration', 43: 'Packs & Socks', 44: 'Packs & Socks',
  // Tech Haven
  9: 'Audio', 12: 'Audio', 10: 'Computers', 15: 'Wearables', 16: 'Wearables', 14: 'Power',
  // Kōbō Studio
  11: 'Tech', 13: 'Tech', 26: 'Home', 31: 'Home',
  // Lumière Atelier
  19: 'Necklaces', 22: 'Earrings',
  // Lumière Beauté
  32: 'Skincare', 35: 'Skincare', 33: 'Hair', 34: 'Fragrance',
  // Home Essence
  23: 'Lighting', 27: 'Candles & Scents', 29: 'Furniture', 37: 'Bath & Body',
}

/** Only products that belong to this store. Products of other stores never appear. */
export function getStoreProducts(
  storeName: string,
  catalog: ReadonlyArray<Product> = getPublicProducts(),
): StoreProduct[] {
  return catalog.filter((product) => product.store === storeName).map(
    (product) => ({
      ...product,
      section: STORE_SECTIONS[product.id] ?? getCategoryName(product.category),
    }),
  )
}

/** The store's own categories. A category without products is never returned. */
export function getStoreSections(products: readonly StoreProduct[]): StoreSection[] {
  const counts = new Map<string, number>()

  for (const product of products) {
    counts.set(product.section, (counts.get(product.section) ?? 0) + 1)
  }

  return Array.from(counts, ([name, count]) => ({ name, count })).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  )
}
