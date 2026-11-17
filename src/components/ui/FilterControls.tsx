import { ChevronDown, Star } from 'lucide-react'
import { useState, type ReactNode } from 'react'

/* Building blocks shared by every filter panel (products, stores). */

/* ---------- Expandable group ---------- */

interface FilterGroupProps {
  id: string
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

export function FilterGroup({
  id,
  title,
  defaultOpen = true,
  children,
}: FilterGroupProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-brand-border py-5 first:pt-0 last:border-b-0 last:pb-0">
      <h3>
        <button
          type="button"
          id={`${id}-button`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen(!open)}
          className="flex min-h-8 w-full items-center justify-between text-left text-sm font-semibold text-foreground"
        >
          {title}
          <ChevronDown
            size={18}
            className={`text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>

      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        hidden={!open}
        className="mt-4"
      >
        {children}
      </div>
    </div>
  )
}

/* ---------- Option row (checkbox / radio) ---------- */

interface FilterOptionProps {
  type: 'checkbox' | 'radio'
  name: string
  checked: boolean
  onChange: () => void
  children: ReactNode
  trailing?: ReactNode
}

export function FilterOption({
  type,
  name,
  checked,
  onChange,
  children,
  trailing,
}: FilterOptionProps) {
  return (
    <label className="flex min-h-9 cursor-pointer items-center gap-3 text-sm text-foreground">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 cursor-pointer accent-accent"
      />
      <span className="flex-1">{children}</span>
      {trailing !== undefined && (
        <span className="text-xs text-muted">{trailing}</span>
      )}
    </label>
  )
}

/* ---------- Stars ---------- */

interface StarsProps {
  /** Whole stars to fill (0 to 5) */
  count: number
  size?: number
}

/** Five stars with `count` of them filled. Decorative: pair it with text. */
export function Stars({ count, size = 14 }: StarsProps) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          size={size}
          className={
            index <= count
              ? 'fill-warning text-warning'
              : 'text-brand-border'
          }
        />
      ))}
    </span>
  )
}
