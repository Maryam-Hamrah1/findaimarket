import { Search } from 'lucide-react'

interface SearchBoxProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

export default function SearchBox({ id, label, placeholder, value, onChange }: SearchBoxProps) {
  return (
    <div className="relative min-w-0 flex-1 basis-56">
      <label htmlFor={id} className="sr-only">{label}</label>
      <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-11 w-full rounded-xl border border-brand-border bg-surface pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </div>
  )
}
