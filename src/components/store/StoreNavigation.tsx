import type { KeyboardEvent } from 'react'
import type { StoreTab } from '../../types/store'

export const STORE_TABS: ReadonlyArray<{ id: StoreTab; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'All Products' },
  { id: 'about', label: 'About' },
  { id: 'reviews', label: 'Reviews' },
]

export const tabId = (tab: StoreTab) => `store-tab-${tab}`
export const panelId = (tab: StoreTab) => `store-panel-${tab}`

interface StoreNavigationProps {
  active: StoreTab
  counts: Partial<Record<StoreTab, number>>
  onSelect: (tab: StoreTab) => void
}

export default function StoreNavigation({
  active,
  counts,
  onSelect,
}: StoreNavigationProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = STORE_TABS.findIndex((tab) => tab.id === active)
    let next = index

    if (event.key === 'ArrowRight') next = (index + 1) % STORE_TABS.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + STORE_TABS.length) % STORE_TABS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = STORE_TABS.length - 1
    else return

    event.preventDefault()
    const target = STORE_TABS[next].id
    onSelect(target)
    document.getElementById(tabId(target))?.focus()
  }

  return (
    <div className="sticky top-20 z-30 -mx-5 mt-8 border-b border-brand-border bg-background/90 px-5 backdrop-blur-md">
      <div
        role="tablist"
        aria-label="Store sections"
        onKeyDown={handleKeyDown}
        className="no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto"
      >
        {STORE_TABS.map((tab) => {
          const isActive = tab.id === active
          const count = counts[tab.id]

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={tabId(tab.id)}
              aria-selected={isActive}
              aria-controls={panelId(tab.id)}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelect(tab.id)}
              className={`relative min-h-12 shrink-0 px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent ${
                isActive ? 'text-accent' : 'text-muted hover:text-foreground'
              }`}
            >
              {tab.label}
              {count !== undefined && (
                <span className="ml-1.5 text-xs font-medium opacity-70">{count}</span>
              )}
              <span
                aria-hidden="true"
                className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-accent transition-opacity duration-200 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
