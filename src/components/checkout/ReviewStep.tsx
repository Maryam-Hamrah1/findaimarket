import { Pencil, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { getPaymentMethod } from '../../data/payments'
import type { SellerGroup } from '../../types/cart'
import type {
  CheckoutStep,
  DeliverySelection,
  OrderTotals,
  PaymentMethodId,
  ShippingAddress,
} from '../../types/checkout'
import { formatMoney } from '../../utils/money'
import { toOrderLine } from '../../utils/orders'
import { formatDeliveryTime, getSelectedOption } from '../../utils/shipping'
import Button from '../ui/Button'
import StoreLogo from '../ui/StoreLogo'
import AddressSummary from './AddressSummary'
import OrderLineList from './OrderLineList'

interface ReviewStepProps {
  address: ShippingAddress
  groups: readonly SellerGroup[]
  selection: DeliverySelection
  paymentMethodId: PaymentMethodId
  totals: OrderTotals
  shippingBySeller: Readonly<Record<string, number>>
  couponCode: string | null
  onEdit: (step: CheckoutStep) => void
  onBack: () => void
  onPlaceOrder: () => void
}

function Block({
  title,
  onEdit,
  editLabel,
  children,
}: {
  title: string
  onEdit: () => void
  editLabel: string
  children: ReactNode
}) {
  return (
    <section className="rounded-3xl border border-brand-border bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-2xl font-semibold text-foreground">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          aria-label={editLabel}
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
        >
          <Pencil size={15} aria-hidden="true" />
          Edit
        </button>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  )
}

export default function ReviewStep({
  address,
  groups,
  selection,
  paymentMethodId,
  totals,
  shippingBySeller,
  couponCode,
  onEdit,
  onBack,
  onPlaceOrder,
}: ReviewStepProps) {
  const payment = getPaymentMethod(paymentMethodId)

  return (
    <div className="space-y-6">
      <Block title="Shipping address" onEdit={() => onEdit('shipping')} editLabel="Edit shipping address">
        <AddressSummary address={address} />
      </Block>

      {groups.map((group) => {
        const option = getSelectedOption(group, address.country, selection)
        const shipping = shippingBySeller[group.id] ?? 0

        return (
          <Block
            key={group.id}
            title={group.storeName}
            onEdit={() => onEdit('delivery')}
            editLabel={`Edit delivery for ${group.storeName}`}
          >
            <div className="mb-4 flex items-center gap-3">
              <StoreLogo
                name={group.storeName}
                logo={group.store?.logo ?? ''}
                size="sm"
                className="!h-10 !w-10 !text-base"
              />
              <p className="text-sm text-muted">
                {option.label} · {formatDeliveryTime(option)} (demo)
              </p>
            </div>

            <OrderLineList lines={group.lines.map(toOrderLine)} />

            <dl className="mt-4 space-y-2 border-t border-brand-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="text-foreground">{formatMoney(group.subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Estimated shipping</dt>
                <dd className="text-foreground">{shipping === 0 ? 'Free' : formatMoney(shipping)}</dd>
              </div>
            </dl>
          </Block>
        )
      })}

      <Block title="Payment method" onEdit={() => onEdit('payment')} editLabel="Edit payment method">
        <p className="font-semibold text-foreground">{payment.label}</p>
        <p className="mt-1 text-sm text-muted">
          Demo only. No payment is processed.
        </p>
      </Block>

      <section
        aria-label="Order total"
        className="rounded-3xl border border-brand-border bg-surface p-5 sm:p-6"
      >
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="text-foreground">{formatMoney(totals.subtotalCents)}</dd>
          </div>

          {totals.discountCents > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">Discount{couponCode ? ` (${couponCode})` : ''}</dt>
              <dd className="text-foreground">−{formatMoney(totals.discountCents)}</dd>
            </div>
          )}

          <div className="flex justify-between">
            <dt className="text-muted">Estimated shipping</dt>
            <dd className="text-foreground">
              {totals.shippingCents === 0 ? 'Free' : formatMoney(totals.shippingCents)}
            </dd>
          </div>

          <div className="flex items-baseline justify-between border-t border-brand-border pt-4">
            <dt className="font-semibold text-foreground">Grand total</dt>
            <dd className="text-3xl font-bold text-foreground">{formatMoney(totals.totalCents)}</dd>
          </div>
        </dl>

        <p className="mt-3 text-xs text-muted">Taxes are not calculated in this demo.</p>
      </section>

      <p
        role="note"
        className="flex items-start gap-3 rounded-2xl border border-brand-border px-4 py-3 text-sm text-muted"
      >
        <TriangleAlert size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
        <span>
          This is a prototype. Placing the order only shows a sample confirmation.
          No real order is created, no seller is contacted and no payment is taken.
        </span>
      </p>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="outline" size="lg" onClick={onBack} className="min-h-12">
          Back to payment
        </Button>
        <Button variant="secondary" size="lg" onClick={onPlaceOrder} className="min-h-12">
          Place Order
        </Button>
      </div>
    </div>
  )
}
