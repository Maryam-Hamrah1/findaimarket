import type { ReactNode } from 'react'

type BadgeVariant = 'new' | 'sale' | 'featured' | 'default'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  new: 'bg-primary-light text-foreground',
  sale: 'bg-accent text-on-accent',
  featured: 'bg-foreground text-background',
  default: 'bg-surface text-muted',
}

export default function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full
        px-3 py-1 text-xs font-semibold
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
