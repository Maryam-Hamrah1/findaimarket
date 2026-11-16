import { X } from 'lucide-react'
import { getCategoryName } from '../../data/categories'
import type { CategoryFilter, ProductFilters } from '../../types/product'

interface ActiveFiltersProps {
  filters: ProductFilters
  category: CategoryFilter
  onFiltersChange: (next: ProductFilters) => void
  onCategoryChange: (category: CategoryFilter) => void
  onClear: () => void
}

interface Chip {
  key: string
  label: string
  onRemove: () => void
}

const LABELS = {
  'in-stock': 'In Stock',
  'out-of-stock': 'Out of Stock',
  new: 'New',
  used: 'Used',
} as const

function describePrice(min: number | null, max: number | null): string {
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
  const chips: Chip[] = []

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
          availability: filters.availability.filter((item) => item !== value),
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
          conditions: filters.conditions.filter((item) => item !== value),
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
          locations: filters.locations.filter((item) => item !== location),
        }),
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          aria-label={`Remove filter: ${chip.label}`}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-brand-border bg-surface pl-3.5 pr-2.5 text-xs font-semibold text-foreground transition-colors hover:border-accent"
        >
          {chip.label}
          <X size={14} className="text-muted" />
        </button>
      ))}

      <button
        type="button"
        onClick={onClear}
        className="ml-1 min-h-9 text-xs font-semibold text-accent hover:text-accent-hover"
      >
        Clear all
      </button>
    </div>
  )
}
