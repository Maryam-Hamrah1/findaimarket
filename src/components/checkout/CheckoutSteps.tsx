import { Check } from 'lucide-react'
import { CHECKOUT_STEPS, type CheckoutStep } from '../../types/checkout'

interface CheckoutStepsProps {
  current: CheckoutStep
  /** Steps the customer may go back to (already completed) */
  reachable: ReadonlySet<CheckoutStep>
  onSelect: (step: CheckoutStep) => void
}

/** Progress indicator. Completed steps are buttons so earlier answers can be edited. */
export default function CheckoutSteps({ current, reachable, onSelect }: CheckoutStepsProps) {
  const currentIndex = CHECKOUT_STEPS.findIndex((step) => step.id === current)

  return (
    <nav aria-label="Checkout progress">
      <ol className="grid grid-cols-4 gap-2 sm:gap-4">
        {CHECKOUT_STEPS.map((step, index) => {
          const done = index < currentIndex
          const active = index === currentIndex
          const canGo = !active && reachable.has(step.id)

          const marker = (
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                active
                  ? 'border-accent bg-accent text-on-accent'
                  : done
                    ? 'border-accent text-accent'
                    : 'border-brand-border text-muted'
              }`}
            >
              {done ? <Check size={17} aria-hidden="true" /> : index + 1}
            </span>
          )

          const label = (
            <span
              className={`text-xs font-semibold sm:text-sm ${
                active ? 'text-foreground' : done ? 'text-foreground' : 'text-muted'
              }`}
            >
              {step.label}
            </span>
          )

          return (
            <li
              key={step.id}
              aria-current={active ? 'step' : undefined}
              className="relative"
            >
              {/* Line to the next step */}
              {index < CHECKOUT_STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 top-[18px] hidden h-px w-full sm:block ${
                    done ? 'bg-accent' : 'bg-brand-border'
                  }`}
                />
              )}

              {canGo ? (
                <button
                  type="button"
                  onClick={() => onSelect(step.id)}
                  className="relative flex w-full flex-col items-center gap-2 rounded-xl py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {marker}
                  {label}
                  <span className="sr-only">, completed. Go back to edit.</span>
                </button>
              ) : (
                <div className="relative flex flex-col items-center gap-2 py-1">
                  {marker}
                  {label}
                  {active && <span className="sr-only">, current step</span>}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
