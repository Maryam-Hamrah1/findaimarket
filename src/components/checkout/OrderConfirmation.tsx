import { CircleCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getPaymentMethod } from '../../data/payments'
import type { DemoOrder } from '../../types/checkout'
import { formatMoney } from '../../utils/money'
import { formatDeliveryTime } from '../../utils/shipping'
import Breadcrumb from '../ui/Breadcrumb'
import StoreLogo from '../ui/StoreLogo'
import AddressSummary from './AddressSummary'
import OrderLineList from './OrderLineList'

interface OrderConfirmationProps {
  order: DemoOrder
}

const placedAtFormat = new Intl.DateTimeFormat('en', {
  dateStyle: 'long',
  timeStyle: 'short',
})

/** Sample confirmation shown after "Place Order". No real order exists. */
export default function OrderConfirmation({ order }: OrderConfirmationProps) {
  const unitCount = order.sellers.reduce(
    (sum, seller) => sum + seller.lines.reduce((s, line) => s + line.quantity, 0),
    0,
  )

  return (
    <div className="mx-auto max-w-4xl px-5 pb-16 pt-6 lg:pt-8">
      <Breadcrumb
        items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Order confirmation' }]}
      />

      <header className="mt-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-success">
          <CircleCheck size={34} strokeWidth={1.6} aria-hidden="true" />
        </div>

        <h1
          id="confirmation-heading"
          tabIndex={-1}
          className="mt-5 font-display text-4xl font-medium text-foreground outline-none sm:text-5xl"
        >
          Demo order placed
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-muted">
          Thank you for trying Findaimarket. This is a demonstration:{' '}
          <span className="font-semibold text-foreground">
            no real order was placed and no payment was processed.
          </span>
        </p>

        <p className="mt-6 text-sm text-muted">Demo order reference</p>
        <p className="mt-1 select-all font-mono text-2xl font-bold tracking-wide text-accent">
          {order.reference}
        </p>
        <p className="mt-1 text-xs text-muted">
          {placedAtFormat.format(new Date(order.placedAt))} · {unitCount}{' '}
          {unitCount === 1 ? 'item' : 'items'} from {order.sellers.length}{' '}
          {order.sellers.length === 1 ? 'store' : 'stores'}
        </p>
      </header>

      <div className="mt-10 space-y-6">
        {order.sellers.map((seller) => (
          <section
            key={seller.sellerId}
            aria-label={`Items from ${seller.storeName}`}
            className="rounded-3xl border border-brand-border bg-surface p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-3">
              <StoreLogo name={seller.storeName} logo="" size="sm" className="!h-11 !w-11 !text-lg" />
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-2xl font-semibold text-foreground">
                  {seller.storeName}
                </h2>
                <p className="text-sm text-muted">
                  {seller.delivery.label} · {formatDeliveryTime(seller.delivery)} (demo)
                </p>
              </div>
              {seller.storeSlug && (
                <Link
                  to={`/store/${seller.storeSlug}`}
                  className="text-sm font-semibold text-accent hover:text-accent-hover"
                >
                  Visit Store
                </Link>
              )}
            </div>

            <div className="mt-5">
              <OrderLineList lines={seller.lines} linked={false} />
            </div>

            <dl className="mt-4 space-y-2 border-t border-brand-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="text-foreground">{formatMoney(seller.subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Estimated shipping</dt>
                <dd className="text-foreground">
                  {seller.shippingCents === 0 ? 'Free' : formatMoney(seller.shippingCents)}
                </dd>
              </div>
            </dl>
          </section>
        ))}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl border border-brand-border bg-surface p-5 sm:p-6">
          <h2 className="font-display text-2xl font-semibold text-foreground">Delivering to</h2>
          <div className="mt-3">
            <AddressSummary address={order.customer} />
          </div>

          <h2 className="mt-6 font-display text-2xl font-semibold text-foreground">Payment</h2>
          <p className="mt-2 text-sm text-foreground">
            {getPaymentMethod(order.paymentMethodId).label}{' '}
            <span className="text-muted">(demo, nothing charged)</span>
          </p>
        </section>

        <section className="rounded-3xl border border-brand-border bg-surface p-5 sm:p-6">
          <h2 className="font-display text-2xl font-semibold text-foreground">Order total</h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="text-foreground">{formatMoney(order.totals.subtotalCents)}</dd>
            </div>
            {order.totals.discountCents > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">Discount{order.coupon ? ` (${order.coupon.code})` : ''}</dt>
                <dd className="text-foreground">−{formatMoney(order.totals.discountCents)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Estimated shipping</dt>
              <dd className="text-foreground">
                {order.totals.shippingCents === 0 ? 'Free' : formatMoney(order.totals.shippingCents)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-brand-border pt-4">
              <dt className="font-semibold text-foreground">Total</dt>
              <dd className="text-2xl font-bold text-foreground">{formatMoney(order.totals.totalCents)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted">Taxes are not calculated in this demo.</p>
        </section>
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          to="/explore"
          className="inline-flex min-h-12 items-center rounded-full bg-accent px-8 text-base font-semibold text-on-accent transition-colors hover:bg-accent-hover"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
