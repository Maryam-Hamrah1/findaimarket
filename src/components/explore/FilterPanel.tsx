import { ChevronDown, Star } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { CATEGORIES } from '../../data/categories'
import type {
  Availability,
  CategoryFilter,
  Condition,
  ProductFilters,
} from '../../types/product'
import Button from '../ui/Button'
import Input from '../ui/Input'

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

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value]
}

/* ---------- Expandable group ---------- */

interface FilterGroupProps {
  id: string
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

function FilterGroup({ id, title, defaultOpen = true, children }: FilterGroupProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-brand-border py-5 first:pt-0 last:border-b-0 last:pb-0">
      <h3>
        <button
          type="button"
          id={`${id}-button`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen(!open)}
          className="flex min-h-8 w-full items-center justify-between text-left text-sm font-semibold text-foreground"
        >
          {title}
          <ChevronDown
            size={18}
            className={`text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>

      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        hidden={!open}
        className="mt-4"
      >
        {children}
      </div>
    </div>
  )
}

/* ---------- Option row (checkbox / radio) ---------- */

interface OptionProps {
  type: 'checkbox' | 'radio'
  name: string
  checked: boolean
  onChange: () => void
  children: ReactNode
  trailing?: ReactNode
}

function Option({ type, name, checked, onChange, children, trailing }: OptionProps) {
  return (
    <label className="flex min-h-9 cursor-pointer items-center gap-3 text-sm text-foreground">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 cursor-pointer accent-accent"
      />
      <span className="flex-1">{children}</span>
      {trailing !== undefined && (
        <span className="text-xs text-muted">{trailing}</span>
      )}
    </label>
  )
}

/* ---------- Price range ---------- */

interface PriceRangeProps {
  idPrefix: string
  minPrice: number | null
  maxPrice: number | null
  onApply: (min: number | null, max: number | null) => void
}

function PriceRange({ idPrefix, minPrice, maxPrice, onApply }: PriceRangeProps) {
  const [min, setMin] = useState(minPrice === null ? '' : String(minPrice))
  const [max, setMax] = useState(maxPrice === null ? '' : String(maxPrice))
  const [previous, setPrevious] = useState({ minPrice, maxPrice })

  // Follow external changes (Clear all, removing a chip)
  if (previous.minPrice !== minPrice || previous.maxPrice !== maxPrice) {
    setPrevious({ minPrice, maxPrice })
    setMin(minPrice === null ? '' : String(minPrice))
    setMax(maxPrice === null ? '' : String(maxPrice))
  }

  const toNumber = (value: string): number | null => {
    if (value.trim() === '') return null
    const parsed = Number(value)
    return Number.isFinite(parsed) ? Math.max(0, parsed) : null
  }

  const apply = () => {
    let low = toNumber(min)
    let high = toNumber(max)

    if (low !== null && high !== null && low > high) {
      ;[low, high] = [high, low]
    }

    onApply(low, high)
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        apply()
      }}
      className="space-y-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <Input
          id={`${idPrefix}-min-price`}
          label="Min ($)"
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="0"
          value={min}
          onChange={(event) => setMin(event.target.value)}
        />
        <Input
          id={`${idPrefix}-max-price`}
          label="Max ($)"
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="Any"
          value={max}
          onChange={(event) => setMax(event.target.value)}
        />
      </div>

      <Button type="submit" variant="outline" size="sm" fullWidth>
        Apply price
      </Button>
    </form>
  )
}

/* ---------- Stars ---------- */

function Stars({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          size={14}
          className={
            index <= count
              ? 'fill-warning text-warning'
              : 'text-brand-border'
          }
        />
      ))}
    </span>
  )
}

/* ---------- Panel ---------- */

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
            <Option
              key={item.id}
              type="radio"
              name={`${idPrefix}-category`}
              checked={category === item.id}
              onChange={() => onCategoryChange(item.id)}
              trailing={categoryCounts[item.id]}
            >
              {item.name}
            </Option>
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
          <Option
            type="radio"
            name={`${idPrefix}-rating`}
            checked={filters.minRating === 0}
            onChange={() => onFiltersChange({ ...filters, minRating: 0 })}
          >
            Any rating
          </Option>

          {RATING_OPTIONS.map((stars) => (
            <Option
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
            </Option>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup id={`${idPrefix}-availability`} title="Availability">
        {AVAILABILITY_OPTIONS.map((option) => (
          <Option
            key={option.value}
            type="checkbox"
            name={`${idPrefix}-availability`}
            checked={filters.availability.includes(option.value)}
            onChange={() =>
              onFiltersChange({
                ...filters,
                availability: toggle(filters.availability, option.value),
              })
            }
          >
            {option.label}
          </Option>
        ))}
      </FilterGroup>

      <FilterGroup id={`${idPrefix}-location`} title="Store Location">
        {visibleLocations.map((location) => (
          <Option
            key={location}
            type="checkbox"
            name={`${idPrefix}-location`}
            checked={filters.locations.includes(location)}
            onChange={() =>
              onFiltersChange({
                ...filters,
                locations: toggle(filters.locations, location),
              })
            }
          >
            {location}
          </Option>
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
          <Option
            key={option.value}
            type="checkbox"
            name={`${idPrefix}-condition`}
            checked={filters.conditions.includes(option.value)}
            onChange={() =>
              onFiltersChange({
                ...filters,
                conditions: toggle(filters.conditions, option.value),
              })
            }
          >
            {option.label}
          </Option>
        ))}
      </FilterGroup>
    </div>
  )
}
