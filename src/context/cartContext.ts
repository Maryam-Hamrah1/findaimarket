import { createContext } from 'react'
import type { AddResult, CartItem, CouponResult, Selection } from '../types/cart'

export interface CartContextValue {
  items: CartItem[]
  /** Applied coupon code, or null */
  coupon: string | null
  /** Units in the cart, not counting items saved for later */
  itemCount: number
  /** Adds units, never going over stock. Says why when it cannot. */
  addItem: (productId: number, selected: Selection, quantity: number) => AddResult
  setQuantity: (key: string, quantity: number) => void
  removeItem: (key: string) => void
  toggleSavedForLater: (key: string) => void
  clearCart: () => void
  applyCoupon: (code: string) => CouponResult
  removeCoupon: () => void
  /** Units of this product and variation already in the cart */
  getQuantityInCart: (productId: number, selected: Selection) => number
}

export const CartContext = createContext<CartContextValue | null>(null)
