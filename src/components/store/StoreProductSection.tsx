import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import type { SortOption } from '../../types/product'
import type { StoreProduct, StoreSection } from '../../types/store'
import { SORT_OPTIONS, sortProducts } from '../../utils/products'
import EmptyState from '../explore/EmptyState'
import Pagination from '../explore/Pagination'
import ProductGrid from '../explore/ProductGrid'
import FilterChips, { type FilterChip } from '../ui/FilterChips'
import PriceRange from '../ui/PriceRange'
import ResultsToolbar from '../ui/ResultsToolbar'
import StoreCategories from './StoreCategories'

export const STORE_PRODUCTS_PAGE_SIZE = 8

const NO_SCORES = new Map<number, number>()

interface StoreProductSectionProps {
  products: StoreProduct[]
  sections: StoreSection[]
  initialSection: string | null
}

function describePrice(min: number | null, max: number | null): string {
  if (min !== null && max !== null) return `$${min} – $${max}`
  if (min !== null) return `Over $${min}`
  return `Under $${max ?? 0}`
}

export default function StoreProductSection({
  products,
  sections,
  initialSection,
}: StoreProductSectionProps) {
  const [query, setQuery] = useState('')
  const [section, setSection] = useState<string | null>(initialSection)
  const [minPrice, setMinPrice] = useState<number | null>(null)
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [sort, setSort] = useState<SortOption>('recommended')
  const [page, setPage] = useState(1)
  const [priceOpen, setPriceOpen] = useState(false)

  const topRef = useRef<HTMLDivElement>(null)

  const hasPrice = minPrice !== null || maxPrice !== null

  const filtered = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)

    return products.filter((product) => {
      if (section !== null && product.section !== section) return false
      if (minPrice !== null && product.price < minPrice) return false
      if (maxPrice !== null && product.price > maxPrice) return false

      if (words.length > 0) {
        const text = `${product.name} ${product.section} ${product.tags.join(' ')}`.toLowerCase()
        return words.every((word) => text.includes(word))
      }

      return true
    })
  }, [products, query, section, minPrice, maxPrice])

  const sorted = useMemo(() => sortProducts(filtered, sort, NO_SCORES), [filtered, sort])

  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / STORE_PRODUCTS_PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * STORE_PRODUCTS_PAGE_SIZE
  const pageProducts = sorted.slice(pageStart, pageStart + STORE_PRODUCTS_PAGE_SIZE)

  const activeCount = (query ? 1 : 0) + (section !== null ? 1 : 0) + (hasPrice ? 1 : 0)

  const clearAll = () => {
    setQuery('')
    setSection(null)
    setMinPrice(null)
    setMaxPrice(null)
    setPage(1)
  }

  const chips: FilterChip[] = []
  if (query) {
    chips.push({ key: 'q', label: `“${query}”`, onRemove: () => setQuery('') })
  }
  if (section !== null) {
    chips.push({ key: 'section', label: section, onRemove: () => setSection(null) })
  }
  if (hasPrice) {
    chips.push({
      key: 'price',
      label: describePrice(minPrice, maxPrice),
      onRemove: () => {
        setMinPrice(null)
        setMaxPrice(null)
      },
    })
  }

  const handlePageChange = (next: number) => {
    setPage(Math.min(Math.max(1, next), totalPages))
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={topRef} className="scroll-mt-36">
      {sections.length > 1 && (
        <StoreCategories
          sections={sections}
          variant="pills"
          active={section}
          totalCount={products.length}
          onSelect={(next) => {
            setSection(next)
            setPage(1)
          }}
        />
      )}

      <div className="relative mt-5 max-w-xl">
        <label htmlFor="store-search" className="sr-only">
          Search in this store
        </label>
        <Search
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          id="store-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setPage(1)
          }}
          placeholder="Search in this store"
          className="min-h-12 w-full rounded-full border border-brand-border bg-surface pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div className="mt-5">
        <ResultsToolbar
          rangeStart={total === 0 ? 0 : pageStart + 1}
          rangeEnd={pageStart + pageProducts.length}
          total={total}
          sort={sort}
          sortOptions={SORT_OPTIONS}
          onSortChange={(next) => {
            setSort(next)
            setPage(1)
          }}
          sortId="store-sort"
          actions={
            <button
              type="button"
              aria-expanded={priceOpen}
              aria-controls="store-price-panel"
              onClick={() => setPriceOpen(!priceOpen)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${
                hasPrice || priceOpen
                  ? 'border-accent text-accent'
                  : 'border-brand-border bg-surface text-foreground hover:border-accent hover:text-accent'
              }`}
            >
              <SlidersHorizontal size={17} aria-hidden="true" />
              Price
            </button>
          }
        />

        {priceOpen && (
          <div
            id="store-price-panel"
            className="mt-4 max-w-sm rounded-2xl border border-brand-border bg-surface p-5"
          >
            <PriceRange
              idPrefix="store"
              minPrice={minPrice}
              maxPrice={maxPrice}
              onApply={(min, max) => {
                setMinPrice(min)
                setMaxPrice(max)
                setPage(1)
              }}
            />
          </div>
        )}

        <FilterChips chips={chips} onClear={clearAll} />
      </div>

      {total === 0 ? (
        <EmptyState
          subject="product"
          query={query}
          hasFilters={activeCount > (query ? 1 : 0)}
          onClearFilters={clearAll}
          onClearSearch={() => setQuery('')}
        />
      ) : (
        <>
          <ProductGrid products={pageProducts} showStore={false} />
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}
