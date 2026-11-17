import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCategoryName } from '../../data/categories'
import type { Product } from '../../types/product'
import type { ProductDetails } from '../../types/productDetails'

interface ProductInfoProps {
  product: Product
  details: ProductDetails
}

/** Name, category, rating, price and SKU. */
export default function ProductInfo({ product, details }: ProductInfoProps) {
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  return (
    <div>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <Link
          to={`/explore?category=${product.category}`}
          className="font-semibold uppercase tracking-[0.14em] text-accent hover:text-accent-hover"
        >
          {getCategoryName(product.category)}
        </Link>
        {details.brand && (
          <span className="text-muted">
            Brand: <span className="text-foreground">{details.brand}</span>
          </span>
        )}
      </p>

      <h1 className="mt-3 font-display text-4xl font-medium leading-[1.1] text-foreground sm:text-5xl">
        {product.name}
      </h1>

      <a
        href="#reviews"
        className="mt-4 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
      >
        <Star size={17} className="fill-warning text-warning" aria-hidden="true" />
        <span className="font-semibold text-foreground">{product.rating.toFixed(1)}</span>
        <span>
          ({product.reviews.toLocaleString('en')}{' '}
          {product.reviews === 1 ? 'review' : 'reviews'})
        </span>
      </a>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="text-4xl font-bold text-foreground">${product.price.toFixed(2)}</p>

        {product.oldPrice && (
          <>
            <p className="text-lg text-muted line-through">
              <span className="sr-only">Original price </span>${product.oldPrice.toFixed(2)}
            </p>
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-on-accent">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      <p className="mt-5 text-base leading-7 text-muted">{details.summary}</p>

      <p className="mt-4 text-xs text-muted">
        SKU: <span className="text-foreground">{details.sku}</span>
        <span className="mx-2" aria-hidden="true">
          ·
        </span>
        Condition:{' '}
        <span className="text-foreground">
          {product.condition === 'new' ? 'New' : 'Used'}
        </span>
      </p>
    </div>
  )
}
