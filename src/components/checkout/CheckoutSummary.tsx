import { ChevronDown } from 'lucide-react'
import type { SellerGroup } from '../../types/cart'
import type { OrderTotals } from '../../types/checkout'
import { formatMoney } from '../../utils/money'

interface CheckoutSummaryProps {
  groups: readonly SellerGroup[]
  totals: OrderTotals
  /** false until the delivery step has made shipping known */
  shippingKnown: boolean
  couponCode: string | null
}

function Body({ groups, totals, shippingKnown, couponCode }: CheckoutSummaryProps) {
  const units = groups.reduce(
    (sum, group) =>
      sum + group.lines.reduce((lineSum, line) => lineSum + line.item.quantity, 0),
    0,
  )

  return (
    <div>
      <ul className="space-y-2 text-sm">
        {groups.map((group) => (
          <li key={group.id} className="flex justify-between gap-3">
            <span className="min-w-0 truncate text-muted">{group.storeName}</span>
            <span className="shrink-0 text-foreground">{formatMoney(group.subtotalCents)}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-3 border-t border-brand-border pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">
            Subtotal ({units} {units === 1 ? 'item' : 'items'})
          </dt>
          <dd className="text-foreground">{formatMoney(totals.subtotalCents)}</dd>
        </div>

        {totals.discountCents > 0 && (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Discount{couponCode ? ` (${couponCode})` : ''}</dt>
            <dd className="text-foreground">−{formatMoney(totals.discountCents)}</dd>
          </div>
        )}

        <div className="flex justify-between gap-4">
          <dt className="text-muted">Estimated shipping</dt>
          <dd className="text-foreground">
            {shippingKnown
              ? totals.shippingCents === 0
                ? 'Free'
                : formatMoney(totals.shippingCents)
              : 'Next step'}
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-4 border-t border-brand-border pt-4">
          <dt className="font-semibold text-foreground">
            {shippingKnown ? 'Estimated total' : 'Total so far'}
          </dt>
          <dd className="text-2xl font-bold text-foreground">{formatMoney(totals.totalCents)}</dd>
        </div>
      </dl>

      <p className="mt-4 text-xs leading-5 text-muted">
        Demo estimate. Shipping is an example, taxes are not calculated, and
        nothing is charged.
      </p>
    </div>
  )
}

/** Running total: a folding panel on phones, a sticky card on large screens. */
export default function CheckoutSummary(props: CheckoutSummaryProps) {
  return (
    <>
      <details className="group rounded-2xl border border-brand-border bg-surface lg:hidden">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3">
          <span className="font-semibold text-foreground">
            Order summary
            <ChevronDown
              size={17}
              className="ml-2 inline text-muted transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </span>
          <span className="font-bold text-foreground">{formatMoney(props.totals.totalCents)}</span>
        </summary>
        <div className="border-t border-brand-border px-5 py-5">
          <Body {...props} />
        </div>
      </details>

      <aside
        aria-label="Order summary"
        className="hidden rounded-3xl border border-brand-border bg-surface p-6 lg:block"
      >
        <h2 className="mb-5 font-display text-3xl font-medium text-foreground">Order summary</h2>
        <Body {...props} />
      </aside>
    </>
  )
}
