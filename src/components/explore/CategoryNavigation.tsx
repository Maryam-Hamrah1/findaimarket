import {
  Dumbbell,
  Home,
  LayoutGrid,
  Shirt,
  Smartphone,
  Sparkles,
  Watch,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import { CATEGORIES, type CategoryMeta } from '../../data/categories'
import type { CategoryFilter } from '../../types/product'

const ICONS: Record<CategoryFilter, LucideIcon> = {
  all: LayoutGrid,
  fashion: Shirt,
  electronics: Smartphone,
  accessories: Watch,
  'home-living': Home,
  beauty: Sparkles,
  sports: Dumbbell,
}

interface CategoryNavigationProps {
  active: CategoryFilter
  counts: Record<CategoryFilter, number>
  onSelect: (category: CategoryFilter) => void
  items?: ReadonlyArray<CategoryMeta>
  label?: string
}

export default function CategoryNavigation({
  active,
  counts,
  onSelect,
  items = CATEGORIES,
  label = 'Product categories',
}: CategoryNavigationProps) {
  const listRef = useRef<HTMLUListElement>(null)

  // Keep the active pill visible on small screens
  useEffect(() => {
    const activeButton = listRef.current?.querySelector('[aria-pressed="true"]')
    activeButton?.scrollIntoView({ inline: 'nearest', block: 'nearest' })
  }, [active])

  return (
    <nav aria-label={label}>
      <ul
        ref={listRef}
        className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 py-1"
      >
        {items.map((category) => {
          const Icon = ICONS[category.id]
          const isActive = active === category.id

          return (
            <li key={category.id} className="shrink-0">
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelect(category.id)}
                className={`
                  inline-flex min-h-11 items-center gap-2.5 rounded-full border
                  px-5 text-sm font-semibold transition-colors duration-200
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
                  ${
                    isActive
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-brand-border bg-surface text-foreground hover:border-accent hover:text-accent'
                  }
                `}
              >
                <Icon
                  size={18}
                  strokeWidth={1.8}
                  className={isActive ? 'text-background' : 'text-accent'}
                />
                {category.name}
                <span
                  className={`text-xs font-medium ${isActive ? 'text-background/70' : 'text-muted'}`}
                >
                  {counts[category.id]}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
