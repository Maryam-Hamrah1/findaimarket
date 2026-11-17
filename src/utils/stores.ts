import type { CategoryFilter } from '../types/product'
import type { Store, StoreFilters, StoreSortOption } from '../types/store'
import { getCategoryName } from '../data/categories'

export const STORES_PAGE_SIZE = 6

/** A store with at least this many followers counts as popular. */
export const POPULAR_FOLLOWERS = 10_000

/** A store that joined within this many days counts as new. */
export const NEW_STORE_DAYS = 180

const DAY_MS = 24 * 60 * 60 * 1000

export const STORE_SORT_OPTIONS: ReadonlyArray<{ value: StoreSortOption; label: string }> = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest Stores' },
  { value: 'products', label: 'Most Products' },
]

export const EMPTY_STORE_FILTERS: StoreFilters = {
  countries: [],
  minRating: 0,
  verifiedOnly: false,
  popularOnly: false,
  newOnly: false,
}

export function isPopularStore(store: Store): boolean {
  return store.followers >= POPULAR_FOLLOWERS
}

export function isNewStore(store: Store, now: number = Date.now()): boolean {
  return now - Date.parse(store.createdAt) <= NEW_STORE_DAYS * DAY_MS
}

export function countActiveStoreFilters(filters: StoreFilters): number {
  return (
    filters.countries.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.popularOnly ? 1 : 0) +
    (filters.newOnly ? 1 : 0)
  )
}

/* ---------------------------------------------------------
   Search: every word must appear in the name, description,
   category or location of the store.
   --------------------------------------------------------- */

function searchableText(store: Store): string {
  return [
    store.name,
    store.description,
    getCategoryName(store.category),
    store.category.replace('-', ' '),
    store.country,
    store.city,
  ]
    .join(' ')
    .toLowerCase()
}

export function searchStores(stores: readonly Store[], query: string): Store[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return [...stores]

  return stores.filter((store) => {
    const text = searchableText(store)
    return words.every((word) => text.includes(word))
  })
}

/* ---------------------------------------------------------
   Filtering and sorting
   --------------------------------------------------------- */

export function filterStores(
  stores: readonly Store[],
  filters: StoreFilters,
  category: CategoryFilter,
  now: number = Date.now(),
): Store[] {
  return stores.filter((store) => {
    if (category !== 'all' && store.category !== category) return false

    if (filters.countries.length > 0 && !filters.countries.includes(store.country)) {
      return false
    }

    if (filters.minRating > 0 && store.rating < filters.minRating) return false
    if (filters.verifiedOnly && !store.verified) return false
    if (filters.popularOnly && !isPopularStore(store)) return false
    if (filters.newOnly && !isNewStore(store, now)) return false

    return true
  })
}

function getRecommendedScore(store: Store): number {
  return (
    store.rating * Math.log10(store.reviewCount + 10) +
    Math.log10(store.followers + 10) * 0.3 +
    (store.verified ? 1.5 : 0)
  )
}

export function sortStores(stores: readonly Store[], sort: StoreSortOption): Store[] {
  const list = [...stores]

  switch (sort) {
    case 'popular':
      return list.sort((a, b) => b.followers - a.followers)
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    case 'newest':
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    case 'products':
      return list.sort((a, b) => b.productCount - a.productCount)
    case 'recommended':
    default:
      return list.sort((a, b) => getRecommendedScore(b) - getRecommendedScore(a))
  }
}

export function countStoresByCategory(
  stores: readonly Store[],
): Record<CategoryFilter, number> {
  const counts: Record<CategoryFilter, number> = {
    all: stores.length,
    fashion: 0,
    electronics: 0,
    accessories: 0,
    'home-living': 0,
    beauty: 0,
    sports: 0,
  }

  for (const store of stores) {
    counts[store.category] += 1
  }

  return counts
}

export function countStoresByCountry(stores: readonly Store[]): Map<string, number> {
  const counts = new Map<string, number>()

  for (const store of stores) {
    counts.set(store.country, (counts.get(store.country) ?? 0) + 1)
  }

  return counts
}

export function getStoreCountries(stores: readonly Store[]): string[] {
  return Array.from(new Set(stores.map((store) => store.country))).sort()
}

/* ---------------------------------------------------------
   Formatting
   --------------------------------------------------------- */

const compactNumber = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** 18400 becomes "18.4K" */
export function formatCompactNumber(value: number): string {
  return compactNumber.format(value)
}

const monthYear = new Intl.DateTimeFormat('en', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const fullDate = new Intl.DateTimeFormat('en', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

/** "2026-02-17" becomes "February 2026" */
export function formatMonthYear(isoDate: string): string {
  return monthYear.format(new Date(isoDate))
}

/** "2026-02-17" becomes "February 17, 2026" */
export function formatFullDate(isoDate: string): string {
  return fullDate.format(new Date(isoDate))
}

/** "Modern Style" becomes "MS", "Kōbō Studio" becomes "KS" */
export function getInitials(name: string): string {
  const letters = name
    .split(/[\s&]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase())

  return letters.slice(0, 2).join('')
}
