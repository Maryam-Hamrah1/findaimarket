import type { ProductOption } from '../../types/productDetails'

interface ProductOptionsProps {
  options: ProductOption[]
  /** Chosen value per option id */
  selected: Readonly<Record<string, string>>
  onSelect: (optionId: string, value: string) => void
  /** Option ids to flag as "please choose" */
  missing?: readonly string[]
}

/** One group of choice buttons per variation. Renders nothing without options. */
export default function ProductOptions({
  options,
  selected,
  onSelect,
  missing = [],
}: ProductOptionsProps) {
  if (options.length === 0) return null

  return (
    <div className="space-y-5">
      {options.map((option) => {
        const labelId = `option-${option.id}-label`
        const isMissing = missing.includes(option.id)

        return (
          <div key={option.id}>
            <p id={labelId} className="text-sm font-semibold text-foreground">
              {option.label}
              {selected[option.id] && (
                <span className="ml-2 font-normal text-muted">{selected[option.id]}</span>
              )}
              {isMissing && (
                <span role="alert" className="ml-2 font-normal text-danger">
                  Please choose
                </span>
              )}
            </p>

            <div
              role="radiogroup"
              aria-labelledby={labelId}
              className="mt-2.5 flex flex-wrap gap-2.5"
            >
              {option.values.map((item) => {
                const isSelected = selected[option.id] === item.value

                return (
                  <button
                    key={item.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={!item.available}
                    onClick={() => onSelect(option.id, item.value)}
                    className={`min-h-11 min-w-12 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      isSelected
                        ? 'border-foreground bg-foreground text-background'
                        : item.available
                          ? 'border-brand-border bg-surface text-foreground hover:border-accent hover:text-accent'
                          : 'cursor-not-allowed border-brand-border bg-surface text-muted line-through opacity-50'
                    }`}
                  >
                    {item.value}
                    {!item.available && <span className="sr-only"> (unavailable)</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
