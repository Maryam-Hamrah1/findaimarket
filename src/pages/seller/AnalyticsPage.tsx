import { useEffect, useMemo, useState } from 'react'
import AreaChart from '../../components/seller/AreaChart'
import BarList from '../../components/seller/BarList'
import DemoBadge from '../../components/seller/DemoBadge'
import PageHeader from '../../components/seller/PageHeader'
import Panel from '../../components/seller/Panel'
import { useSellerProducts } from '../../hooks/useSellerData'
import { useSellerStore } from '../../hooks/useSellerStore'
import { getCategoryName } from '../../data/categories'
import { ANALYTICS_RANGES, analyticsBuckets, demoUnits, sumDays, makeDemoSeries } from '../../utils/demoStats'
import { formatMoney } from '../../utils/money'

const dollars = (value: number) => `$${value.toLocaleString('en-US')}`

/** Demonstration charts. Nothing here is measured. */
export default function AnalyticsPage() {
  const { store } = useSellerStore()
  const products = useSellerProducts(store.id)
  const [days, setDays] = useState<7 | 30 | 90>(30)

  useEffect(() => {
    document.title = 'Analytics · Findaimarket'
  }, [])

  const buckets = useMemo(() => analyticsBuckets(store.id, days), [store.id, days])
  const totals = useMemo(() => sumDays(makeDemoSeries(store.id, days)), [store.id, days])
  const labels = buckets.map((bucket) => bucket.label)

  const sold = useMemo(
    () =>
      products
        .filter((product) => product.status === 'active')
        .map((product) => {
          const units = demoUnits(product.id, days)
          return { name: product.name, category: product.category, units, revenue: Math.round(units * product.price) }
        }),
    [products, days],
  )

  const best = [...sold].sort((a, b) => b.units - a.units).slice(0, 6)
  const byCategory = useMemo(() => {
    const totalsByCategory = new Map<string, number>()
    for (const item of sold) {
      const label = getCategoryName(item.category)
      totalsByCategory.set(label, (totalsByCategory.get(label) ?? 0) + item.revenue)
    }
    return [...totalsByCategory.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
  }, [sold])

  return (
    <div className="fade-in space-y-6">
      <PageHeader
        title="Analytics"
        description="Demonstration charts for the design preview."
        actions={
          <div role="group" aria-label="Date range" className="flex flex-wrap gap-1.5">
            {ANALYTICS_RANGES.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={days === item.value}
                onClick={() => setDays(item.value)}
                className={`min-h-10 rounded-full px-4 text-xs font-semibold transition-colors ${
                  days === item.value ? 'bg-accent text-on-accent' : 'border border-brand-border text-foreground hover:border-accent hover:text-accent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        }
      />

      <p className="rounded-xl border border-brand-border bg-surface px-4 py-3 text-xs leading-5 text-muted">
        Every number on this page is generated for the demo. It is not measured and does not come from real
        customers, orders or visits.
      </p>

      <section aria-label="Totals" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ['Sales', formatMoney(totals.salesCents)],
          ['Orders', totals.orders.toLocaleString('en-US')],
          ['Store views', totals.views.toLocaleString('en-US')],
          ['Wishlist additions', totals.wishlistAdds.toLocaleString('en-US')],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-brand-border bg-surface p-5">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-2 font-display text-3xl font-medium text-foreground">{value}</p>
            <div className="mt-2"><DemoBadge /></div>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Sales over time" badge={<DemoBadge />}>
          <AreaChart labels={labels} values={buckets.map((bucket) => Math.round(bucket.salesCents / 100))} format={dollars} label="Demo sales over time" />
        </Panel>
        <Panel title="Orders over time" badge={<DemoBadge />}>
          <AreaChart labels={labels} values={buckets.map((bucket) => bucket.orders)} format={(value) => String(value)} label="Demo orders over time" />
        </Panel>
        <Panel title="Store traffic" badge={<DemoBadge />}>
          <AreaChart labels={labels} values={buckets.map((bucket) => bucket.views)} format={(value) => value.toLocaleString('en-US')} label="Demo store views over time" />
        </Panel>

        <div className="space-y-6">
          <Panel title="Best-selling products" badge={<DemoBadge />}>
            {best.length === 0 ? (
              <p className="text-sm text-muted">Add an active product to see demo figures here.</p>
            ) : (
              <BarList items={best.map((item) => ({ label: item.name, value: item.units }))} format={(value) => `${value} units`} />
            )}
          </Panel>
          <Panel title="Revenue by category" badge={<DemoBadge />}>
            {byCategory.length === 0 ? (
              <p className="text-sm text-muted">Add an active product to see demo figures here.</p>
            ) : (
              <BarList items={byCategory} format={dollars} />
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}
