import { Eye, Heart, Package, ShoppingBag, Star, Timer, Wallet } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AreaChart from '../../components/seller/AreaChart'
import DemoBadge from '../../components/seller/DemoBadge'
import Panel from '../../components/seller/Panel'
import ProductThumb from '../../components/seller/ProductThumb'
import StatCard from '../../components/seller/StatCard'
import { OrderStatusBadge } from '../../components/seller/StatusBadge'
import { LINK_BUTTON, TABLE, TD, TH } from '../../components/seller/table'
import { useAuth } from '../../hooks/useAuth'
import { useSellerOrders, useSellerProducts } from '../../hooks/useSellerData'
import { useSellerStore } from '../../hooks/useSellerStore'
import { SALES_RANGES, makeDemoSeries, salesBuckets, sumDays, type SalesRange } from '../../utils/demoStats'
import { formatMoney } from '../../utils/money'
import { countUnits, newestFirst, summariseOrders, topProducts } from '../../utils/sellerOrders'

const dollars = (cents: number) => formatMoney(cents)

export default function OverviewPage() {
  const { user } = useAuth()
  const { store } = useSellerStore()
  const products = useSellerProducts(store.id)
  const orders = useSellerOrders(store.id)
  const [range, setRange] = useState<SalesRange>('weekly')

  useEffect(() => {
    document.title = 'Seller dashboard · Findaimarket'
  }, [])

  const summary = useMemo(() => summariseOrders(orders), [orders])
  const recent = useMemo(() => newestFirst(orders).slice(0, 5), [orders])
  const best = useMemo(() => topProducts(orders, 5), [orders])
  const buckets = useMemo(() => salesBuckets(store.id, range), [store.id, range])
  const monthly = useMemo(() => sumDays(makeDemoSeries(store.id, 30)), [store.id])

  const firstName = user?.fullName.split(' ')[0] ?? ''

  return (
    <div className="fade-in space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium text-foreground sm:text-4xl">
          Welcome{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="mt-1.5 text-sm text-muted">Here is how {store.name} is doing.</p>
        <p className="mt-3 rounded-xl border border-brand-border bg-surface px-4 py-3 text-xs leading-5 text-muted">
          Demo dashboard. Orders come from demo checkouts in this browser. Charts and store views are made-up
          numbers for the design preview. No real sales, payments or analytics.
        </p>
      </div>

      <section aria-label="Summary" className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total sales" value={dollars(summary.salesCents)} icon={Wallet} hint="From demo orders" />
        <StatCard label="Total orders" value={String(summary.orderCount)} icon={ShoppingBag} hint="All statuses" />
        <StatCard label="Total products" value={String(products.length)} icon={Package} hint={`${products.filter((p) => p.status === 'active').length} active`} />
        <StatCard label="Pending orders" value={String(summary.pendingCount)} icon={Timer} hint="Need your attention" />
        <StatCard label="Store views" value={monthly.views.toLocaleString('en-US')} icon={Eye} demo hint="Last 30 days" />
      </section>

      <Panel
        title="Sales overview"
        badge={<DemoBadge />}
        action={
          <div role="group" aria-label="Chart period" className="flex gap-1.5">
            {SALES_RANGES.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={range === item.value}
                onClick={() => setRange(item.value)}
                className={`min-h-9 rounded-full px-4 text-xs font-semibold transition-colors ${
                  range === item.value ? 'bg-accent text-on-accent' : 'border border-brand-border text-foreground hover:border-accent hover:text-accent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        }
      >
        <AreaChart
          labels={buckets.map((bucket) => bucket.label)}
          values={buckets.map((bucket) => Math.round(bucket.salesCents / 100))}
          format={(value) => `$${value.toLocaleString('en-US')}`}
          label={`Demo sales, ${range}`}
        />
        <p className="mt-2 text-xs text-muted">Demonstration data. It does not include your real demo orders.</p>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Recent orders" action={<Link to="/seller/dashboard/orders" className="text-sm font-semibold text-accent hover:text-accent-hover">All orders</Link>}>
          {recent.length === 0 ? (
            <p className="py-6 text-sm text-muted">
              No orders yet. Orders appear here when a customer buys your products in this demo, or you can{' '}
              <Link to="/seller/dashboard/orders" className="font-semibold text-accent underline">create sample orders</Link>.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className={TABLE}>
                <thead>
                  <tr>
                    <th className={TH}>Order</th>
                    <th className={TH}>Customer</th>
                    <th className={TH}>Date</th>
                    <th className={TH}>Items</th>
                    <th className={TH}>Total</th>
                    <th className={TH}>Status</th>
                    <th className={TH}><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((order) => (
                    <tr key={order.id}>
                      <td className={`${TD} font-semibold`}>{order.reference}{order.sample && <span className="ml-1.5 text-xs font-normal text-muted">(sample)</span>}</td>
                      <td className={TD}>{order.customerName}</td>
                      <td className={`${TD} whitespace-nowrap`}>{new Date(order.placedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                      <td className={TD}>{countUnits(order)}</td>
                      <td className={`${TD} font-semibold`}>{formatMoney(order.totalCents)}</td>
                      <td className={TD}><OrderStatusBadge status={order.status} /></td>
                      <td className={TD}>
                        <Link to={`/seller/dashboard/orders?order=${encodeURIComponent(order.id)}`} className={LINK_BUTTON}>View details</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="Top-selling products">
            {best.length === 0 ? (
              <p className="text-sm text-muted">Sales will show here once customers buy your products.</p>
            ) : (
              <ul className="space-y-4">
                {best.map((item) => (
                  <li key={item.productId} className="flex items-center gap-3">
                    <ProductThumb src={item.image} name={item.name} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted">{item.units} sold</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{formatMoney(item.revenueCents)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Store performance">
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted"><Star size={16} aria-hidden="true" />Rating</dt>
                <dd className="font-semibold text-foreground">{store.reviewCount > 0 ? store.rating.toFixed(1) : 'No reviews yet'}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted"><Package size={16} aria-hidden="true" />Products</dt>
                <dd className="font-semibold text-foreground">{products.length}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted"><Eye size={16} aria-hidden="true" />Store views <DemoBadge /></dt>
                <dd className="font-semibold text-foreground">{monthly.views.toLocaleString('en-US')}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted"><Heart size={16} aria-hidden="true" />Wishlist adds <DemoBadge /></dt>
                <dd className="font-semibold text-foreground">{monthly.wishlistAdds.toLocaleString('en-US')}</dd>
              </div>
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  )
}
