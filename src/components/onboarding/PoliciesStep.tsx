import { LIMITS, PROCESSING_TIMES } from '../../utils/onboarding'
import { SelectField, TextAreaField, TextField } from '../ui/FormFields'
import { fieldId, type StepProps } from './stepTypes'

export default function PoliciesStep({ fields, errors, onChange }: StepProps) {
  const counter = (value: string) => `${value.length}/${LIMITS.policyMax}`

  return (
    <div className="space-y-5">
      <p className="rounded-xl border border-brand-border bg-surface px-4 py-3 text-xs leading-5 text-muted">
        The text below is only a starting suggestion. Edit it so it describes how your own store
        works. It is not a Findaimarket policy and not legal advice.
      </p>
      <TextAreaField
        id={fieldId('returns')}
        label="Return policy"
        required
        maxLength={LIMITS.policyMax}
        value={fields.returns}
        onChange={(event) => onChange('returns', event.target.value)}
        error={errors.returns}
        hint={counter(fields.returns)}
      />
      <TextAreaField
        id={fieldId('refunds')}
        label="Refund policy"
        required
        maxLength={LIMITS.policyMax}
        value={fields.refunds}
        onChange={(event) => onChange('refunds', event.target.value)}
        error={errors.refunds}
        hint={counter(fields.refunds)}
      />
      <TextAreaField
        id={fieldId('shipping')}
        label="Shipping information"
        required
        maxLength={LIMITS.policyMax}
        value={fields.shipping}
        onChange={(event) => onChange('shipping', event.target.value)}
        error={errors.shipping}
        hint={counter(fields.shipping)}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          id={fieldId('processingTime')}
          label="Processing time"
          required
          value={fields.processingTime}
          onChange={(event) => onChange('processingTime', event.target.value)}
          error={errors.processingTime}
        >
          {PROCESSING_TIMES.map((time) => (
            <option key={time} value={time}>{time}</option>
          ))}
        </SelectField>
        <TextField
          id={fieldId('supportEmail')}
          label="Customer support email"
          type="email"
          required
          value={fields.supportEmail}
          onChange={(event) => onChange('supportEmail', event.target.value)}
          error={errors.supportEmail}
          hint="Shown on your store page."
        />
      </div>
    </div>
  )
}
