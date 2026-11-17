import { ArrowRight, BadgeCheck, MapPin, Package, Star, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCategoryName } from '../../data/categories'
import type { Store } from '../../types/store'
import { formatCompactNumber } from '../../utils/stores'
import CoverImage from '../ui/CoverImage'
import StoreLogo from '../ui/StoreLogo'

interface StoreCardProps {
  store: Store
}

/** A store profile card: brand cover, logo, identity and key figures. */
export default function StoreCard({ store }: StoreCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-card focus-within:border-accent/60">
      <CoverImage src={store.coverImage} className="h-32 shrink-0 sm:h-36" />

      <div className="flex flex-1 flex-col px-5 pb-5">
        <StoreLogo
          name={store.name}
          logo={store.logo}
          size="md"
          className="-mt-8"
        />

        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          {getCategoryName(store.category)}
        </p>

        <h3 className="mt-1 flex items-center gap-2 font-display text-2xl font-semibold leading-tight text-foreground">
          <span className="truncate">{store.name}</span>
          {store.verified && (
            <span className="inline-flex shrink-0 text-accent" title="Verified store">
              <BadgeCheck size={20} aria-hidden="true" />
              <span className="sr-only">Verified store</span>
            </span>
          )}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
          {store.description}
        </p>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
          <MapPin size={14} aria-hidden="true" />
          {store.city}, {store.country}
        </p>

        <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-brand-border pt-4 text-center">
          <div>
            <dt className="sr-only">Products</dt>
            <dd className="flex flex-col items-center gap-0.5 text-sm font-semibold text-foreground">
              <Package size={15} className="text-muted" aria-hidden="true" />
              {store.productCount}
              <span className="text-[11px] font-normal text-muted">products</span>
            </dd>
          </div>
          <div>
            <dt className="sr-only">Average rating</dt>
            <dd className="flex flex-col items-center gap-0.5 text-sm font-semibold text-foreground">
              <Star size={15} className="fill-warning text-warning" aria-hidden="true" />
              {store.rating.toFixed(1)}
              <span className="text-[11px] font-normal text-muted">rating</span>
            </dd>
          </div>
          <div>
            <dt className="sr-only">Followers</dt>
            <dd className="flex flex-col items-center gap-0.5 text-sm font-semibold text-foreground">
              <Users size={15} className="text-muted" aria-hidden="true" />
              {formatCompactNumber(store.followers)}
              <span className="text-[11px] font-normal text-muted">followers</span>
            </dd>
          </div>
        </dl>

        <Link
          to={`/store/${store.slug}`}
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-brand-border text-sm font-semibold text-foreground transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Visit Store
          <span className="sr-only"> {store.name}</span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
