import { ChevronDown } from 'lucide-react'

interface FilterSelectProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: ReadonlyArray<{ value: string; label: string }>
}

/** Compact dropdown for filter bars. The label is read out but not shown. */
export default function FilterSelect({ id, label, value, onChange, options }: FilterSelectProps) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full cursor-pointer appearance-none rounded-xl border border-brand-border bg-surface pl-4 pr-10 text-sm text-foreground outline-none transition-colors [color-scheme:dark] focus:border-accent focus:ring-2 focus:ring-accent/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
    </div>
  )
}
