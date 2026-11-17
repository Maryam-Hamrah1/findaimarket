import { Heart } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AccountLayout from '../components/account/AccountLayout'
import ProductGrid from '../components/explore/ProductGrid'
import { getProductById } from '../data/productDetails'
import { useWishlist } from '../hooks/useWishlist'
import type { Product } from '../types/product'

export default function AccountWishlistPage() {
  const { ids } = useWishlist()

  useEffect(() => {
    document.title = 'Wishlist · Findaimarket'
  }, [])

  const products = ids.flatMap((id): Product[] => {
    const product = getProductById(id)
    return product ? [product] : []
  })

  return (
    <AccountLayout title="Wishlist">
      {products.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-surface px-6 py-14 text-center">
          <Heart size={34} className="mx-auto text-accent" aria-hidden="true" />
          <h2 className="mt-4 font-display text-2xl font-medium text-foreground">Nothing saved yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            Tap the heart on any product to keep it here.
          </p>
          <Link to="/explore" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-sm font-bold text-on-accent hover:bg-accent-hover">
            Explore products
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </AccountLayout>
  )
}
