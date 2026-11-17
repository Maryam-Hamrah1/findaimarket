import { Banknote, CreditCard, Landmark, TriangleAlert, Wallet } from 'lucide-react'
import { useState } from 'react'
import { getCountry } from '../../data/countries'
import { PAYMENT_METHODS, isPaymentAvailable } from '../../data/payments'
import type { PaymentMethodId } from '../../types/checkout'
import Button from '../ui/Button'

interface PaymentStepProps {
  selected: PaymentMethodId | null
  destination: string
  onSelect: (id: PaymentMethodId) => void
  onBack: () => void
  onContinue: () => void
}

const ICONS = {
  card: CreditCard,
  paypal: Wallet,
  'bank-transfer': Landmark,
  'cash-on-delivery': Banknote,
} as const

export default function PaymentStep({
  selected,
  destination,
  onSelect,
  onBack,
  onContinue,
}: PaymentStepProps) {
  const [showError, setShowError] = useState(false)
  const countryName = getCountry(destination)?.name ?? 'your country'
  const chosen = PAYMENT_METHODS.find((method) => method.id === selected)

  const handleContinue = () => {
    if (!selected) {
      setShowError(true)
      return
    }
    onContinue()
  }

  return (
    <div>
      <p
        role="note"
        className="flex items-start gap-3 rounded-2xl border border-brand-border bg-surface px-4 py-3 text-sm text-muted"
      >
        <TriangleAlert size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
        <span>
          <span className="font-semibold text-foreground">Demonstration only.</span>{' '}
          No payment provider is connected and this page never asks for card
          numbers, security codes or any other payment details.
        </span>
      </p>

      <div
        role="radiogroup"
        aria-label="Payment method"
        aria-describedby={showError && !selected ? 'payment-error' : undefined}
        className="mt-6 space-y-3"
      >
        {PAYMENT_METHODS.map((method) => {
          const Icon = ICONS[method.id]
          const available = isPaymentAvailable(method, destination)
          const isSelected = selected === method.id

          return (
            <label
              key={method.id}
              className={`flex items-start gap-4 rounded-2xl border p-4 transition-colors ${
                !available
                  ? 'cursor-not-allowed border-brand-border opacity-55'
                  : isSelected
                    ? 'cursor-pointer border-accent bg-primary-light'
                    : 'cursor-pointer border-brand-border hover:border-accent/60'
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                checked={isSelected}
                disabled={!available}
                onChange={() => {
                  setShowError(false)
                  onSelect(method.id)
                }}
                className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-accent disabled:cursor-not-allowed"
              />

              <Icon size={22} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />

              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">{method.label}</span>
                <span className="mt-0.5 block text-sm text-muted">
                  {available
                    ? method.description
                    : `Not available for delivery to ${countryName}.`}
                </span>
              </span>
            </label>
          )
        })}
      </div>

      {showError && !selected && (
        <p id="payment-error" role="alert" className="mt-3 text-sm text-danger">
          Choose a payment method to continue.
        </p>
      )}

      <div aria-live="polite">
        {chosen && (
          <p className="fade-in mt-5 rounded-2xl border border-dashed border-brand-border px-4 py-3 text-sm leading-6 text-muted">
            <span className="font-semibold text-foreground">{chosen.label} (demo): </span>
            {chosen.demoNote}
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-muted">
        Payment methods differ by country and seller. Only the ones offered for
        {' '}{countryName} can be chosen.
      </p>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="outline" size="lg" onClick={onBack} className="min-h-12">
          Back to delivery
        </Button>
        <Button variant="secondary" size="lg" onClick={handleContinue} className="min-h-12">
          Review order
        </Button>
      </div>
    </div>
  )
}
