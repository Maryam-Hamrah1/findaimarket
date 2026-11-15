import { Search, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'

interface SearchInputProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
}

export default function SearchInput({
  placeholder = 'Search products, brands, and stores...',
  onSearch,
  className = '',
}: SearchInputProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedQuery = query.trim()

    if (trimmedQuery) {
      onSearch?.(trimmedQuery)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={`
        flex w-full items-center gap-3 rounded-full
        border border-brand-border bg-glass p-2 pl-5
        backdrop-blur-md
        transition-all duration-200
        focus-within:border-accent
        focus-within:ring-2 focus-within:ring-accent/20
        ${className}
      `}
    >
      <Search
        size={21}
        className="shrink-0 text-muted"
      />

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        aria-label="Describe what you are looking for"
        className="min-w-0 flex-1 bg-transparent py-3 text-base text-foreground outline-none placeholder:text-muted"
      />

      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          aria-label="Clear search"
          className="rounded-full p-1 text-muted hover:bg-surface"
        >
          <X size={17} />
        </button>
      )}

      <button
        type="submit"
        className="flex shrink-0 items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-on-accent transition-colors hover:bg-accent-hover"
      >
        <span>Find it</span>
      </button>
    </form>
  )
}
