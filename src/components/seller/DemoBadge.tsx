/** Marks numbers that are made up for the design preview. */
export default function DemoBadge({ children = 'Demo data' }: { children?: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-brand-border bg-background px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
      {children}
    </span>
  )
}
