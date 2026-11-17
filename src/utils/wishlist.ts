import { getProductById } from '../data/productDetails'

export const WISHLIST_KEY = 'findaimarket-wishlist-v1'

/** Saved products per account: { [userId]: [productId, ...] } */
export type WishlistStore = Record<string, number[]>

/** Reads the saved wishlists. Unknown products and damaged data are dropped. */
export function parseWishlists(raw: string | null): WishlistStore {
  if (raw === null) return {}

  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return {}
  }

  if (typeof data !== 'object' || data === null || Array.isArray(data)) return {}

  const result: WishlistStore = {}
  for (const [userId, ids] of Object.entries(data)) {
    if (!Array.isArray(ids)) continue
    const clean = ids.filter(
      (id): id is number => typeof id === 'number' && getProductById(id) !== undefined,
    )
    result[userId] = Array.from(new Set(clean))
  }
  return result
}

/** Adds the id when missing, removes it when present. Newest first. */
export function toggleWishlistId(ids: readonly number[], id: number): number[] {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [id, ...ids]
}
