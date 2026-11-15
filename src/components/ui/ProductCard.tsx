import { Heart, Star } from 'lucide-react'
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
}: ProductCardProps) {
  const discount = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0

  return (
    <article className="group overflow-hidden rounded-2xl border border-brand-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-card">

      <div className="relative aspect-square overflow-hidden bg-surface-hover">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {isNew && <Badge variant="new">New</Badge>}
          {isFeatured && <Badge variant="featured">Featured</Badge>}
          {discount > 0 && (
            <Badge variant="sale">{discount}% OFF</Badge>
          )}
        </div>

        <button
          type="button"
          aria-label={`Add ${name} to wishlist`}
          className="absolute right-3 top-3 rounded-full bg-background/80 p-2 text-foreground backdrop-blur-md transition-colors hover:text-accent"
        >
          <Heart size={18} />
        </button>
      </div>

      <div className="space-y-3 p-4">
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold text-foreground">
          {name}
        </h3>

        <div className="flex items-center gap-1 text-sm">
          <Star size={15} className="fill-warning text-warning" />
          <span className="font-medium">{rating.toFixed(1)}</span>
          <span className="text-muted">({reviews} reviews)</span>
        </div>

        <div className="flex items-center gap-2">
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
