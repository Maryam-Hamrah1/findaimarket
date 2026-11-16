import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import type { SortOption } from '../../types/product'

interface ProductToolbarProps {
  rangeStart: number
  rangeEnd: number
  total: number
  sort: SortOption
  sortOptions: ReadonlyArray<{ value: SortOption; label: string }>
  onSortChange: (sort: SortOption) => void
  onOpenFilters: () => void
  activeFilterCount: number
}

export default function ProductToolbar({
  rangeStart,
  rangeEnd,
  total,
  sort,
  sortOptions,
  onSortChange,
  onOpenFilters,
  activeFilterCount,
}: ProductToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-border bg-surface px-4 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent lg:hidden"
        >
          <SlidersHorizontal size={17} />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-on-accent">
              {activeFilterCount}
            </span>
          )}
        </button>

        <p className="text-sm text-muted" aria-live="polite">
          {total === 0 ? (
            '0 results'
          ) : (
            <>
              Showing{' '}
              <span className="font-semibold text-foreground">
                {rangeStart}–{rangeEnd}
              </span>{' '}
              of <span className="font-semibold text-foreground">{total}</span>{' '}
              {total === 1 ? 'product' : 'products'}
            </>
          )}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="explore-sort" className="hidden text-sm text-muted sm:block">
          Sort by
        </label>

        <div className="relative">
          <select
            id="explore-sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className="min-h-11 cursor-pointer appearance-none rounded-full border border-brand-border bg-surface py-2 pl-5 pr-11 text-sm font-semibold text-foreground outline-none transition-colors [color-scheme:dark] hover:border-accent focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  )
}
