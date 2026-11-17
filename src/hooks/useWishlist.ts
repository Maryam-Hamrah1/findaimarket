import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { WishlistContext, type WishlistContextValue } from '../context/wishlistContext'

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext)

  if (!context) {
    throw new Error('useWishlist must be used inside <WishlistProvider>')
  }

  return context
}

/**
 * Heart button logic for one product. Guests are sent to the login page and
 * come back to the same page afterwards.
 */
export function useWishlistToggle(productId: number | undefined) {
  const { has, toggle } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()

  const wished = productId !== undefined && has(productId)

  const onToggle = () => {
    if (productId === undefined) return

    if (toggle(productId) === 'login-required') {
      navigate('/login', {
        state: {
          from: `${location.pathname}${location.search}`,
          notice: 'Sign in to save products to your wishlist.',
        },
      })
    }
  }

  return { wished, toggle: onToggle }
}
