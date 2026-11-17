import { TriangleAlert } from 'lucide-react'
import type { SellerGroup } from '../../types/cart'
import type { DeliveryMethodId, DeliverySelection } from '../../types/checkout'
import { formatMoney } from '../../utils/money'
import {
  formatDeliveryTime,
  getDeliveryOptions,
  getSelectedOption,
} from '../../utils/shipping'
import { toOrderLine } from '../../utils/orders'
import Button from '../ui/Button'
import StoreLogo from '../ui/StoreLogo'
import OrderLineList from './OrderLineList'

interface DeliveryStepProps {
  groups: readonly SellerGroup[]
  destination: string
  selection: DeliverySelection
  onSelect: (sellerId: string, method: DeliveryMethodId) => void
  /** Shipping per seller after any coupon */
  shippingBySeller: Readonly<Record<string, number>>
  shippingTotalCents: number
  freeShippingCoupon: boolean
  onBack: () => void
  onContinue: () => void
}

export default function DeliveryStep({
  groups,
  destination,
  selection,
  onSelect,
  shippingBySeller,
  shippingTotalCents,
  freeShippingCoupon,
  onBack,
  onContinue,
}: DeliveryStepProps) {
  return (
    <div>
      <p
        role="note"
        className="flex items-start gap-3 rounded-2xl border border-brand-border bg-surface px-4 py-3 text-sm text-muted"
      >
        <TriangleAlert size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
        <span>
          <span className="font-semibold text-foreground">Demo delivery options.</span>{' '}
          Prices and delivery times are examples, not real quotes or promises.
          Each seller ships its own parcel, so you choose a method for every store.
        </span>
      </p>

      <div className="mt-6 space-y-6">
        {groups.map((group) => {
          const options = getDeliveryOptions(group, destination)
          const chosen = getSelectedOption(group, destination, selection)
          const legendId = `delivery-${group.id}`

          return (
            <section
              key={group.id}
              aria-labelledby={legendId}
              className="rounded-3xl border border-brand-border bg-surface"
            >
              <header className="flex items-center gap-3 border-b border-brand-border px-5 py-4">
                <StoreLogo name={group.storeName} logo={group.store?.logo ?? ''} size="sm" className="!h-11 !w-11 !text-lg" />
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted">Shipped by</p>
                  <h3 id={legendId} className="font-display text-2xl font-semibold text-foreground">
                    {group.storeName}
                  </h3>
                </div>
              </header>

              <div className="border-b border-brand-border px-5 py-5">
                <OrderLineList lines={group.lines.map(toOrderLine)} />
              </div>

              <div role="radiogroup" aria-labelledby={legendId} className="space-y-3 px-5 py-5">
                {options.map((option) => {
                  const selected = chosen.id === option.id
                  const price = freeShippingCoupon ? 0 : option.priceCents

                  return (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors ${
                        selected
                          ? 'border-accent bg-primary-light'
                          : 'border-brand-border hover:border-accent/60'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`delivery-${group.id}`}
                        checked={selected}
                        onChange={() => onSelect(group.id, option.id)}
                        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-accent"
                      />

                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-foreground">{option.label}</span>
                        <span className="mt-0.5 block text-sm text-muted">
                          {formatDeliveryTime(option)} (demo)
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted">
                          {option.description}
                        </span>
                      </span>

                      <span className="shrink-0 font-bold text-foreground">
                        {price === 0 ? 'Free' : formatMoney(price)}
                      </span>
                    </label>
                  )
                })}
              </div>

              <footer className="flex justify-between px-5 pb-5 text-sm text-muted">
                <span>Estimated shipping for {group.storeName}</span>
                <span className="font-semibold text-foreground">
                  {shippingBySeller[group.id] === 0
                    ? 'Free'
                    : formatMoney(shippingBySeller[group.id] ?? 0)}
                </span>
              </footer>
            </section>
          )
        })}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-brand-border px-5 py-4">
        <span className="font-semibold text-foreground">
          Combined shipping estimate
          {groups.length > 1 && (
            <span className="font-normal text-muted"> ({groups.length} stores)</span>
          )}
        </span>
        <span className="text-xl font-bold text-foreground">
          {shippingTotalCents === 0 ? 'Free' : formatMoney(shippingTotalCents)}
        </span>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="outline" size="lg" onClick={onBack} className="min-h-12">
          Back to shipping
        </Button>
        <Button variant="secondary" size="lg" onClick={onContinue} className="min-h-12">
          Continue to payment
        </Button>
      </div>
    </div>
  )
}
