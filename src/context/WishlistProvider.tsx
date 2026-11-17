import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { WISHLIST_KEY, parseWishlists, toggleWishlistId, type WishlistStore } from '../utils/wishlist'
import { WishlistContext, type WishlistContextValue } from './wishlistContext'

function load(): WishlistStore {
  try {
    return parseWishlists(window.localStorage.getItem(WISHLIST_KEY))
  } catch {
    return {}
  }
}

const NO_IDS: readonly number[] = []

/** One wishlist per signed-in account, saved in this browser. */
export default function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [store, setStore] = useState<WishlistStore>(load)

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(store))
    } catch {
      // The wishlist still works until the page is closed
    }
  }, [store])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === WISHLIST_KEY || event.key === null) setStore(load())
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const ids = userId ? (store[userId] ?? NO_IDS) : NO_IDS

  const toggle = useCallback<WishlistContextValue['toggle']>(
    (productId) => {
      if (!userId) return 'login-required'

      const adding = !(store[userId] ?? []).includes(productId)
      setStore((previous) => ({
        ...previous,
        [userId]: toggleWishlistId(previous[userId] ?? [], productId),
      }))
      return adding ? 'added' : 'removed'
    },
    [store, userId],
  )

  const value = useMemo<WishlistContextValue>(
    () => ({ ids, has: (productId) => ids.includes(productId), toggle }),
    [ids, toggle],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
