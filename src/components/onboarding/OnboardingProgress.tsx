import { Check } from 'lucide-react'
import { ONBOARDING_STEPS } from '../../utils/onboarding'

interface OnboardingProgressProps {
  current: number
  furthest: number
  onSelect: (step: number) => void
}

/** Numbered steps. Steps already reached can be clicked to go back or forward. */
export default function OnboardingProgress({ current, furthest, onSelect }: OnboardingProgressProps) {
  const total = ONBOARDING_STEPS.length

  return (
    <nav aria-label="Store setup progress">
      <p className="text-sm font-semibold text-foreground sm:hidden" aria-hidden="true">
        Step {current + 1} of {total} · {ONBOARDING_STEPS[current]?.label}
      </p>

      <ol className="mt-3 flex items-center gap-2 sm:mt-0">
        {ONBOARDING_STEPS.map((step, index) => {
          const isCurrent = index === current
          const done = index < furthest && !isCurrent
          const reachable = index <= furthest

          return (
            <li key={step.id} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onSelect(index)}
                aria-current={isCurrent ? 'step' : undefined}
                className="group flex min-h-11 items-center gap-2.5 text-left disabled:cursor-not-allowed"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                    isCurrent
                      ? 'border-accent bg-accent text-on-accent'
                      : done
                        ? 'border-accent text-accent'
                        : 'border-brand-border text-muted'
                  }`}
                >
                  {done ? <Check size={15} aria-hidden="true" /> : index + 1}
                </span>
                <span
                  className={`hidden text-sm font-semibold sm:inline ${isCurrent ? 'text-foreground' : 'text-muted'}`}
                >
                  {step.label}
                </span>
                <span className="sr-only">
                  {`Step ${index + 1}: ${step.label}${done ? ', completed' : ''}`}
                </span>
              </button>
              {index < total - 1 && (
                <span aria-hidden="true" className={`h-px flex-1 ${index < furthest ? 'bg-accent' : 'bg-brand-border'}`} />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
