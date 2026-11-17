import { Minus, Plus } from 'lucide-react'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  /** Smallest allowed value (default 1) */
  min?: number
  /** Largest allowed value, e.g. the units in stock */
  max: number
  /** Names the control for screen readers, e.g. "Quantity of Linen Throw" */
  label: string
  disabled?: boolean
}

/** − 2 + control that never goes below min or above max. */
export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  label,
  disabled = false,
}: QuantityStepperProps) {
  const button =
    'flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:text-accent disabled:pointer-events-none disabled:opacity-40'

  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center rounded-full border border-brand-border bg-surface"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        className={button}
      >
        <Minus size={17} />
      </button>

      <span
        className="w-10 text-center text-sm font-semibold text-foreground"
        aria-live="polite"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        className={button}
      >
        <Plus size={17} />
      </button>
    </div>
  )
}
