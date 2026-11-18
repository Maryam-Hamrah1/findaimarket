import { getCategoryName } from '../../data/categories'
import type { CategoryFilter, ProductFilters } from '../../types/product'
import { toggleItem } from '../../utils/collections'
import FilterChips, { type FilterChip } from '../ui/FilterChips'

interface ActiveFiltersProps {
  filters: ProductFilters
  category: CategoryFilter
  onFiltersChange: (next: ProductFilters) => void
  onCategoryChange: (category: CategoryFilter) => void
  onClear: () => void
}

const LABELS = {
  'in-stock': 'In Stock',
  'out-of-stock': 'Out of Stock',
  new: 'New',
  used: 'Used',
} as const

export function describePrice(min: number | null, max: number | null): string {
  if (min !== null && max !== null) return `$${min} – $${max}`
  if (min !== null) return `Over $${min}`
  return `Under $${max ?? 0}`
}

/** Removable chips that summarise the filters currently applied. */
export default function ActiveFilters({
  filters,
  category,
  onFiltersChange,
  onCategoryChange,
  onClear,
}: ActiveFiltersProps) {
  const chips: FilterChip[] = []

  if (category !== 'all') {
    chips.push({
      key: 'category',
      label: getCategoryName(category),
      onRemove: () => onCategoryChange('all'),
    })
  }

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    chips.push({
      key: 'price',
      label: describePrice(filters.minPrice, filters.maxPrice),
      onRemove: () => onFiltersChange({ ...filters, minPrice: null, maxPrice: null }),
    })
  }

  if (filters.minRating > 0) {
    chips.push({
      key: 'rating',
      label: `${filters.minRating} stars & up`,
      onRemove: () => onFiltersChange({ ...filters, minRating: 0 }),
    })
  }

  for (const value of filters.availability) {
    chips.push({
      key: `availability-${value}`,
      label: LABELS[value],
      onRemove: () =>
        onFiltersChange({
          ...filters,
          availability: toggleItem(filters.availability, value),
        }),
    })
  }

  for (const value of filters.conditions) {
    chips.push({
      key: `condition-${value}`,
      label: LABELS[value],
      onRemove: () =>
        onFiltersChange({
          ...filters,
          conditions: toggleItem(filters.conditions, value),
        }),
    })
  }

  for (const location of filters.locations) {
    chips.push({
      key: `location-${location}`,
      label: location,
      onRemove: () =>
        onFiltersChange({
          ...filters,
          locations: toggleItem(filters.locations, location),
        }),
    })
  }

  return <FilterChips chips={chips} onClear={onClear} />
}
