import { SlidersHorizontal } from 'lucide-react'
import type { ReactNode } from 'react'
import SortSelect from './SortSelect'

interface ResultsToolbarProps<T extends string> {
  rangeStart: number
  rangeEnd: number
  total: number
  sort: T
  sortOptions: ReadonlyArray<{ value: T; label: string }>
  onSortChange: (sort: T) => void
  /** What is being listed, e.g. "product" or "store" */
  noun?: string
  /** Shows the mobile "Filters" button when provided */
  onOpenFilters?: () => void
  activeFilterCount?: number
  /** Extra controls placed before the sort dropdown */
  actions?: ReactNode
  sortId?: string
}

export default function ResultsToolbar<T extends string>({
  rangeStart,
  rangeEnd,
  total,
  sort,
  sortOptions,
  onSortChange,
  noun = 'product',
  onOpenFilters,
  activeFilterCount = 0,
  actions,
  sortId = 'results-sort',
}: ResultsToolbarProps<T>) {
  const plural = `${noun}s`

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {onOpenFilters && (
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
        )}

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
              {total === 1 ? noun : plural}
            </>
          )}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {actions}

        <SortSelect
          id={sortId}
          value={sort}
          options={sortOptions}
          onChange={onSortChange}
        />
      </div>
    </div>
  )
}
