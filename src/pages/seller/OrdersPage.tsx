import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import FilterSelect from '../../components/seller/FilterSelect'
import OrderDetailsDialog from '../../components/seller/OrderDetailsDialog'
import PageHeader from '../../components/seller/PageHeader'
import SearchBox from '../../components/seller/SearchBox'
import { OrderStatusBadge } from '../../components/seller/StatusBadge'
import { LINK_BUTTON, TABLE, TD, TH } from '../../components/seller/table'
import Button from '../../components/ui/Button'
import { useSellerOrders, useSellerProducts } from '../../hooks/useSellerData'
import { useSellerStore } from '../../hooks/useSellerStore'
import { sellerOrders } from '../../services/sellerOrders'
import type { OrderStatus } from '../../types/seller'
import { formatMoney } from '../../utils/money'
import { ORDER_STATUSES, countUnits, createSampleOrders, filterOrders, newestFirst } from '../../utils/sellerOrders'

export default function OrdersPage() {
  const { store } = useSellerStore()
  const orders = useSellerOrders(store.id)
  const products = useSellerProducts(store.id)
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<OrderStatus | 'all'>('all')
  const [message, setMessage] = useState('')

  useEffect(() => {
    document.title = 'Orders · Seller dashboard · Findaimarket'
  }, [])

  const visible = useMemo(() => newestFirst(filterOrders(orders, { query, status })), [orders, query, status])
  // Looked up in this store's own orders only
  const openId = params.get('order')
  const open = openId ? orders.find((order) => order.id === openId) : undefined

  const openOrder = (id: string | null) => {
    const next = new URLSearchParams(params)
    if (id) next.set('order', id)
    else next.delete('order')
    setParams(next, { replace: true })
  }

  const createSamples = () => {
    const samples = createSampleOrders(store.id, products)
    const fresh = samples.filter((sample) => !orders.some((order) => order.id === sample.id))
    if (fresh.length === 0) {
      setMessage('Sample orders were already created for this store.')
      return
    }
    setMessage(sellerOrders.add(fresh) ? `${fresh.length} sample orders created. They are labelled "sample".` : 'Your browser could not save the sample orders.')
  }

  return (
    <div className="fade-in">
      <PageHeader
        title="Orders"
        description="Only orders that contain products from your store. Other stores' items are never shown here."
        actions={
          <Button variant="outline" onClick={createSamples} disabled={products.length === 0} title={products.length === 0 ? 'Add a product first' : undefined}>
            Create sample orders
          </Button>
        }
      />

      <p className="mb-4 rounded-xl border border-brand-border bg-surface px-4 py-3 text-xs leading-5 text-muted">
        Demo orders only. They come from demo checkouts in this browser (no payment was taken) or from the sample button.
      </p>
      <p aria-live="polite" className="mb-3 min-h-5 text-sm font-semibold text-foreground">{message}</p>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-surface px-6 py-14 text-center">
          <h2 className="font-display text-2xl font-medium text-foreground">No orders yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            When a customer buys one of your Active products in this demo, the order appears here. To try the
            workflow now, add a product and create sample orders.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap gap-3">
            <SearchBox id="order-search" label="Search orders" placeholder="Search by order, customer or product" value={query} onChange={setQuery} />
            <FilterSelect
              id="order-status"
              label="Order status"
              value={status}
              onChange={(value) => setStatus(value as OrderStatus | 'all')}
              options={[{ value: 'all', label: 'All statuses' }, ...ORDER_STATUSES]}
            />
          </div>

          {visible.length === 0 ? (
            <p className="rounded-2xl border border-brand-border bg-surface px-6 py-10 text-center text-sm text-muted">No orders match.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-brand-border bg-surface">
              <table className={`${TABLE} min-w-[820px]`}>
                <caption className="sr-only">Orders for your store</caption>
                <thead>
                  <tr>
                    <th className={TH}>Order ID</th>
                    <th className={TH}>Customer</th>
                    <th className={TH}>Date</th>
                    <th className={TH}>Products</th>
                    <th className={TH}>Qty</th>
                    <th className={TH}>Your total</th>
                    <th className={TH}>Status</th>
                    <th className={TH}><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((order) => (
                    <tr key={order.id}>
                      <td className={`${TD} font-semibold`}>{order.reference}{order.sample && <span className="ml-1.5 text-xs font-normal text-muted">(sample)</span>}</td>
                      <td className={TD}>{order.customerName}</td>
                      <td className={`${TD} whitespace-nowrap`}>{new Date(order.placedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className={`${TD} max-w-[14rem]`}>
                        <span className="line-clamp-2">{order.lines.map((line) => line.name).join(', ')}</span>
                      </td>
                      <td className={TD}>{countUnits(order)}</td>
                      <td className={`${TD} font-semibold`}>{formatMoney(order.totalCents)}</td>
                      <td className={TD}><OrderStatusBadge status={order.status} /></td>
                      <td className={TD}>
                        <button type="button" onClick={() => openOrder(order.id)} className={LINK_BUTTON} aria-label={`View details of order ${order.reference}`}>View details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {open && <OrderDetailsDialog key={open.id} order={open} storeId={store.id} onClose={() => openOrder(null)} />}
    </div>
  )
}
