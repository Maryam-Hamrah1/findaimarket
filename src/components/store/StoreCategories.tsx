import { ArrowRight } from 'lucide-react'
import type { StoreSection } from '../../types/store'

interface StoreCategoriesProps {
  sections: StoreSection[]
  variant: 'pills' | 'cards'
  onSelect: (section: string | null) => void
  /** Pills only: the selected section, null = all */
  active?: string | null
  totalCount?: number
}

/** The store's own categories. Sections with no products never reach this component. */
export default function StoreCategories({
  sections,
  variant,
  onSelect,
  active = null,
  totalCount = 0,
}: StoreCategoriesProps) {
  if (variant === 'cards') {
    return (
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {sections.map((section) => (
          <li key={section.name}>
            <button
              type="button"
              onClick={() => onSelect(section.name)}
              className="group flex min-h-20 w-full items-center justify-between gap-3 rounded-2xl border border-brand-border bg-surface px-5 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-accent/60"
            >
              <span>
                <span className="block font-display text-xl font-semibold text-foreground">
                  {section.name}
                </span>
                <span className="text-xs text-muted">
                  {section.count} {section.count === 1 ? 'product' : 'products'}
                </span>
              </span>
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="shrink-0 text-muted transition-colors group-hover:text-accent"
              />
            </button>
          </li>
        ))}
      </ul>
    )
  }

  const pill = (label: string, count: number, value: string | null) => {
    const isActive = active === value

    return (
      <li key={label} className="shrink-0">
        <button
          type="button"
          aria-pressed={isActive}
          onClick={() => onSelect(value)}
          className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${
            isActive
              ? 'border-foreground bg-foreground text-background'
              : 'border-brand-border bg-surface text-foreground hover:border-accent hover:text-accent'
          }`}
        >
          {label}
          <span className={`text-xs font-medium ${isActive ? 'text-background/70' : 'text-muted'}`}>
            {count}
          </span>
        </button>
      </li>
    )
  }

  return (
    <nav aria-label="Store categories">
      <ul className="no-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 py-1">
        {pill('All Products', totalCount, null)}
        {sections.map((section) => pill(section.name, section.count, section.name))}
      </ul>
    </nav>
  )
}
