import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  badge?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}

/** Titled card used by every dashboard section. */
export default function Panel({ title, badge, action, children, className = '' }: PanelProps) {
  return (
    <section className={`rounded-2xl border border-brand-border bg-surface p-5 shadow-card ${className}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl font-medium text-foreground">{title}</h2>
          {badge}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
