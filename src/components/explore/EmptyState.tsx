import { SearchX } from 'lucide-react'
import Button from '../ui/Button'

interface EmptyStateProps {
  query: string
  hasFilters: boolean
  onClearFilters: () => void
  onClearSearch: () => void
  /** What is being listed, e.g. "product" or "store" */
  subject?: string
}

export default function EmptyState({
  query,
  hasFilters,
  onClearFilters,
  onClearSearch,
  subject = 'product',
}: EmptyStateProps) {
  return (
    <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-brand-border bg-surface px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-accent">
        <SearchX size={30} strokeWidth={1.6} />
      </div>

      <h2 className="mt-6 font-display text-3xl font-semibold text-foreground">
        No {subject}s found
      </h2>

      <p className="mt-3 max-w-md text-sm leading-6 text-muted sm:text-base">
        {query
          ? `Nothing matches "${query}" with the current filters. Try different words or fewer filters.`
          : `No ${subject} matches the selected filters. Try removing some of them.`}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {hasFilters && (
          <Button variant="secondary" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}

        {query && (
          <Button variant={hasFilters ? 'outline' : 'secondary'} onClick={onClearSearch}>
            Clear search
          </Button>
        )}
      </div>
    </div>
  )
}
