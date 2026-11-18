import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ConfirmDialog from '../../components/seller/ConfirmDialog'
import FilterSelect from '../../components/seller/FilterSelect'
import PageHeader from '../../components/seller/PageHeader'
import ProductThumb from '../../components/seller/ProductThumb'
import SearchBox from '../../components/seller/SearchBox'
import { ProductStatusBadge, StockBadge } from '../../components/seller/StatusBadge'
import { LINK_BUTTON, TABLE, TD, TH } from '../../components/seller/table'
import Button from '../../components/ui/Button'
import { CATEGORIES, getCategoryName } from '../../data/categories'
import { useSellerProducts } from '../../hooks/useSellerData'
import { useSellerStore } from '../../hooks/useSellerStore'
import { productRegistry } from '../../services/productRegistry'
import type { SellerProductRecord } from '../../types/seller'
import { formatMoney } from '../../utils/money'
import { toCents } from '../../utils/money'
import { PRODUCT_SORTS, filterSellerProducts, stockStatus, type ProductListFilter, type ProductSort } from '../../utils/sellerProducts'

const DEFAULT_FILTER: ProductListFilter = { query: '', category: 'all', availability: 'all', status: 'all', sort: 'newest' }

export default function ProductsPage() {
  const { store } = useSellerStore()
  const products = useSellerProducts(store.id)
  const [filter, setFilter] = useState<ProductListFilter>(DEFAULT_FILTER)
  const [toDelete, setToDelete] = useState<SellerProductRecord | null>(null)
  const location = useLocation()
  const [message, setMessage] = useState(() => {
    const notice = (location.state as { notice?: unknown } | null)?.notice
    return typeof notice === 'string' ? notice : ''
  })

  useEffect(() => {
    document.title = 'Products · Seller dashboard · Findaimarket'
  }, [])

  const visible = useMemo(() => filterSellerProducts(products, filter), [products, filter])
  const filtered = filter.query !== '' || filter.category !== 'all' || filter.availability !== 'all' || filter.status !== 'all'
  const patch = (change: Partial<ProductListFilter>) => setFilter((previous) => ({ ...previous, ...change }))

  const toggleStatus = (product: SellerProductRecord) => {
    const next = product.status === 'active' ? 'draft' : 'active'
    const result = productRegistry.setStatus(store.id, product.id, next)
    setMessage(
      result.ok
        ? next === 'active'
          ? `${product.name} is now Active and visible in the shop.`
          : `${product.name} is now a Draft and hidden from shoppers.`
        : result.message,
    )
  }

  const confirmDelete = () => {
    if (!toDelete) return
    const result = productRegistry.remove(store.id, toDelete.id)
    setMessage(result.ok ? `${toDelete.name} was deleted.` : result.message)
    setToDelete(null)
  }

  return (
    <div className="fade-in">
      <PageHeader
        title="Products"
        description={`${products.length} ${products.length === 1 ? 'product' : 'products'} in ${store.name}`}
        actions={
          <Link to="/seller/dashboard/products/new" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-on-accent hover:bg-accent-hover">
            <Plus size={18} aria-hidden="true" />
            Add New Product
          </Link>
        }
      />

      <p aria-live="polite" className="mb-4 min-h-5 text-sm font-semibold text-foreground">{message}</p>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-surface px-6 py-14 text-center">
          <h2 className="font-display text-2xl font-medium text-foreground">No products yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            Add your first product. Active products show up in Explore and on your store page.
          </p>
          <Link to="/seller/dashboard/products/new" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-sm font-bold text-on-accent hover:bg-accent-hover">
            Add your first product
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap gap-3">
            <SearchBox id="product-search" label="Search products" placeholder="Search by name, SKU or brand" value={filter.query} onChange={(query) => patch({ query })} />
            <FilterSelect
              id="product-category"
              label="Category"
              value={filter.category}
              onChange={(category) => patch({ category })}
              options={CATEGORIES.map((item) => ({ value: item.id, label: item.id === 'all' ? 'All categories' : item.name }))}
            />
            <FilterSelect
              id="product-availability"
              label="Availability"
              value={filter.availability}
              onChange={(availability) => patch({ availability: availability as ProductListFilter['availability'] })}
              options={[
                { value: 'all', label: 'Any availability' },
                { value: 'in-stock', label: 'In stock' },
                { value: 'low-stock', label: 'Low stock' },
                { value: 'out-of-stock', label: 'Out of stock' },
              ]}
            />
            <FilterSelect
              id="product-status"
              label="Status"
              value={filter.status}
              onChange={(status) => patch({ status: status as ProductListFilter['status'] })}
              options={[
                { value: 'all', label: 'Any status' },
                { value: 'active', label: 'Active' },
                { value: 'draft', label: 'Draft' },
              ]}
            />
            <FilterSelect
              id="product-sort"
              label="Sort by"
              value={filter.sort}
              onChange={(sort) => patch({ sort: sort as ProductSort })}
              options={PRODUCT_SORTS}
            />
          </div>

          {visible.length === 0 ? (
            <div className="rounded-2xl border border-brand-border bg-surface px-6 py-12 text-center">
              <p className="text-sm text-muted">No products match these filters.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setFilter(DEFAULT_FILTER)}>Clear filters</Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-brand-border bg-surface">
              <table className={TABLE}>
                <caption className="sr-only">Products in your store</caption>
                <thead>
                  <tr>
                    <th className={TH}>Image</th>
                    <th className={TH}>Product</th>
                    <th className={TH}>Category</th>
                    <th className={TH}>Price</th>
                    <th className={TH}>Stock</th>
                    <th className={TH}>Status</th>
                    <th className={TH}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((product) => (
                    <tr key={product.id}>
                      <td className={TD}><ProductThumb src={product.images[0] ?? ''} name={product.name} /></td>
                      <td className={`${TD} max-w-[16rem]`}>
                        <Link to={`/seller/dashboard/products/${product.id}/edit`} className="font-semibold text-foreground hover:text-accent">{product.name}</Link>
                        {product.sku && <p className="text-xs text-muted">SKU {product.sku}</p>}
                      </td>
                      <td className={TD}>{getCategoryName(product.category)}</td>
                      <td className={`${TD} whitespace-nowrap`}>
                        <span className="font-semibold">{formatMoney(toCents(product.price))}</span>
                        {product.oldPrice !== undefined && <span className="ml-1.5 text-xs text-muted line-through">{formatMoney(toCents(product.oldPrice))}</span>}
                      </td>
                      <td className={TD}>
                        <p className="font-semibold">{product.stock}</p>
                        <StockBadge status={stockStatus(product.stock)} />
                      </td>
                      <td className={TD}>
                        <button
                          type="button"
                          onClick={() => toggleStatus(product)}
                          aria-label={`${product.name} is ${product.status}. Switch to ${product.status === 'active' ? 'draft' : 'active'}`}
                          className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                          <ProductStatusBadge status={product.status} />
                        </button>
                      </td>
                      <td className={TD}>
                        <div className="flex flex-wrap gap-2">
                          <Link to={`/seller/dashboard/products/${product.id}/edit`} className={LINK_BUTTON} aria-label={`Edit ${product.name}`}>
                            <Pencil size={14} className="mr-1.5" aria-hidden="true" />Edit
                          </Link>
                          {product.status === 'active' && (
                            <Link to={`/product/${product.slug}`} className={LINK_BUTTON} aria-label={`View ${product.name} in the shop`}>
                              <Eye size={14} className="mr-1.5" aria-hidden="true" />View
                            </Link>
                          )}
                          <button type="button" onClick={() => setToDelete(product)} className={`${LINK_BUTTON} hover:!border-danger hover:!text-danger`} aria-label={`Delete ${product.name}`}>
                            <Trash2 size={14} className="mr-1.5" aria-hidden="true" />Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-3 text-xs text-muted">
            Showing {visible.length} of {products.length}{filtered ? ' (filtered)' : ''}. Select a status to switch between Active and Draft. Drafts are hidden from shoppers.
          </p>
        </>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this product?"
        message={`${toDelete?.name ?? 'This product'} will be removed from your store and from the shop. This cannot be undone.`}
        confirmLabel="Delete product"
        cancelLabel="Keep product"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}
