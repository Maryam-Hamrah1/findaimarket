import { X } from 'lucide-react'

export interface FilterChip {
  key: string
  label: string
  onRemove: () => void
}

interface FilterChipsProps {
  chips: FilterChip[]
  onClear: () => void
}

/** Removable chips that summarise the filters currently applied. */
export default function FilterChips({ chips, onClear }: FilterChipsProps) {
  if (chips.length === 0) return null

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          aria-label={`Remove filter: ${chip.label}`}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-brand-border bg-surface pl-3.5 pr-2.5 text-xs font-semibold text-foreground transition-colors hover:border-accent"
        >
          {chip.label}
          <X size={14} className="text-muted" />
        </button>
      ))}

      <button
        type="button"
        onClick={onClear}
        className="ml-1 min-h-9 text-xs font-semibold text-accent hover:text-accent-hover"
      >
        Clear all
      </button>
    </div>
  )
}
