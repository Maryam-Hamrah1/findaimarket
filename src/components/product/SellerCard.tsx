import { ArrowRight, BadgeCheck, MapPin, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Store } from '../../types/store'
import StoreLogo from '../ui/StoreLogo'

interface SellerCardProps {
  store: Store
}

/** The seller, taken from the product's own store record. */
export default function SellerCard({ store }: SellerCardProps) {
  return (
    <aside
      aria-label="Seller information"
      className="flex flex-wrap items-center gap-4 rounded-2xl border border-brand-border bg-surface p-4 sm:p-5"
    >
      <StoreLogo name={store.name} logo={store.logo} size="sm" />

      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-[0.14em] text-muted">Sold by</p>

        <p className="mt-0.5 flex flex-wrap items-center gap-2 font-display text-2xl font-semibold text-foreground">
          {store.name}
          {store.verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-accent/50 px-2.5 py-0.5 font-sans text-xs font-semibold text-accent">
              <BadgeCheck size={14} aria-hidden="true" />
              Verified
            </span>
          )}
        </p>

        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Star size={14} className="fill-warning text-warning" aria-hidden="true" />
            {store.rating.toFixed(1)}
            <span className="sr-only"> out of 5</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} aria-hidden="true" />
            {store.city}, {store.country}
          </span>
        </p>
      </div>

      <Link
        to={`/store/${store.slug}`}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-border px-5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
      >
        Visit Store
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </aside>
  )
}
