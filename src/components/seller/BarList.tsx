interface BarListProps {
  items: ReadonlyArray<{ label: string; value: number }>
  format: (value: number) => string
}

/** Horizontal bars for ranked values (best sellers, revenue by category). */
export default function BarList({ items, format }: BarListProps) {
  const max = Math.max(1, ...items.map((item) => item.value))

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-foreground">{item.label}</span>
            <span className="shrink-0 font-semibold text-foreground">{format(item.value)}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-background" aria-hidden="true">
            <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(3, (item.value / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}
