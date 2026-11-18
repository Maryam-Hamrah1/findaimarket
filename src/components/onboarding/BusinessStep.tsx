import { LIMITS } from '../../utils/onboarding'
import { TextField } from '../ui/FormFields'
import { fieldId, type StepProps } from './stepTypes'

export default function BusinessStep({ fields, errors, onChange }: StepProps) {
  return (
    <div className="space-y-5">
      <p className="rounded-xl border border-brand-border bg-surface px-4 py-3 text-xs leading-5 text-muted">
        No legal documents or ID are needed in this demo, and nothing you enter here is verified.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id={fieldId('businessName')}
          label="Business name"
          maxLength={LIMITS.nameMax}
          value={fields.businessName}
          onChange={(event) => onChange('businessName', event.target.value)}
          error={errors.businessName}
        />
        <TextField
          id={fieldId('registrationNumber')}
          label="Business registration number"
          maxLength={40}
          value={fields.registrationNumber}
          onChange={(event) => onChange('registrationNumber', event.target.value)}
          error={errors.registrationNumber}
          hint="Kept private. Not shown on your store page."
        />
        <TextField
          id={fieldId('address')}
          label="Business address"
          required
          autoComplete="street-address"
          maxLength={LIMITS.addressMax}
          value={fields.address}
          onChange={(event) => onChange('address', event.target.value)}
          error={errors.address}
          hint="Kept private. Not shown on your store page."
          containerClassName="sm:col-span-2"
        />
        <TextField
          id={fieldId('website')}
          label="Business website"
          inputMode="url"
          value={fields.website}
          onChange={(event) => onChange('website', event.target.value)}
          error={errors.website}
          placeholder="https://example.com"
          containerClassName="sm:col-span-2"
        />
        <TextField
          id={fieldId('instagram')}
          label="Instagram"
          inputMode="url"
          value={fields.instagram}
          onChange={(event) => onChange('instagram', event.target.value)}
          error={errors.instagram}
          placeholder="https://instagram.com/yourstore"
        />
        <TextField
          id={fieldId('facebook')}
          label="Facebook"
          inputMode="url"
          value={fields.facebook}
          onChange={(event) => onChange('facebook', event.target.value)}
          error={errors.facebook}
          placeholder="https://facebook.com/yourstore"
        />
        <TextField
          id={fieldId('x')}
          label="X"
          inputMode="url"
          value={fields.x}
          onChange={(event) => onChange('x', event.target.value)}
          error={errors.x}
          placeholder="https://x.com/yourstore"
        />
      </div>
    </div>
  )
}
