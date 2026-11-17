import { createContext } from 'react'

export type WishlistToggleResult = 'added' | 'removed' | 'login-required'

export interface WishlistContextValue {
  /** Saved product ids of the signed-in person, newest first. Empty for guests. */
  ids: readonly number[]
  has: (productId: number) => boolean
  /** Guests get "login-required" and nothing is saved */
  toggle: (productId: number) => WishlistToggleResult
}

export const WishlistContext = createContext<WishlistContextValue | null>(null)
