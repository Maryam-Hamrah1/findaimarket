import { ArrowRight, BadgeCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { SellerGroup } from '../../types/cart'
import { formatMoney } from '../../utils/money'
import StoreLogo from '../ui/StoreLogo'
import CartItemRow from './CartItemRow'

interface CartStoreGroupProps {
  group: SellerGroup
  freeShipping: boolean
  onQuantityChange: (key: string, quantity: number) => void
  onRemove: (key: string) => void
  onToggleSaved: (key: string) => void
}

/** All cart items of one seller, with that seller's own subtotal. */
export default function CartStoreGroup({
  group,
  freeShipping,
  onQuantityChange,
  onRemove,
  onToggleSaved,
}: CartStoreGroupProps) {
  const { store } = group

  return (
    <section
      aria-label={`Items from ${group.storeName}`}
      className="rounded-3xl border border-brand-border bg-surface"
    >
      <header className="flex flex-wrap items-center gap-4 border-b border-brand-border px-5 py-4 sm:px-6">
        <StoreLogo name={group.storeName} logo={store?.logo ?? ''} size="sm" />

        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">Sold by</p>
          <h2 className="flex flex-wrap items-center gap-2 font-display text-2xl font-semibold text-foreground">
            {group.storeName}
            {store?.verified && (
              <span className="inline-flex items-center gap-1 rounded-full border border-accent/50 px-2.5 py-0.5 font-sans text-xs font-semibold text-accent">
                <BadgeCheck size={14} aria-hidden="true" />
                Verified
              </span>
            )}
          </h2>
        </div>

        {store && (
          <Link
            to={`/store/${store.slug}`}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-accent"
          >
            Visit Store
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )}
      </header>

      <ul className="divide-y divide-brand-border px-5 py-5 sm:px-6">
        {group.lines.map((line) => (
          <CartItemRow
            key={line.item.key}
            line={line}
            onQuantityChange={onQuantityChange}
            onRemove={onRemove}
            onToggleSaved={onToggleSaved}
          />
        ))}
      </ul>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-brand-border px-5 py-4 text-sm sm:px-6">
        <span className="text-muted">
          Estimated shipping (demo):{' '}
          <span className="font-semibold text-foreground">
            {freeShipping || group.shippingCents === 0
              ? 'Free'
              : formatMoney(group.shippingCents)}
          </span>
        </span>
        <span className="text-muted">
          {group.storeName} subtotal:{' '}
          <span className="font-semibold text-foreground">
            {formatMoney(group.subtotalCents)}
          </span>
        </span>
      </footer>
    </section>
  )
}
