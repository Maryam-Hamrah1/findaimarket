import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CategoryNavigation from '../components/explore/CategoryNavigation'
import EmptyState from '../components/explore/EmptyState'
import FilterSidebar from '../components/explore/FilterSidebar'
import MobileFilterDrawer from '../components/explore/MobileFilterDrawer'
import Pagination from '../components/explore/Pagination'
import StoreFilterPanel from '../components/stores/StoreFilterPanel'
import StoreGrid from '../components/stores/StoreGrid'
import StoresHeader from '../components/stores/StoresHeader'
import FilterChips, { type FilterChip } from '../components/ui/FilterChips'
import ResultsToolbar from '../components/ui/ResultsToolbar'
import { getCategoryName, isCategoryId } from '../data/categories'
import { SAMPLE_DATA_NOTICE, STORES, STORE_CATEGORY_ITEMS } from '../data/stores'
import type { CategoryFilter } from '../types/product'
import type { StoreFilters, StoreSortOption } from '../types/store'
import { toggleItem } from '../utils/collections'
import {
  EMPTY_STORE_FILTERS,
  STORES_PAGE_SIZE,
  STORE_SORT_OPTIONS,
  countActiveStoreFilters,
  countStoresByCategory,
  countStoresByCountry,
  filterStores,
  getStoreCountries,
  searchStores,
  sortStores,
} from '../utils/stores'

const ALL_COUNTRIES = getStoreCountries(STORES)

export default function StoresPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = (searchParams.get('q') ?? '').trim()
  const categoryParam = searchParams.get('category')
  const category: CategoryFilter = isCategoryId(categoryParam) ? categoryParam : 'all'

  const [filters, setFilters] = useState<StoreFilters>(EMPTY_STORE_FILTERS)
  const [sort, setSort] = useState<StoreSortOption>('recommended')
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Discover Stores · Findaimarket'
  }, [])

  /* ---------- Data pipeline ---------- */

  const searched = useMemo(() => searchStores(STORES, query), [query])

  // Counts respect the other filters, so the numbers stay honest
  const categoryCounts = useMemo(
    () => countStoresByCategory(filterStores(searched, filters, 'all')),
    [searched, filters],
  )

  const countryCounts = useMemo(
    () =>
      countStoresByCountry(
        filterStores(searched, { ...filters, countries: [] }, category),
      ),
    [searched, filters, category],
  )

  const filtered = useMemo(
    () => filterStores(searched, filters, category),
    [searched, filters, category],
  )

  const sorted = useMemo(() => sortStores(filtered, sort), [filtered, sort])

  const total = sorted.length
  const totalPages = Math.max(1, Math.ceil(total / STORES_PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * STORES_PAGE_SIZE
  const pageStores = sorted.slice(pageStart, pageStart + STORES_PAGE_SIZE)

  const activeCount = countActiveStoreFilters(filters) + (category !== 'all' ? 1 : 0)

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
    setPage(1)
    updateParams({ q: value })
  }

  const handleClearSearch = () => {
    setPage(1)
    updateParams({ q: '' })
  }

  const handleCategoryChange = (next: CategoryFilter) => {
    setPage(1)
    updateParams({ category: next })
  }

  const handleFiltersChange = (next: StoreFilters) => {
    setFilters(next)
    setPage(1)
  }

  const handleSortChange = (next: StoreSortOption) => {
    setSort(next)
    setPage(1)
  }

  const handleClearFilters = () => {
    setFilters(EMPTY_STORE_FILTERS)
    setPage(1)
    updateParams({ category: 'all' })
  }

  const handlePageChange = (next: number) => {
    setPage(Math.min(Math.max(1, next), totalPages))
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  /* ---------- Chips ---------- */

  const chips: FilterChip[] = []

  if (category !== 'all') {
    chips.push({
      key: 'category',
      label: getCategoryName(category),
      onRemove: () => handleCategoryChange('all'),
    })
  }
  for (const country of filters.countries) {
    chips.push({
      key: `country-${country}`,
      label: country,
      onRemove: () =>
        handleFiltersChange({ ...filters, countries: toggleItem(filters.countries, country) }),
    })
  }
  if (filters.minRating > 0) {
    chips.push({
      key: 'rating',
      label: `${filters.minRating} & up`,
      onRemove: () => handleFiltersChange({ ...filters, minRating: 0 }),
    })
  }
  if (filters.verifiedOnly) {
    chips.push({
      key: 'verified',
      label: 'Verified',
      onRemove: () => handleFiltersChange({ ...filters, verifiedOnly: false }),
    })
  }
  if (filters.popularOnly) {
    chips.push({
      key: 'popular',
      label: 'Popular',
      onRemove: () => handleFiltersChange({ ...filters, popularOnly: false }),
    })
  }
  if (filters.newOnly) {
    chips.push({
      key: 'new',
      label: 'New',
      onRemove: () => handleFiltersChange({ ...filters, newOnly: false }),
    })
  }

  /* ---------- Render ---------- */

  const filterPanel = (idPrefix: string) => (
    <StoreFilterPanel
      idPrefix={idPrefix}
      filters={filters}
      category={category}
      categoryCounts={categoryCounts}
      countries={ALL_COUNTRIES}
      countryCounts={countryCounts}
      onFiltersChange={handleFiltersChange}
      onCategoryChange={handleCategoryChange}
    />
  )

  return (
    <main>
      <StoresHeader
        query={query}
        total={total}
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />

      <div className="mx-auto max-w-7xl px-5 py-8 lg:py-10">
        <CategoryNavigation
          active={category}
          counts={categoryCounts}
          onSelect={handleCategoryChange}
          items={STORE_CATEGORY_ITEMS}
          label="Store categories"
        />

        <div className="mt-8 flex items-start gap-8">
          <FilterSidebar
            label="Store filters"
            activeCount={activeCount}
            onClearAll={handleClearFilters}
          >
            {filterPanel('sidebar')}
          </FilterSidebar>

          <div ref={resultsRef} className="min-w-0 flex-1 scroll-mt-28">
            <ResultsToolbar
              rangeStart={total === 0 ? 0 : pageStart + 1}
              rangeEnd={pageStart + pageStores.length}
              total={total}
              sort={sort}
              sortOptions={STORE_SORT_OPTIONS}
              onSortChange={handleSortChange}
              onOpenFilters={() => setDrawerOpen(true)}
              activeFilterCount={activeCount}
              noun="store"
              sortId="stores-sort"
            />

            <FilterChips chips={chips} onClear={handleClearFilters} />

            {total === 0 ? (
              <EmptyState
                subject="store"
                query={query}
                hasFilters={activeCount > 0}
                onClearFilters={handleClearFilters}
                onClearSearch={handleClearSearch}
              />
            ) : (
              <>
                <StoreGrid stores={pageStores} />
                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}

            <p className="mt-10 text-center text-xs text-muted">{SAMPLE_DATA_NOTICE}</p>
          </div>
        </div>
      </div>

      <MobileFilterDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        resultCount={total}
        noun="store"
        activeCount={activeCount}
        onClearAll={handleClearFilters}
      >
        {filterPanel('drawer')}
      </MobileFilterDrawer>
    </main>
  )
}
