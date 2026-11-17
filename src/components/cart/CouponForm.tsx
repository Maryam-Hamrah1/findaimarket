import { Check, Tag, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { Coupon, CouponResult } from '../../types/cart'
import Button from '../ui/Button'

interface CouponFormProps {
  applied: Coupon | null
  onApply: (code: string) => CouponResult
  onRemove: () => void
}

/** Demo coupon box. Codes are checked against a small local list. */
export default function CouponForm({ applied, onApply, onRemove }: CouponFormProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = onApply(code)

    if (result.ok) {
      setCode('')
      setError('')
    } else {
      setError(result.message)
    }
  }

  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Tag size={16} className="text-accent" aria-hidden="true" />
        Coupon code
        <span className="rounded-full bg-primary-light px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
          Demo
        </span>
      </h3>

      {applied ? (
        <div className="fade-in mt-3 flex items-center justify-between gap-3 rounded-xl border border-accent/50 px-4 py-3">
          <p className="flex items-center gap-2 text-sm text-foreground">
            <Check size={17} className="text-success" aria-hidden="true" />
            <span>
              <span className="font-semibold">{applied.code}</span>
              <span className="text-muted"> · {applied.label}</span>
            </span>
          </p>

          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove coupon ${applied.code}`}
            className="rounded-full p-1.5 text-muted transition-colors hover:text-danger"
          >
            <X size={17} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3" noValidate>
          <div className="flex gap-2">
            <label htmlFor="coupon-code" className="sr-only">
              Coupon code
            </label>
            <input
              id="coupon-code"
              value={code}
              onChange={(event) => {
                setCode(event.target.value)
                if (error) setError('')
              }}
              placeholder="Enter code"
              autoComplete="off"
              aria-invalid={error !== ''}
              aria-describedby={error ? 'coupon-error' : 'coupon-hint'}
              className={`min-h-11 w-full min-w-0 rounded-full border bg-background px-4 text-sm uppercase text-foreground outline-none transition-colors placeholder:normal-case placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 ${
                error ? 'border-danger' : 'border-brand-border'
              }`}
            />
            <Button type="submit" variant="outline" className="min-h-11 shrink-0">
              Apply
            </Button>
          </div>

          {error ? (
            <p id="coupon-error" role="alert" className="mt-2 text-xs text-danger">
              {error}
            </p>
          ) : (
            <p id="coupon-hint" className="mt-2 text-xs text-muted">
              Demo codes only. Try SAVE10 or FREESHIP.
            </p>
          )}
        </form>
      )}
    </div>
  )
}
