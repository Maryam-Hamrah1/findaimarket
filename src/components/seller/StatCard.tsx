import type { LucideIcon } from 'lucide-react'
import DemoBadge from './DemoBadge'

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  hint?: string
  demo?: boolean
}

export default function StatCard({ label, value, icon: Icon, hint, demo = false }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-brand-border bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted">{label}</p>
        <Icon size={18} className="text-accent" aria-hidden="true" />
      </div>
      <p className="mt-3 font-display text-3xl font-medium text-foreground">{value}</p>
      <div className="mt-2 flex min-h-5 items-center gap-2 text-xs text-muted">
        {demo && <DemoBadge />}
        {hint}
      </div>
    </div>
  )
}
