import { ChevronDown } from 'lucide-react'

interface SortSelectProps<T extends string> {
  id: string
  value: T
  options: ReadonlyArray<{ value: T; label: string }>
  onChange: (value: T) => void
  label?: string
}

export default function SortSelect<T extends string>({
  id,
  value,
  options,
  onChange,
  label = 'Sort by',
}: SortSelectProps<T>) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="hidden text-sm text-muted sm:block">
        {label}
      </label>

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
          className="min-h-11 cursor-pointer appearance-none rounded-full border border-brand-border bg-surface py-2 pl-5 pr-11 text-sm font-semibold text-foreground outline-none transition-colors [color-scheme:dark] hover:border-accent focus:border-accent focus:ring-2 focus:ring-accent/20"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
