import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ActiveFilters from '../components/explore/ActiveFilters'
import CategoryNavigation from '../components/explore/CategoryNavigation'
import EmptyState from '../components/explore/EmptyState'
import ExploreHeader from '../components/explore/ExploreHeader'
import FilterPanel from '../components/explore/FilterPanel'
import FilterSidebar from '../components/explore/FilterSidebar'
import MobileFilterDrawer from '../components/explore/MobileFilterDrawer'
import Pagination from '../components/explore/Pagination'
import ProductGrid from '../components/explore/ProductGrid'
import ProductToolbar from '../components/explore/ProductToolbar'
import { isCategoryId } from '../data/categories'
import { PRODUCTS } from '../data/products'
import type {
  CategoryFilter,
  ProductFilters,
  SortOption,
} from '../types/product'
import {
  EMPTY_FILTERS,
  PAGE_SIZE,
  SORT_OPTIONS,
  countActiveFilters,
  countByCategory,
  filterProducts,
  getLocations,
  matchProducts,
  parseQuery,
  sortProducts,
} from '../utils/products'

const ALL_LOCATIONS = getLocations(PRODUCTS)

const SEARCH_SUGGESTIONS = [
  'A warm gift for my mother',
  'Running shoes under $100',
  'A desk lamp with warm light',
]

const TOP_MATCH_COUNT = 3

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = (searchParams.get('q') ?? '').trim()
  const categoryParam = searchParams.get('category')
  const category: CategoryFilter = isCategoryId(categoryParam) ? categoryParam : 'all'
  const hasQuery = query !== ''

  const [filters, setFilters] = useState<ProductFilters>(EMPTY_FILTERS)
  const [sortChoice, setSortChoice] = useState<SortOption | null>(null)
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = hasQuery
      ? `${query} · Explore Products · Findaimarket`
      : 'Explore Products · Findaimarket'
  }, [hasQuery, query])

  /* ---------- Data pipeline ---------- */

  const parsed = useMemo(() => parseQuery(query), [query])

  // 1. Understand the request (no request = everything)
  const matches = useMemo(
    () =>
      hasQuery
        ? matchProducts(PRODUCTS, parsed)
        : PRODUCTS.map((product) => ({ product, score: 0 })),
    [hasQuery, parsed],
  )

  const matchedProducts = useMemo(
    () => matches.map((item) => item.product),
    [matches],
  )

  const scores = useMemo(
    () => new Map(matches.map((item) => [item.product.id, item.score])),
    [matches],
  )

  // 2. Category counts respect the other filters, so the numbers are honest
  const categoryCounts = useMemo(
    () => countByCategory(filterProducts(matchedProducts, filters, 'all')),
    [matchedProducts, filters],
  )

  // 3. Apply category + filters
  const filtered = useMemo(
    () => filterProducts(matchedProducts, filters, category),
    [matchedProducts, filters, category],
  )

  // 4. Sort: best match when searching, otherwise what people engage with most
  const requestedSort: SortOption = sortChoice ?? (hasQuery ? 'best-match' : 'popular')
  const sort: SortOption = requestedSort === 'best-match' && !hasQuery ? 'popular' : requestedSort

  const sorted = useMemo(
    () => sortProducts(filtered, sort, scores),
    [filtered, sort, scores],
  )

  // 5. Paginate
  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pageProducts = sorted.slice(pageStart, pageStart + PAGE_SIZE)

  const topMatchIds = useMemo(() => {
    if (!hasQuery || sort !== 'best-match' || parsed.keywords.length === 0) {
      return new Set<number>()
    }
    return new Set(sorted.slice(0, TOP_MATCH_COUNT).map((product) => product.id))
  }, [hasQuery, sort, parsed.keywords.length, sorted])

  const sortOptions = useMemo(
    () =>
      hasQuery
        ? [{ value: 'best-match' as const, label: 'Best match' }, ...SORT_OPTIONS]
        : SORT_OPTIONS,
    [hasQuery],
  )

  const activeCount = countActiveFilters(filters) + (category !== 'all' ? 1 : 0)

  /* ---------- Handlers ---------- */

  const updateParams = useCallback(
    (changes: { q?: string; category?: CategoryFilter }) => {
      const next = new URLSearchParams(searchParams)

      if (changes.q !== undefined) {
        if (changes.q) next.set('q', changes.q)
        else next.delete('q')
      }

      if (changes.category !== undefined) {
        if (changes.category !== 'all') next.set('category', changes.category)
        else next.delete('category')
      }

      setSearchParams(next)
    },
    [searchParams, setSearchParams],
  )

  const handleSearch = (value: string) => {
    setSortChoice(null)
    setPage(1)
    updateParams({ q: value })
  }

  const handleClearSearch = () => {
    setSortChoice(null)
    setPage(1)
    updateParams({ q: '' })
  }

  const handleCategoryChange = (next: CategoryFilter) => {
    setPage(1)
    updateParams({ category: next })
  }

  const handleFiltersChange = (next: ProductFilters) => {
    setFilters(next)
    setPage(1)
  }

  const handleSortChange = (next: SortOption) => {
    setSortChoice(next)
    setPage(1)
  }

  // Clears filters + category, keeps the search
  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS)
    setPage(1)
    updateParams({ category: 'all' })
  }

  const handlePageChange = (next: number) => {
    setPage(Math.min(Math.max(1, next), totalPages))
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  /* ---------- Render ---------- */

  const filterPanel = (idPrefix: string) => (
    <FilterPanel
      idPrefix={idPrefix}
      filters={filters}
      category={category}
      categoryCounts={categoryCounts}
      locations={ALL_LOCATIONS}
      onFiltersChange={handleFiltersChange}
      onCategoryChange={handleCategoryChange}
    />
  )

  return (
    <main>
      <ExploreHeader
        query={query}
        parsed={parsed}
        total={total}
        suggestions={SEARCH_SUGGESTIONS}
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />

      <div className="mx-auto max-w-7xl px-5 py-8 lg:py-10">
        <CategoryNavigation
          active={category}
          counts={categoryCounts}
          onSelect={handleCategoryChange}
        />

        <div className="mt-8 flex items-start gap-8">
          <FilterSidebar activeCount={activeCount} onClearAll={handleClearFilters}>
            {filterPanel('sidebar')}
          </FilterSidebar>

          <div ref={resultsRef} className="min-w-0 flex-1 scroll-mt-28">
            <ProductToolbar
              rangeStart={total === 0 ? 0 : pageStart + 1}
              rangeEnd={pageStart + pageProducts.length}
              total={total}
              sort={sort}
              sortOptions={sortOptions}
              onSortChange={handleSortChange}
              onOpenFilters={() => setDrawerOpen(true)}
              activeFilterCount={activeCount}
            />

            <ActiveFilters
              filters={filters}
              category={category}
              onFiltersChange={handleFiltersChange}
              onCategoryChange={handleCategoryChange}
              onClear={handleClearFilters}
            />

            {total === 0 ? (
              <EmptyState
                query={query}
                hasFilters={activeCount > 0}
                onClearFilters={handleClearFilters}
                onClearSearch={handleClearSearch}
              />
            ) : (
              <>
                <ProductGrid products={pageProducts} topMatchIds={topMatchIds} />
                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <MobileFilterDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        resultCount={total}
        activeCount={activeCount}
        onClearAll={handleClearFilters}
      >
        {filterPanel('drawer')}
      </MobileFilterDrawer>
    </main>
  )
}
