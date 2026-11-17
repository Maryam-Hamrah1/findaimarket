import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import CartItemRow from '../components/cart/CartItemRow'
import CartStoreGroup from '../components/cart/CartStoreGroup'
import ClearCartDialog from '../components/cart/ClearCartDialog'
import EmptyCart from '../components/cart/EmptyCart'
import OrderSummary from '../components/cart/OrderSummary'
import Breadcrumb from '../components/ui/Breadcrumb'
import { useCart } from '../hooks/useCart'
import { buildLines, calculateSummary, groupBySeller } from '../utils/cart'
import { formatMoney } from '../utils/money'

export default function CartPage() {
  const {
    items,
    coupon,
    setQuantity,
    removeItem,
    toggleSavedForLater,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart()

  const [confirmOpen, setConfirmOpen] = useState(false)

  // Checkout sends people back here with a message when the cart is empty
  const { state } = useLocation()
  const notice =
    typeof state === 'object' && state !== null && 'notice' in state && typeof state.notice === 'string'
      ? state.notice
      : ''

  useEffect(() => {
    document.title = 'Shopping Cart · Findaimarket'
  }, [])

  const { groups, saved, summary, cartUnits, unavailableCount } = useMemo(() => {
    const lines = buildLines(items)
    const inCart = lines.filter((line) => !line.item.savedForLater)
    const sellerGroups = groupBySeller(inCart)

    return {
      groups: sellerGroups,
      saved: lines.filter((line) => line.item.savedForLater),
      summary: calculateSummary(sellerGroups, coupon),
      cartUnits: inCart.reduce((sum, line) => sum + line.item.quantity, 0),
      unavailableCount: inCart.filter((line) => line.status !== 'ok').length,
    }
  }, [items, coupon])

  const hasItems = groups.length > 0
  const everythingCount = items.length

  return (
    <main>
      <div className="mx-auto max-w-7xl px-5 pb-28 pt-6 lg:pb-16 lg:pt-8">
        <Breadcrumb
          items={[{ label: 'Home', to: '/' }, { label: 'Shopping Cart' }]}
        />

        <header className="mt-6">
          <h1 className="font-display text-4xl font-medium text-foreground sm:text-5xl">
            Shopping Cart
          </h1>
          <p className="mt-2 text-sm text-muted" aria-live="polite">
            {cartUnits === 0
              ? 'No items yet'
              : `${cartUnits} ${cartUnits === 1 ? 'item' : 'items'} from ${groups.length} ${groups.length === 1 ? 'store' : 'stores'}`}
          </p>
        </header>

        {notice && (
          <p
            role="status"
            className="mt-6 rounded-2xl border border-accent/50 bg-primary-light px-5 py-4 text-sm text-foreground"
          >
            {notice}
          </p>
        )}

        <div className="mt-8">
          {hasItems ? (
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
              <div className="space-y-6">
                {unavailableCount > 0 && (
                  <p
                    role="status"
                    className="rounded-2xl border border-danger/50 px-5 py-4 text-sm text-foreground"
                  >
                    {unavailableCount === 1
                      ? 'One item in your cart is unavailable and is not counted in the total.'
                      : `${unavailableCount} items in your cart are unavailable and are not counted in the total.`}
                  </p>
                )}

                {groups.map((group) => (
                  <CartStoreGroup
                    key={group.id}
                    group={group}
                    freeShipping={summary.coupon?.freeShipping === true}
                    onQuantityChange={setQuantity}
                    onRemove={removeItem}
                    onToggleSaved={toggleSavedForLater}
                  />
                ))}
              </div>

              <div className="lg:sticky lg:top-28">
                <OrderSummary
                  summary={summary}
                  sellerCount={groups.length}
                  onApplyCoupon={applyCoupon}
                  onRemoveCoupon={removeCoupon}
                  onClearCart={() => setConfirmOpen(true)}
                />
              </div>
            </div>
          ) : (
            <EmptyCart hasSavedItems={saved.length > 0} />
          )}
        </div>

        {saved.length > 0 && (
          <section aria-labelledby="saved-heading" className="mt-14">
            <h2 id="saved-heading" className="font-display text-3xl font-medium text-foreground">
              Saved for later ({saved.length})
            </h2>

            <ul className="mt-5 divide-y divide-brand-border rounded-3xl border border-brand-border bg-surface px-5 py-5 sm:px-6">
              {saved.map((line) => (
                <CartItemRow
                  key={line.item.key}
                  line={line}
                  onQuantityChange={setQuantity}
                  onRemove={removeItem}
                  onToggleSaved={toggleSavedForLater}
                />
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Phone: the total and checkout stay within reach while scrolling */}
      {hasItems && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-border bg-background/95 px-5 py-3 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted">Estimated total</p>
              <p className="text-xl font-bold text-foreground">
                {formatMoney(summary.totalCents)}
              </p>
            </div>

            {summary.itemCount > 0 ? (
              <Link
                to="/checkout"
                className="inline-flex min-h-12 items-center rounded-full bg-accent px-7 text-base font-semibold text-on-accent transition-colors hover:bg-accent-hover"
              >
                Checkout
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="inline-flex min-h-12 cursor-not-allowed items-center rounded-full bg-accent px-7 text-base font-semibold text-on-accent opacity-50"
              >
                Checkout
              </span>
            )}
          </div>
        </div>
      )}

      <ClearCartDialog
        open={confirmOpen}
        itemCount={everythingCount}
        onConfirm={() => {
          clearCart()
          setConfirmOpen(false)
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </main>
  )
}
