import { ArrowRight, ShieldAlert, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CartSummary, CouponResult } from '../../types/cart'
import { formatMoney } from '../../utils/money'
import {
  FREE_SHIPPING_FROM_CENTS,
  SHIPPING_PER_SELLER_CENTS,
} from '../../utils/cart'
import CouponForm from './CouponForm'

interface OrderSummaryProps {
  summary: CartSummary
  sellerCount: number
  onApplyCoupon: (code: string) => CouponResult
  onRemoveCoupon: () => void
  onClearCart: () => void
}

function Row({
  label,
  value,
  strong = false,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={strong ? 'font-semibold text-foreground' : 'text-muted'}>{label}</dt>
      <dd className={strong ? 'text-2xl font-bold text-foreground' : 'text-foreground'}>
        {value}
      </dd>
    </div>
  )
}

export default function OrderSummary({
  summary,
  sellerCount,
  onApplyCoupon,
  onRemoveCoupon,
  onClearCart,
}: OrderSummaryProps) {
  const canCheckout = summary.itemCount > 0

  return (
    <aside
      aria-label="Order summary"
      className="rounded-3xl border border-brand-border bg-surface p-6"
    >
      <h2 className="font-display text-3xl font-medium text-foreground">Order summary</h2>

      <dl className="mt-6 space-y-3 text-sm">
        <Row
          label={`Subtotal (${summary.itemCount} ${summary.itemCount === 1 ? 'item' : 'items'})`}
          value={formatMoney(summary.subtotalCents)}
        />

        {summary.discountCents > 0 && (
          <Row label="Coupon discount" value={`−${formatMoney(summary.discountCents)}`} />
        )}

        <Row
          label={`Estimated shipping${sellerCount > 1 ? ` (${sellerCount} stores)` : ''}`}
          value={summary.shippingCents === 0 ? 'Free' : formatMoney(summary.shippingCents)}
        />

        <div className="border-t border-brand-border pt-4">
          <Row label="Estimated total" value={formatMoney(summary.totalCents)} strong />
        </div>
      </dl>

      {summary.saleSavingsCents > 0 && (
        <p className="mt-3 text-xs text-success">
          Sale prices already save you {formatMoney(summary.saleSavingsCents)}.
        </p>
      )}

      <div className="mt-6 border-t border-brand-border pt-6">
        <CouponForm
          applied={summary.coupon}
          onApply={onApplyCoupon}
          onRemove={onRemoveCoupon}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {canCheckout ? (
          <Link
            to="/checkout"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-base font-semibold text-on-accent transition-colors hover:bg-accent-hover"
          >
            Proceed to Checkout
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-full bg-accent px-7 text-base font-semibold text-on-accent opacity-50"
          >
            Proceed to Checkout
          </span>
        )}

        <Link
          to="/explore"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-brand-border px-7 text-base font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Continue Shopping
        </Link>

        <button
          type="button"
          onClick={onClearCart}
          className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-danger"
        >
          <Trash2 size={16} aria-hidden="true" />
          Clear Cart
        </button>
      </div>

      <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-muted">
        <ShieldAlert size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>
          Demo estimate, not a real quote. Shipping is{' '}
          {formatMoney(SHIPPING_PER_SELLER_CENTS)} per store, free from{' '}
          {formatMoney(FREE_SHIPPING_FROM_CENTS)} per store. Taxes are not included.
          Nothing is charged or ordered.
        </span>
      </p>
    </aside>
  )
}
