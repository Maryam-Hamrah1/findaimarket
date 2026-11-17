import Breadcrumb from '../ui/Breadcrumb'
import SearchInput from '../ui/SearchInput'

interface StoresHeaderProps {
  query: string
  total: number
  onSearch: (query: string) => void
  onClear: () => void
}

export default function StoresHeader({
  query,
  total,
  onSearch,
  onClear,
}: StoresHeaderProps) {
  return (
    <section className="border-b border-brand-border">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-6 lg:pb-12 lg:pt-8">
        <Breadcrumb
          className="mb-6 lg:mb-8"
          items={[{ label: 'Home', to: '/' }, { label: 'Stores' }]}
        />

        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-medium leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
              Discover Stores
            </h1>
            <p className="mt-3 text-base leading-7 text-muted sm:text-lg">
              Explore independent stores from around the world.
            </p>
          </div>

          <div className="text-left sm:text-right" aria-live="polite">
            <p className="font-display text-5xl font-medium leading-none text-accent">
              {total}
            </p>
            <p className="mt-1.5 text-sm text-muted">
              {total === 1 ? 'store' : 'stores'} {query ? 'match your search' : 'to discover'}
            </p>
          </div>
        </div>

        <div className="mt-8 max-w-3xl">
          <SearchInput
            initialValue={query}
            onSearch={onSearch}
            onClear={onClear}
            submitLabel="Search"
            placeholder="Search by store name, category or country"
          />
        </div>
      </div>
    </section>
  )
}
