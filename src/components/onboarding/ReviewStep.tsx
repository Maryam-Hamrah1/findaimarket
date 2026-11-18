import { Pencil } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { getCountry } from '../../data/countries'
import type { OnboardingErrors, OnboardingFields } from '../../types/onboarding'
import { BUSINESS_TYPES, ONBOARDING_STEPS, STORE_CATEGORY_OPTIONS } from '../../utils/onboarding'
import Button from '../ui/Button'
import StoreLogo from '../ui/StoreLogo'

interface ReviewStepProps {
  fields: OnboardingFields
  acceptedTerms: boolean
  errors: OnboardingErrors
  submitError: string
  submitting: boolean
  onEdit: (step: number) => void
  onTermsChange: (value: boolean) => void
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  const empty = children === '' || children === undefined
  return (
    <div className="grid gap-1 py-2.5 sm:grid-cols-[170px_1fr] sm:gap-4">
      <dt className="text-xs uppercase tracking-[0.1em] text-muted">{label}</dt>
      <dd className={`min-w-0 whitespace-pre-line break-words text-sm ${empty ? 'text-muted' : 'text-foreground'}`}>
        {empty ? 'Not provided' : children}
      </dd>
    </div>
  )
}

function Section({ title, step, onEdit, children }: { title: string; step: number; onEdit: (step: number) => void; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-brand-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-xl font-medium text-foreground">{title}</h3>
        <Button variant="ghost" size="sm" onClick={() => onEdit(step)} aria-label={`Edit ${title}`}>
          <Pencil size={15} aria-hidden="true" />
          Edit
        </Button>
      </div>
      <dl className="mt-2 divide-y divide-brand-border">{children}</dl>
    </section>
  )
}

export default function ReviewStep({ fields, acceptedTerms, errors, submitError, submitting, onEdit, onTermsChange }: ReviewStepProps) {
  const category = STORE_CATEGORY_OPTIONS.find((option) => option.value === fields.category)?.label
  const type = BUSINESS_TYPES.find((option) => option.value === fields.businessType)?.label
  const country = getCountry(fields.country)?.name ?? fields.country
  const socials = [fields.website, fields.instagram, fields.facebook, fields.x].filter((link) => link.trim() !== '').join('\n')
  const [info, branding, business, policies] = ONBOARDING_STEPS

  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-muted">
        Check everything below. You can go back to change any section before you submit.
      </p>

      <div className="overflow-hidden rounded-2xl border border-brand-border bg-surface">
        <div
          className="h-28 bg-hero bg-cover bg-center"
          style={fields.cover ? { backgroundImage: `url(${fields.cover})` } : undefined}
          role="img"
          aria-label={fields.cover ? 'Cover image preview' : 'No cover image: the default background is used'}
        />
        <div className="flex items-center gap-4 px-5 pb-5">
          <div className="-mt-8">
            <StoreLogo name={fields.name || 'Store'} logo={fields.logo} size="md" />
          </div>
          <div className="min-w-0 pt-4">
            <p className="truncate font-display text-2xl font-medium text-foreground">{fields.name}</p>
            <p className="truncate text-sm text-muted">{[fields.city, country].filter(Boolean).join(', ')}</p>
          </div>
        </div>
      </div>

      <Section title={info?.label ?? 'Store info'} step={0} onEdit={onEdit}>
        <Row label="Description">{fields.description.trim()}</Row>
        <Row label="Category">{category}</Row>
        <Row label="Business type">{type}</Row>
        <Row label="Business email">{fields.email.trim()}</Row>
        <Row label="Phone">{fields.phone.trim()}</Row>
      </Section>

      <Section title={branding?.label ?? 'Branding'} step={1} onEdit={onEdit}>
        <Row label="Brand name">{fields.brandName.trim()}</Row>
        <Row label="Tagline">{fields.tagline.trim()}</Row>
        <Row label="Brand description">{fields.brandDescription.trim()}</Row>
        <Row label="Logo">{fields.logo ? 'Added' : ''}</Row>
        <Row label="Cover image">{fields.cover ? 'Added' : ''}</Row>
      </Section>

      <Section title={business?.label ?? 'Business'} step={2} onEdit={onEdit}>
        <Row label="Business name">{fields.businessName.trim()}</Row>
        <Row label="Registration no.">{fields.registrationNumber.trim()}</Row>
        <Row label="Address">{fields.address.trim()}</Row>
        <Row label="Website and social">{socials}</Row>
      </Section>

      <Section title={policies?.label ?? 'Policies'} step={3} onEdit={onEdit}>
        <Row label="Returns">{fields.returns.trim()}</Row>
        <Row label="Refunds">{fields.refunds.trim()}</Row>
        <Row label="Shipping">{fields.shipping.trim()}</Row>
        <Row label="Processing time">{fields.processingTime}</Row>
        <Row label="Support email">{fields.supportEmail.trim()}</Row>
      </Section>

      <div>
        <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-6 text-foreground">
          <input
            id="ob-acceptedTerms"
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => onTermsChange(event.target.checked)}
            aria-invalid={Boolean(errors.acceptedTerms)}
            aria-describedby={errors.acceptedTerms ? 'ob-terms-error' : undefined}
            className="mt-1 h-4 w-4 shrink-0 accent-accent"
          />
          <span>
            I agree to the <Link to="/terms" className="font-semibold text-accent underline">Terms</Link> and the{' '}
            <Link to="/terms" className="font-semibold text-accent underline">Seller Agreement</Link>.
            <span className="text-muted"> (Demo: these pages are not written yet.)</span>
          </span>
        </label>
        {errors.acceptedTerms && (
          <p id="ob-terms-error" role="alert" className="mt-1.5 text-xs text-danger">{errors.acceptedTerms}</p>
        )}
      </div>

      {submitError && (
        <p role="alert" className="rounded-xl border border-danger px-4 py-3 text-sm text-danger">{submitError}</p>
      )}

      {submitting && <p className="sr-only" role="status">Creating your store…</p>}
    </div>
  )
}
