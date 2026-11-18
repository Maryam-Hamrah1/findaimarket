import { useSyncExternalStore } from 'react'
import { getPublicProducts, subscribeCatalog } from '../data/catalog'
import type { Product } from '../types/product'

/** Every product shoppers can see. Re-renders when a seller adds, changes or removes one. */
export function useCatalog(): ReadonlyArray<Product> {
  return useSyncExternalStore(subscribeCatalog, getPublicProducts)
}
