import { ChevronRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ParsedQuery } from '../../types/product'
import SearchInput from '../ui/SearchInput'

interface ExploreHeaderProps {
  query: string
  parsed: ParsedQuery
  total: number
  suggestions: string[]
  onSearch: (query: string) => void
  onClear: () => void
}

function formatBudget(parsed: ParsedQuery): string | null {
  if (parsed.minPrice !== null && parsed.maxPrice !== null) {
    return `$${parsed.minPrice} – $${parsed.maxPrice}`
  }
  if (parsed.maxPrice !== null) return `Under $${parsed.maxPrice}`
  if (parsed.minPrice !== null) return `Over $${parsed.minPrice}`
  return null
}

export default function ExploreHeader({
  query,
  parsed,
  total,
  suggestions,
  onSearch,
  onClear,
}: ExploreHeaderProps) {
  const budget = formatBudget(parsed)
  const hasQuery = query !== ''
  const understood = parsed.keywords.length > 0 || budget !== null

  return (
    <section className="border-b border-brand-border">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-6 lg:pb-12 lg:pt-8">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 lg:mb-8">
          <ol className="flex items-center gap-2 text-sm text-muted">
            <li>
              <Link to="/" className="transition-colors hover:text-accent">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={15} />
            </li>
            <li aria-current="page" className="text-foreground">
              Explore Products
            </li>
          </ol>
        </nav>

        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-medium leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
              Explore Products
            </h1>

            <p className="mt-3 text-base leading-7 text-muted sm:text-lg">
              Discover products from independent stores around the world.
            </p>
          </div>

          {/* Result count */}
          <div className="text-left sm:text-right" aria-live="polite">
            <p className="font-display text-5xl font-medium leading-none text-accent">
              {total}
            </p>
            <p className="mt-1.5 text-sm text-muted">
              {total === 1 ? 'product' : 'products'} {hasQuery ? 'match your request' : 'to discover'}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-8 max-w-3xl">
          <SearchInput
            initialValue={query}
            onSearch={onSearch}
            onClear={onClear}
            submitLabel="Search"
            placeholder="Describe it: a warm gift for my mother, under $80"
          />

          {hasQuery ? (
            <div className="rise-in mt-4 flex flex-wrap items-center gap-2.5 rounded-2xl border border-brand-border bg-glass px-4 py-3 backdrop-blur-md">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles size={16} className="text-accent" />
                {understood ? 'We understood' : 'Showing everything for'}
              </span>

              {parsed.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-accent/50 px-3 py-1 text-xs font-semibold text-accent"
                >
                  {keyword}
                </span>
              ))}

              {budget && (
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-on-accent">
                  {budget}
                </span>
              )}

              {!understood && (
                <span className="text-sm text-muted">&ldquo;{query}&rdquo;</span>
              )}
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <span className="text-sm text-muted">Try:</span>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onSearch(suggestion)}
                  className="min-h-9 rounded-full border border-brand-border px-4 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
