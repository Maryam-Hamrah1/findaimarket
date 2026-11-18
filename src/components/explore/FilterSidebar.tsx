import type { ReactNode } from 'react'

interface FilterSidebarProps {
  activeCount: number
  onClearAll: () => void
  children: ReactNode
  /** Accessible name of the sidebar */
  label?: string
}

/** Permanent filter column, visible from the lg breakpoint up. */
export default function FilterSidebar({
  activeCount,
  label = 'Product filters',
  onClearAll,
  children,
}: FilterSidebarProps) {
  return (
    <aside
      aria-label={label}
      className="sticky top-28 hidden max-h-[calc(100vh-8rem)] w-72 shrink-0 self-start overflow-y-auto rounded-3xl border border-brand-border bg-surface p-6 lg:block"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Filters
        </h2>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm font-semibold text-accent hover:text-accent-hover"
          >
            Clear all
          </button>
        )}
      </div>

      {children}
    </aside>
  )
}
