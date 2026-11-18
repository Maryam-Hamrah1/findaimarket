import { useState } from 'react'
import { CATEGORIES } from '../../data/categories'
import type {
  Availability,
  CategoryFilter,
  Condition,
  ProductFilters,
} from '../../types/product'
import { toggleItem } from '../../utils/collections'
import { FilterGroup, FilterOption, Stars } from '../ui/FilterControls'
import PriceRange from '../ui/PriceRange'

interface FilterPanelProps {
  /** Makes element ids unique when the panel is mounted twice (sidebar + drawer) */
  idPrefix: string
  filters: ProductFilters
  category: CategoryFilter
  categoryCounts: Record<CategoryFilter, number>
  locations: string[]
  onFiltersChange: (next: ProductFilters) => void
  onCategoryChange: (category: CategoryFilter) => void
}

const RATING_OPTIONS = [4, 3, 2] as const

const AVAILABILITY_OPTIONS: ReadonlyArray<{ value: Availability; label: string }> = [
  { value: 'in-stock', label: 'In Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' },
]

const CONDITION_OPTIONS: ReadonlyArray<{ value: Condition; label: string }> = [
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
]

const LOCATIONS_COLLAPSED = 5

export default function FilterPanel({
  idPrefix,
  filters,
  category,
  categoryCounts,
  locations,
  onFiltersChange,
  onCategoryChange,
}: FilterPanelProps) {
  const [showAllLocations, setShowAllLocations] = useState(false)

  const visibleLocations = showAllLocations
    ? locations
    : locations.slice(0, LOCATIONS_COLLAPSED)

  return (
    <div>
      <FilterGroup id={`${idPrefix}-categories`} title="Categories">
        <div role="radiogroup" aria-label="Category">
          {CATEGORIES.map((item) => (
            <FilterOption
              key={item.id}
              type="radio"
              name={`${idPrefix}-category`}
              checked={category === item.id}
              onChange={() => onCategoryChange(item.id)}
              trailing={categoryCounts[item.id]}
            >
              {item.name}
            </FilterOption>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup id={`${idPrefix}-price`} title="Price Range">
        <PriceRange
          idPrefix={idPrefix}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onApply={(minPrice, maxPrice) =>
            onFiltersChange({ ...filters, minPrice, maxPrice })
          }
        />
      </FilterGroup>

      <FilterGroup id={`${idPrefix}-rating`} title="Product Rating">
        <div role="radiogroup" aria-label="Minimum rating">
          <FilterOption
            type="radio"
            name={`${idPrefix}-rating`}
            checked={filters.minRating === 0}
            onChange={() => onFiltersChange({ ...filters, minRating: 0 })}
          >
            Any rating
          </FilterOption>

          {RATING_OPTIONS.map((stars) => (
            <FilterOption
              key={stars}
              type="radio"
              name={`${idPrefix}-rating`}
              checked={filters.minRating === stars}
              onChange={() => onFiltersChange({ ...filters, minRating: stars })}
            >
              <span className="flex items-center gap-2">
                <Stars count={stars} />
                <span>{stars} stars &amp; up</span>
              </span>
            </FilterOption>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup id={`${idPrefix}-availability`} title="Availability">
        {AVAILABILITY_OPTIONS.map((option) => (
          <FilterOption
            key={option.value}
            type="checkbox"
            name={`${idPrefix}-availability`}
            checked={filters.availability.includes(option.value)}
            onChange={() =>
              onFiltersChange({
                ...filters,
                availability: toggleItem(filters.availability, option.value),
              })
            }
          >
            {option.label}
          </FilterOption>
        ))}
      </FilterGroup>

      <FilterGroup id={`${idPrefix}-location`} title="Store Location">
        {visibleLocations.map((location) => (
          <FilterOption
            key={location}
            type="checkbox"
            name={`${idPrefix}-location`}
            checked={filters.locations.includes(location)}
            onChange={() =>
              onFiltersChange({
                ...filters,
                locations: toggleItem(filters.locations, location),
              })
            }
          >
            {location}
          </FilterOption>
        ))}

        {locations.length > LOCATIONS_COLLAPSED && (
          <button
            type="button"
            onClick={() => setShowAllLocations(!showAllLocations)}
            className="mt-2 text-sm font-semibold text-accent hover:text-accent-hover"
          >
            {showAllLocations
              ? 'Show fewer'
              : `Show ${locations.length - LOCATIONS_COLLAPSED} more`}
          </button>
        )}
      </FilterGroup>

      <FilterGroup id={`${idPrefix}-condition`} title="Product Condition">
        {CONDITION_OPTIONS.map((option) => (
          <FilterOption
            key={option.value}
            type="checkbox"
            name={`${idPrefix}-condition`}
            checked={filters.conditions.includes(option.value)}
            onChange={() =>
              onFiltersChange({
                ...filters,
                conditions: toggleItem(filters.conditions, option.value),
              })
            }
          >
            {option.label}
          </FilterOption>
        ))}
      </FilterGroup>
    </div>
  )
}
