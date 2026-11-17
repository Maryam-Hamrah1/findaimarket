import { ArrowLeft } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import CheckoutSteps from '../components/checkout/CheckoutSteps'
import CheckoutSummary from '../components/checkout/CheckoutSummary'
import DeliveryStep from '../components/checkout/DeliveryStep'
import OrderConfirmation from '../components/checkout/OrderConfirmation'
import PaymentStep from '../components/checkout/PaymentStep'
import ReviewStep from '../components/checkout/ReviewStep'
import ShippingStep from '../components/checkout/ShippingStep'
import Breadcrumb from '../components/ui/Breadcrumb'
import { findCoupon } from '../data/coupons'
import { getPaymentMethod, isPaymentAvailable } from '../data/payments'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import {
  CHECKOUT_STEPS,
  EMPTY_ADDRESS,
  type CheckoutStep,
  type DeliveryMethodId,
  type DeliverySelection,
  type DemoOrder,
  type PaymentMethodId,
  type ShippingAddress,
} from '../types/checkout'
import { buildLines } from '../utils/cart'
import { normaliseAddress, validateAddress } from '../utils/checkout'
import { saveOrder } from '../services/orderHistory'
import { buildDemoOrder } from '../utils/orders'
import { calculateCheckoutTotals, getCheckoutGroups } from '../utils/shipping'

const STEP_TITLES: Record<CheckoutStep, string> = {
  shipping: 'Shipping information',
  delivery: 'Delivery method',
  payment: 'Payment method',
  review: 'Review your order',
}

const EMPTY_CART_NOTICE =
  'Your cart is empty, so there is nothing to check out yet. Add a product first.'

export default function CheckoutPage() {
  const { items, coupon, removeItem, removeCoupon } = useCart()
  const { user } = useAuth()

  // Everything the customer typed or chose lives here, so going back keeps it
  const [step, setStep] = useState<CheckoutStep>('shipping')
  const [furthest, setFurthest] = useState(0)
  const [address, setAddress] = useState<ShippingAddress>(() =>
    // Signed-in people start with what their account already knows
    user
      ? { ...EMPTY_ADDRESS, fullName: user.fullName, email: user.email, country: user.country }
      : EMPTY_ADDRESS,
  )
  const [selection, setSelection] = useState<DeliverySelection>({})
  const [paymentId, setPaymentId] = useState<PaymentMethodId | null>(null)
  const [order, setOrder] = useState<DemoOrder | null>(null)

  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  const groups = useMemo(() => getCheckoutGroups(buildLines(items)), [items])
  const coupons = findCoupon(coupon)
  const totals = useMemo(
    () => calculateCheckoutTotals(groups, address.country, selection, coupon),
    [groups, address.country, selection, coupon],
  )

  useEffect(() => {
    document.title = `${order ? 'Order confirmation' : 'Checkout'} · Findaimarket`
  }, [order])

  // Move to the top and focus the new heading so keyboard and screen reader users follow along
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    window.scrollTo({ top: 0 })
    const target = order ? document.getElementById('confirmation-heading') : headingRef.current
    target?.focus()
  }, [step, order])

  if (order) return <main><OrderConfirmation order={order} /></main>

  if (groups.length === 0) {
    return <Navigate to="/cart" replace state={{ notice: EMPTY_CART_NOTICE }} />
  }

  // Later steps open only while the address is valid and (for Review) a payment method is chosen
  const addressValid = Object.keys(validateAddress(address)).length === 0
  const reachable = new Set<CheckoutStep>(
    addressValid
      ? CHECKOUT_STEPS.slice(0, furthest + 1)
          .map((candidate) => candidate.id)
          .filter((id) => id !== 'review' || paymentId !== null)
      : ['shipping'],
  )

  const goTo = (target: CheckoutStep) => {
    const next = !addressValid ? 'shipping' : target === 'review' && !paymentId ? 'payment' : target
    const nextIndex = CHECKOUT_STEPS.findIndex((candidate) => candidate.id === next)
    setFurthest((previous) => Math.max(previous, nextIndex))
    setStep(next)
  }

  const handleShippingDone = () => {
    const cleaned = normaliseAddress(address)
    setAddress(cleaned)

    // A payment method chosen earlier may not exist in a newly chosen country
    if (paymentId && !isPaymentAvailable(getPaymentMethod(paymentId), cleaned.country)) {
      setPaymentId(null)
    }

    goTo('delivery')
  }

  const handlePlaceOrder = () => {
    if (!paymentId || !addressValid) return

    const placed = buildDemoOrder({
      address,
      groups,
      selection,
      paymentMethodId: paymentId,
      couponCode: coupon,
    })

    setOrder(placed)
    if (user) saveOrder(user.id, placed)

    // Take the purchased items out of the cart. Saved-for-later and unavailable items stay.
    for (const group of groups) {
      for (const line of group.lines) removeItem(line.item.key)
    }
    removeCoupon()
  }

  const shippingKnown = furthest > 0

  return (
    <main>
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-6 lg:pt-8">
        <Breadcrumb
          items={[{ label: 'Home', to: '/' }, { label: 'Cart', to: '/cart' }, { label: 'Checkout' }]}
        />

        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-4xl font-medium text-foreground sm:text-5xl">
            Checkout
          </h1>
          <Link
            to="/cart"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to cart
          </Link>
        </div>

        <div className="mt-8">
          <CheckoutSteps current={step} reachable={reachable} onSelect={goTo} />
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          <div className="order-2 lg:order-1">
            <h2
              ref={headingRef}
              tabIndex={-1}
              className="mb-6 font-display text-3xl font-medium text-foreground outline-none"
            >
              {STEP_TITLES[step]}
            </h2>

            <div key={step} className="fade-in">
              {step === 'shipping' && (
                <ShippingStep
                  address={address}
                  onChange={setAddress}
                  onContinue={handleShippingDone}
                />
              )}

              {step === 'delivery' && (
                <DeliveryStep
                  groups={groups}
                  destination={address.country}
                  selection={selection}
                  onSelect={(sellerId, method: DeliveryMethodId) =>
                    setSelection((previous) => ({ ...previous, [sellerId]: method }))
                  }
                  shippingBySeller={totals.shippingBySeller}
                  shippingTotalCents={totals.shippingCents}
                  freeShippingCoupon={coupons?.freeShipping === true}
                  onBack={() => goTo('shipping')}
                  onContinue={() => goTo('payment')}
                />
              )}

              {step === 'payment' && (
                <PaymentStep
                  selected={paymentId}
                  destination={address.country}
                  onSelect={setPaymentId}
                  onBack={() => goTo('delivery')}
                  onContinue={() => goTo('review')}
                />
              )}

              {step === 'review' && paymentId && (
                <ReviewStep
                  address={address}
                  groups={groups}
                  selection={selection}
                  paymentMethodId={paymentId}
                  totals={totals}
                  shippingBySeller={totals.shippingBySeller}
                  couponCode={coupons?.code ?? null}
                  onEdit={goTo}
                  onBack={() => goTo('payment')}
                  onPlaceOrder={handlePlaceOrder}
                />
              )}
            </div>
          </div>

          <div className="order-1 lg:sticky lg:top-28 lg:order-2">
            <CheckoutSummary
              groups={groups}
              totals={totals}
              shippingKnown={shippingKnown}
              couponCode={coupons?.code ?? null}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
