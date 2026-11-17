import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { validateCoupon } from '../data/coupons'
import type { Selection } from '../types/cart'
import {
  CART_STORAGE_KEY,
  EMPTY_CART,
  cartReducer,
  checkAdd,
  getQuantityInCart as countInCart,
  parseStoredCart,
  serializeCart,
} from '../utils/cart'
import { CartContext, type CartContextValue } from './cartContext'

function loadInitialCart() {
  try {
    return parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY))
  } catch {
    // Storage can be blocked (private mode); the cart then lives in memory only
    return EMPTY_CART
  }
}

/** One cart for the whole site, saved in the browser and shared between tabs. */
export default function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialCart)

  // Save after every change
  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(state))
    } catch {
      // Nothing to do: the cart still works for this visit
    }
  }, [state])

  // Follow changes made in another tab
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY && event.key !== null) return
      dispatch({ type: 'replace', state: parseStoredCart(event.newValue) })
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const addItem = useCallback(
    (productId: number, selected: Selection, quantity: number) => {
      const result = checkAdd(state, productId, selected, quantity)
      if (result.ok) dispatch({ type: 'add', productId, selected, quantity })
      return result
    },
    [state],
  )

  const setQuantity = useCallback(
    (key: string, quantity: number) => dispatch({ type: 'setQuantity', key, quantity }),
    [],
  )
  const removeItem = useCallback((key: string) => dispatch({ type: 'remove', key }), [])
  const toggleSavedForLater = useCallback(
    (key: string) => dispatch({ type: 'toggleSaved', key }),
    [],
  )
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), [])

  const applyCoupon = useCallback((code: string) => {
    const result = validateCoupon(code)
    if (result.ok) dispatch({ type: 'setCoupon', code: result.coupon.code })
    return result
  }, [])
  const removeCoupon = useCallback(() => dispatch({ type: 'setCoupon', code: null }), [])

  const getQuantityInCart = useCallback(
    (productId: number, selected: Selection) => countInCart(state, productId, selected),
    [state],
  )

  const itemCount = useMemo(
    () =>
      state.items.reduce((sum, item) => sum + (item.savedForLater ? 0 : item.quantity), 0),
    [state.items],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      coupon: state.coupon,
      itemCount,
      addItem,
      setQuantity,
      removeItem,
      toggleSavedForLater,
      clearCart,
      applyCoupon,
      removeCoupon,
      getQuantityInCart,
    }),
    [
      state.items,
      state.coupon,
      itemCount,
      addItem,
      setQuantity,
      removeItem,
      toggleSavedForLater,
      clearCart,
      applyCoupon,
      removeCoupon,
      getQuantityInCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
