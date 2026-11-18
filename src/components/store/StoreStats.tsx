import { Star } from 'lucide-react'
import type { Store } from '../../types/store'
import { formatCompactNumber } from '../../utils/stores'

interface StoreStatsProps {
  store: Store
  /** Follower count including the visitor's own follow */
  followers: number
  /** Made by a seller in this browser: figures are real zeros, not sample numbers */
  userCreated?: boolean
}

export default function StoreStats({ store, followers, userCreated = false }: StoreStatsProps) {
  const items = [
    { label: 'Products', value: String(store.productCount) },
    { label: 'Average rating', value: store.rating.toFixed(1), star: true },
    { label: 'Followers', value: formatCompactNumber(followers) },
    { label: 'Reviews', value: formatCompactNumber(store.reviewCount) },
  ]

  return (
    <section aria-label="Store statistics" className="mt-8">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-brand-border bg-brand-border sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="bg-surface px-5 py-4 text-center">
            <dd className="flex items-center justify-center gap-1.5 font-display text-3xl font-medium text-foreground">
              {item.star && <Star size={20} className="fill-warning text-warning" aria-hidden="true" />}
              {item.value}
            </dd>
            <dt className="mt-1 text-xs uppercase tracking-[0.12em] text-muted">
              {item.label}
            </dt>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-center text-xs text-muted">
        {userCreated
          ? 'New demo store. Nothing has been verified.'
          : 'Sample figures for design preview, not verified business data.'}
      </p>
    </section>
  )
}
