import type { OrderStatus, ProductStatus, StockStatus } from '../../types/seller'
import { STOCK_LABELS } from '../../utils/sellerProducts'
import { statusLabel } from '../../utils/sellerOrders'

const TONE: Record<string, string> = {
  pending: 'text-warning',
  processing: 'text-accent',
  shipped: 'text-foreground',
  delivered: 'text-success',
  cancelled: 'text-danger',
  refunded: 'text-danger',
  active: 'text-success',
  draft: 'text-muted',
  'in-stock': 'text-success',
  'low-stock': 'text-warning',
  'out-of-stock': 'text-danger',
}

function Pill({ tone, children }: { tone: string; children: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-brand-border bg-background px-2.5 py-1 text-xs font-semibold ${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  )
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Pill tone={TONE[status] ?? 'text-muted'}>{statusLabel(status)}</Pill>
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return <Pill tone={TONE[status] ?? 'text-muted'}>{status === 'active' ? 'Active' : 'Draft'}</Pill>
}

export function StockBadge({ status }: { status: StockStatus }) {
  return <Pill tone={TONE[status] ?? 'text-muted'}>{STOCK_LABELS[status]}</Pill>
}
