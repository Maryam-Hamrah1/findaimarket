import { AlertTriangle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/seller/PageHeader'
import ProductThumb from '../../components/seller/ProductThumb'
import SearchBox from '../../components/seller/SearchBox'
import { StockBadge } from '../../components/seller/StatusBadge'
import { TABLE, TD, TH } from '../../components/seller/table'
import Button from '../../components/ui/Button'
import { useSellerProducts } from '../../hooks/useSellerData'
import { useSellerStore } from '../../hooks/useSellerStore'
import { productRegistry } from '../../services/productRegistry'
import { LOW_STOCK_AT, PRODUCT_LIMITS, parseStock, stockStatus } from '../../utils/sellerProducts'
import type { StockStatus } from '../../types/seller'

type StockFilter = 'all' | StockStatus

const FILTERS: ReadonlyArray<{ value: StockFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'low-stock', label: 'Low stock' },
  { value: 'out-of-stock', label: 'Out of stock' },
  { value: 'in-stock', label: 'In stock' },
]

export default function InventoryPage() {
  const { store } = useSellerStore()
  const products = useSellerProducts(store.id)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<StockFilter>('all')
  const [edits, setEdits] = useState<Record<number, string>>({})
  const [errors, setErrors] = useState<Record<number, string>>({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    document.title = 'Inventory · Seller dashboard · Findaimarket'
  }, [])

  const low = products.filter((product) => stockStatus(product.stock) === 'low-stock').length
  const out = products.filter((product) => stockStatus(product.stock) === 'out-of-stock').length

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return products
      .filter((product) => filter === 'all' || stockStatus(product.stock) === filter)
      .filter((product) => needle === '' || product.name.toLowerCase().includes(needle) || product.sku.toLowerCase().includes(needle))
      .sort((a, b) => a.stock - b.stock || a.name.localeCompare(b.name))
  }, [products, query, filter])

  const save = (id: number, name: string) => {
    const typed = edits[id]
    if (typed === undefined) return

    const stock = parseStock(typed)
    if (typed.trim() === '' || Number.isNaN(stock)) {
      setErrors((previous) => ({ ...previous, [id]: 'Use a whole number, like 12.' }))
      return
    }
    if (stock > PRODUCT_LIMITS.stockMax) {
      setErrors((previous) => ({ ...previous, [id]: 'This quantity is too high.' }))
      return
    }

    const result = productRegistry.setStock(store.id, id, stock)
    if (!result.ok) {
      setErrors((previous) => ({ ...previous, [id]: result.message }))
      return
    }

    setEdits(({ [id]: _removed, ...rest }) => rest)
    setErrors(({ [id]: _removed, ...rest }) => rest)
    setMessage(`Stock for ${name} is now ${stock}.`)
  }

  return (
    <div className="fade-in">
      <PageHeader title="Inventory" description="Check stock levels and update quantities. Changes appear in the shop straight away." />

      {(low > 0 || out > 0) && (
        <p className="mb-5 flex items-start gap-2.5 rounded-xl border border-brand-border bg-surface px-4 py-3 text-sm text-foreground">
          <AlertTriangle size={17} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
          <span>
            {out > 0 && <>{out} {out === 1 ? 'product is' : 'products are'} out of stock. </>}
            {low > 0 && <>{low} {low === 1 ? 'product has' : 'products have'} low stock ({LOW_STOCK_AT} or fewer).</>}
          </span>
        </p>
      )}

      <p aria-live="polite" className="mb-3 min-h-5 text-sm font-semibold text-foreground">{message}</p>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-surface px-6 py-14 text-center">
          <p className="text-sm text-muted">You have no products yet, so there is nothing to track.</p>
          <Link to="/seller/dashboard/products/new" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-sm font-bold text-on-accent hover:bg-accent-hover">Add a product</Link>
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <SearchBox id="inventory-search" label="Search inventory" placeholder="Search by name or SKU" value={query} onChange={setQuery} />
            <div role="group" aria-label="Stock filter" className="flex flex-wrap gap-1.5">
              {FILTERS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={filter === item.value}
                  onClick={() => setFilter(item.value)}
                  className={`min-h-11 rounded-full px-4 text-xs font-semibold transition-colors ${filter === item.value ? 'bg-accent text-on-accent' : 'border border-brand-border text-foreground hover:border-accent hover:text-accent'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="rounded-2xl border border-brand-border bg-surface px-6 py-10 text-center text-sm text-muted">No products match.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-brand-border bg-surface">
              <table className={TABLE}>
                <caption className="sr-only">Stock levels</caption>
                <thead>
                  <tr>
                    <th className={TH}>Product</th>
                    <th className={TH}>SKU</th>
                    <th className={TH}>Available stock</th>
                    <th className={TH}>Status</th>
                    <th className={TH}>Last updated</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((product) => {
                    const typed = edits[product.id]
                    const changed = typed !== undefined && typed !== String(product.stock)
                    const error = errors[product.id]
                    return (
                      <tr key={product.id}>
                        <td className={TD}>
                          <div className="flex items-center gap-3">
                            <ProductThumb src={product.images[0] ?? ''} name={product.name} size="sm" />
                            <div className="min-w-0">
                              <p className="truncate font-semibold">{product.name}</p>
                              {product.status === 'draft' && <p className="text-xs text-muted">Draft</p>}
                            </div>
                          </div>
                        </td>
                        <td className={TD}>{product.sku || '—'}</td>
                        <td className={TD}>
                          <form
                            onSubmit={(event) => {
                              event.preventDefault()
                              save(product.id, product.name)
                            }}
                            className="flex items-center gap-2"
                          >
                            <label htmlFor={`stock-${product.id}`} className="sr-only">Stock for {product.name}</label>
                            <input
                              id={`stock-${product.id}`}
                              inputMode="numeric"
                              value={typed ?? String(product.stock)}
                              onChange={(event) => {
                                setEdits((previous) => ({ ...previous, [product.id]: event.target.value }))
                                setErrors(({ [product.id]: _removed, ...rest }) => rest)
                              }}
                              aria-invalid={Boolean(error)}
                              className={`min-h-10 w-24 rounded-lg border bg-background px-3 text-sm text-foreground outline-none focus:border-accent ${error ? 'border-danger' : 'border-brand-border'}`}
                            />
                            {changed && <Button type="submit" size="sm" variant="secondary">Update</Button>}
                          </form>
                          {error && <p role="alert" className="mt-1 text-xs text-danger">{error}</p>}
                        </td>
                        <td className={TD}><StockBadge status={stockStatus(product.stock)} /></td>
                        <td className={`${TD} whitespace-nowrap text-muted`}>
                          {new Date(product.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
