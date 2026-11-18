import { X } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDialog } from '../../hooks/useDialog'
import { sellerOrders } from '../../services/sellerOrders'
import type { OrderStatus, SellerOrder } from '../../types/seller'
import { formatMoney } from '../../utils/money'
import { allowedNextStatuses, statusLabel } from '../../utils/sellerOrders'
import Button from '../ui/Button'
import { TextField } from '../ui/FormFields'
import ProductThumb from './ProductThumb'
import { OrderStatusBadge } from './StatusBadge'

interface OrderDetailsDialogProps {
  order: SellerOrder
  /** The signed-in seller's store. Every change below is made as this store. */
  storeId: number
  onClose: () => void
}

const WORDS: Partial<Record<OrderStatus, string>> = {
  processing: 'Start processing',
  shipped: 'Mark as shipped',
  delivered: 'Mark as delivered',
  cancelled: 'Cancel order',
  refunded: 'Mark as refunded',
}

/** One store's part of an order: items, status changes and tracking. */
export default function OrderDetailsDialog({ order, storeId, onClose }: OrderDetailsDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  useDialog(true, onClose, panelRef)

  const [carrier, setCarrier] = useState(order.tracking?.carrier ?? '')
  const [number, setNumber] = useState(order.tracking?.number ?? '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [confirming, setConfirming] = useState<OrderStatus | null>(null)

  const next = allowedNextStatuses(order.status)
  const closed = order.status === 'cancelled' || order.status === 'refunded'

  const report = (result: { ok: true } | { ok: false; message: string }, success: string) => {
    if (result.ok) {
      setError('')
      setMessage(success)
    } else {
      setMessage('')
      setError(result.message)
    }
  }

  const saveTracking = () => {
    if (carrier.trim() === '' || number.trim() === '') {
      setMessage('')
      setError('Enter both a carrier and a tracking number.')
      return false
    }
    const result = sellerOrders.setTracking(storeId, order.id, { carrier, number })
    report(result, 'Tracking saved.')
    return result.ok
  }

  const changeStatus = (status: OrderStatus) => {
    if ((status === 'cancelled' || status === 'refunded') && confirming !== status) {
      setConfirming(status)
      return
    }
    setConfirming(null)

    // Shipping needs tracking first: save what was typed, then move on
    if (status === 'shipped' && !(order.tracking?.number === number.trim() && order.tracking.carrier === carrier.trim())) {
      if (!saveTracking()) return
    }
    report(sellerOrders.setStatus(storeId, order.id, status), `Order is now ${statusLabel(status)}.`)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-5">
      <div className="drawer-overlay absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-title"
        tabIndex={-1}
        className="fade-in relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-brand-border bg-surface p-6 shadow-card sm:rounded-3xl sm:p-8"
      >
        <button type="button" onClick={onClose} aria-label="Close order details" className="absolute right-4 top-4 rounded-full p-2 text-foreground hover:bg-surface-hover">
          <X size={20} aria-hidden="true" />
        </button>

        <h2 id="order-title" className="pr-10 font-display text-3xl font-medium text-foreground">Order {order.reference}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
          <OrderStatusBadge status={order.status} />
          <span>{new Date(order.placedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          {order.sample && <span className="font-semibold">Sample order</span>}
        </div>

        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-muted">Customer</dt><dd className="mt-1 font-semibold text-foreground">{order.customerName}</dd></div>
          <div><dt className="text-muted">Ship to</dt><dd className="mt-1 font-semibold text-foreground">{order.city}, {order.country}</dd></div>
        </dl>

        <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-accent">Items from your store</h3>
        <ul className="mt-3 divide-y divide-brand-border rounded-2xl border border-brand-border">
          {order.lines.map((line, index) => (
            <li key={`${line.productId}-${index}`} className="flex items-center gap-3 p-3">
              <ProductThumb src={line.image} name={line.name} />
              <div className="min-w-0 flex-1">
                <Link to={line.path} className="block truncate text-sm font-semibold text-foreground hover:text-accent" onClick={onClose}>{line.name}</Link>
                <p className="text-xs text-muted">
                  {line.quantity} × {formatMoney(line.unitPriceCents)}
                  {line.choices.length > 0 && ` · ${line.choices.map(([label, value]) => `${label}: ${value}`).join(', ')}`}
                </p>
              </div>
              <p className="text-sm font-semibold text-foreground">{formatMoney(line.totalCents)}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between"><dt className="text-muted">Items</dt><dd className="text-foreground">{formatMoney(order.subtotalCents)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd className="text-foreground">{formatMoney(order.shippingCents)}</dd></div>
          <div className="flex justify-between border-t border-brand-border pt-2 text-base font-bold"><dt className="text-foreground">Your total</dt><dd className="text-foreground">{formatMoney(order.totalCents)}</dd></div>
        </dl>

        {!closed && (
          <>
            <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-accent">Tracking (demo)</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <TextField id="tracking-carrier" label="Carrier" value={carrier} onChange={(event) => setCarrier(event.target.value)} placeholder="Sample Post" />
              <TextField id="tracking-number" label="Tracking number" value={number} onChange={(event) => setNumber(event.target.value)} placeholder="SP123456789" />
            </div>
            <Button variant="outline" size="sm" className="mt-3" onClick={saveTracking}>Save tracking</Button>
            <p className="mt-2 text-xs text-muted">Tracking is just text here. No carrier is contacted and nothing is really shipped.</p>
          </>
        )}

        <div className="mt-6">
          {next.length > 0 ? (
            <>
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">Update status</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {next.map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={status === 'cancelled' || status === 'refunded' ? 'outline' : 'secondary'}
                    onClick={() => changeStatus(status)}
                  >
                    {confirming === status ? `Confirm: ${WORDS[status] ?? statusLabel(status)}` : (WORDS[status] ?? statusLabel(status))}
                  </Button>
                ))}
                {confirming && <Button size="sm" variant="ghost" onClick={() => setConfirming(null)}>Keep as is</Button>}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted">This order is {statusLabel(order.status).toLowerCase()}, so its status cannot change.</p>
          )}
        </div>

        <p aria-live="polite" className="mt-4 min-h-5 text-sm font-semibold text-success">{message}</p>
        {error && <p role="alert" className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    </div>
  )
}
