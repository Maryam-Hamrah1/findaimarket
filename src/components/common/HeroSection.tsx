import SearchInput from '../ui/SearchInput'

const suggestions = [
  'A gift for a coffee lover',
  'Running shoes for wide feet',
  'A desk lamp with warm light',
]

const matches = [
  {
    label: 'Best match',
    name: 'Elegant Leather Handbag',
    meta: 'Modern Style · $49.99',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200',
    position: 'left-0 top-4 lg:top-16',
  },
  {
    label: 'Also fits',
    name: 'Classic Minimalist Wrist Watch',
    meta: 'Tech Haven · $35.00',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
    position: 'bottom-4 right-0 lg:bottom-16',
  },
]

export default function HeroSection() {
  const handleSearch = (query: string) => {
    console.log('Search:', query)
  }

  return (
    <section className="bg-hero overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:py-24">

        {/* Left Content */}
        <div className="space-y-8">

          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">
            Find · Compare · Buy
          </p>

          <h1 className="font-display text-5xl font-medium leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Tell us what you are looking for.
            <span className="block italic text-accent">
              We will find it.
            </span>
          </h1>

          <p className="max-w-lg text-base leading-7 text-muted sm:text-lg">
            Describe it in your own words: the occasion, the budget,
            the feel. Our AI searches every store in the marketplace
            and brings back what truly fits you.
          </p>

          <SearchInput
            onSearch={handleSearch}
            placeholder="A warm, minimalist gift for my mother, under $80"
            className="max-w-xl"
          />

          <div className="flex max-w-xl flex-wrap gap-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSearch(suggestion)}
                className="rounded-full border border-brand-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Right Visual: the AI orb with matched products */}
        <div className="relative mx-auto flex min-h-[460px] w-full max-w-lg items-center justify-center lg:min-h-[600px]">

          <div className="absolute left-1/2 top-1/2 hidden h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-border sm:block" />
          <div className="absolute left-1/2 top-1/2 hidden h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/30 sm:block" />

          <div className="hero-orb relative h-64 w-64 rounded-full sm:h-[340px] sm:w-[340px]" aria-hidden="true" />

          {matches.map((match) => (
            <div
              key={match.name}
              className={`absolute flex w-60 items-center gap-3 rounded-2xl border border-brand-border bg-glass p-3.5 backdrop-blur-md ${match.position}`}
            >
              <img
                src={match.image}
                alt=""
                className="h-14 w-14 shrink-0 rounded-xl object-cover"
              />

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                  {match.label}
                </p>
                <p className="mt-1 truncate text-sm font-bold text-foreground">
                  {match.name}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {match.meta}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
