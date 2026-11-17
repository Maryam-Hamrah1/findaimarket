import { STORE_CATEGORY_ITEMS } from '../../data/stores'
import type { CategoryFilter } from '../../types/product'
import type { StoreFilters } from '../../types/store'
import { toggleItem } from '../../utils/collections'
import { FilterGroup, FilterOption, Stars } from '../ui/FilterControls'

interface StoreFilterPanelProps {
  /** Makes element ids unique when the panel is mounted twice (sidebar + drawer) */
  idPrefix: string
  filters: StoreFilters
  category: CategoryFilter
  categoryCounts: Record<CategoryFilter, number>
  countries: string[]
  countryCounts: ReadonlyMap<string, number>
  onFiltersChange: (next: StoreFilters) => void
  onCategoryChange: (category: CategoryFilter) => void
}

const RATING_OPTIONS = [4.5, 4, 3] as const

export default function StoreFilterPanel({
  idPrefix,
  filters,
  category,
  categoryCounts,
  countries,
  countryCounts,
  onFiltersChange,
  onCategoryChange,
}: StoreFilterPanelProps) {
  return (
    <div>
      <FilterGroup id={`${idPrefix}-category`} title="Store Category">
        <div role="radiogroup" aria-label="Store category">
          {STORE_CATEGORY_ITEMS.map((item) => (
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

      <FilterGroup id={`${idPrefix}-country`} title="Country">
        {countries.map((country) => (
          <FilterOption
            key={country}
            type="checkbox"
            name={`${idPrefix}-country`}
            checked={filters.countries.includes(country)}
            onChange={() =>
              onFiltersChange({
                ...filters,
                countries: toggleItem(filters.countries, country),
              })
            }
            trailing={countryCounts.get(country) ?? 0}
          >
            {country}
          </FilterOption>
        ))}
      </FilterGroup>

      <FilterGroup id={`${idPrefix}-rating`} title="Average Rating">
        <div role="radiogroup" aria-label="Minimum average rating">
          <FilterOption
            type="radio"
            name={`${idPrefix}-rating`}
            checked={filters.minRating === 0}
            onChange={() => onFiltersChange({ ...filters, minRating: 0 })}
          >
            Any rating
          </FilterOption>

          {RATING_OPTIONS.map((value) => (
            <FilterOption
              key={value}
              type="radio"
              name={`${idPrefix}-rating`}
              checked={filters.minRating === value}
              onChange={() => onFiltersChange({ ...filters, minRating: value })}
            >
              <span className="flex items-center gap-2">
                <Stars count={Math.floor(value)} />
                <span>{value} &amp; up</span>
              </span>
            </FilterOption>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup id={`${idPrefix}-status`} title="Store Status">
        <FilterOption
          type="checkbox"
          name={`${idPrefix}-verified`}
          checked={filters.verifiedOnly}
          onChange={() => onFiltersChange({ ...filters, verifiedOnly: !filters.verifiedOnly })}
        >
          Verified stores
        </FilterOption>
        <FilterOption
          type="checkbox"
          name={`${idPrefix}-popular`}
          checked={filters.popularOnly}
          onChange={() => onFiltersChange({ ...filters, popularOnly: !filters.popularOnly })}
        >
          Popular stores
        </FilterOption>
        <FilterOption
          type="checkbox"
          name={`${idPrefix}-new`}
          checked={filters.newOnly}
          onChange={() => onFiltersChange({ ...filters, newOnly: !filters.newOnly })}
        >
          New stores
        </FilterOption>
      </FilterGroup>
    </div>
  )
}
