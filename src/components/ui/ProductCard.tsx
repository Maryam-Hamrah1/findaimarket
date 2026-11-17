import { Heart, ImageOff, Sparkles, Star } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWishlistToggle } from '../../hooks/useWishlist'
import Badge from './Badge'

interface ProductCardProps {
  name: string
  image: string
  price: number
  oldPrice?: number
  rating?: number
  reviews?: number
  isNew?: boolean
  isFeatured?: boolean
  /** Store that sells the product */
  store?: string
  /** When given, the store name links to that storefront */
  storeSlug?: string
  /** Where the card leads (the product page). The whole card becomes clickable. */
  to?: string
  /** Catalogue id, used by the wishlist heart */
  productId: number
  /** Small highlight shown on the photo, e.g. "Top match" */
  matchLabel?: string
}

export default function ProductCard({
  name,
  image,
  price,
  oldPrice,
  rating = 0,
  reviews = 0,
  isNew = false,
  isFeatured = false,
  store,
  storeSlug,
  to,
  productId,
  matchLabel,
}: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const { wished, toggle: toggleWishlist } = useWishlistToggle(productId)

  const discount = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0

  const showImage = image !== '' && !imageFailed

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-brand-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-card">

      <div className="relative aspect-square overflow-hidden bg-surface-hover">
        {showImage ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            role="img"
            aria-label={name}
            className="flex h-full w-full items-center justify-center bg-primary-light text-muted"
          >
            <ImageOff size={34} strokeWidth={1.4} />
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {isNew && <Badge variant="new">New</Badge>}
          {isFeatured && <Badge variant="featured">Featured</Badge>}
          {discount > 0 && (
            <Badge variant="sale">{discount}% OFF</Badge>
          )}
        </div>

        {matchLabel && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-on-accent">
            <Sparkles size={12} />
            {matchLabel}
          </span>
        )}

        <button
          type="button"
          aria-label={`${wished ? 'Remove' : 'Add'} ${name} ${wished ? 'from' : 'to'} wishlist`}
          aria-pressed={wished}
          onClick={toggleWishlist}
          className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-2 text-foreground backdrop-blur-md transition-colors hover:text-accent"
        >
          <Heart size={18} className={wished ? 'fill-accent text-accent' : ''} />
        </button>
      </div>

      <div className="space-y-2.5 p-4">
        <div>
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold text-foreground">
            {to ? (
              <Link
                to={to}
                className="after:absolute after:inset-0 after:z-[1] after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {name}
              </Link>
            ) : (
              name
            )}
          </h3>

          {store && (
            <p className="mt-1 truncate text-xs text-muted">
              {storeSlug ? (
                <Link
                  to={`/store/${storeSlug}`}
                  className="relative z-10 transition-colors hover:text-accent hover:underline"
                >
                  {store}
                </Link>
              ) : (
                store
              )}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 text-sm">
          <Star size={15} className="fill-warning text-warning" />
          <span className="font-medium">{rating.toFixed(1)}</span>
          <span className="text-muted">
            ({reviews}
            <span className="sr-only"> reviews</span>)
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-lg font-bold text-foreground">
            ${price.toFixed(2)}
          </span>

          {oldPrice && (
            <span className="text-sm text-muted line-through">
              ${oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
