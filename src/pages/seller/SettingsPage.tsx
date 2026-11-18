import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import ImageUploadField from '../../components/onboarding/ImageUploadField'
import PageHeader from '../../components/seller/PageHeader'
import Panel from '../../components/seller/Panel'
import Button from '../../components/ui/Button'
import { SelectField, TextAreaField, TextField } from '../../components/ui/FormFields'
import { COUNTRIES } from '../../data/countries'
import { useAuth } from '../../hooks/useAuth'
import { useSellerStore } from '../../hooks/useSellerStore'
import { useStores } from '../../hooks/useStores'
import { storeRegistry } from '../../services/storeRegistry'
import type { OnboardingErrors, OnboardingField, OnboardingFields } from '../../types/onboarding'
import { COVER_RULES, LOGO_RULES } from '../../utils/images'
import { applyFields, recordToFields } from '../../utils/storeSettings'
import {
  LIMITS,
  PROCESSING_TIMES,
  STORE_CATEGORY_OPTIONS,
  isNameInUse,
  validateStep,
} from '../../utils/onboarding'

const fid = (key: OnboardingField) => `set-${key}`

export default function SettingsPage() {
  const record = useSellerStore()
  const { user } = useAuth()
  const stores = useStores()
  const saved = useMemo(() => recordToFields(record), [record])

  const [fields, setFields] = useState<OnboardingFields>(saved)
  const [errors, setErrors] = useState<OnboardingErrors>({})
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const first = useRef(true)

  useEffect(() => {
    document.title = 'Store settings · Findaimarket'
  }, [])

  // Another tab saved the store: show what is stored now
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setFields(saved)
  }, [saved])

  const dirty = (Object.keys(saved) as OnboardingField[]).some((key) => fields[key] !== saved[key])

  const set = (key: OnboardingField, value: string) => {
    setFields((previous) => ({ ...previous, [key]: value }))
    setErrors((previous) => ({ ...previous, [key]: undefined }))
    setMessage(null)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!user) return

    // Other stores' names are taken. This store's own name is fine.
    const others = stores.filter((store) => store.id !== record.store.id)
    const context = { isNameTaken: (name: string) => isNameInUse(name, others) }
    const found: OnboardingErrors = {}
    for (let step = 0; step <= 3; step += 1) Object.assign(found, validateStep(step, fields, context))

    setErrors(found)
    const firstKey = (Object.keys(found) as OnboardingField[])[0]
    if (firstKey) {
      setMessage({ ok: false, text: 'Please fix the highlighted fields.' })
      document.getElementById(fid(firstKey))?.focus()
      return
    }

    const result = storeRegistry.update(user.id, (current) => applyFields(current, fields, user.fullName))
    setMessage(result.ok ? { ok: true, text: 'Saved. Your public store page now shows these details.' } : { ok: false, text: result.message })
    if (!result.ok && result.reason === 'name-taken') setErrors({ name: result.message })
  }

  const text = (key: OnboardingField, label: string, extra: { type?: string; required?: boolean; hint?: string; max?: number; wide?: boolean } = {}) => (
    <TextField
      id={fid(key)}
      label={label}
      type={extra.type}
      required={extra.required}
      hint={extra.hint}
      maxLength={extra.max}
      value={fields[key]}
      onChange={(event) => set(key, event.target.value)}
      error={errors[key]}
      containerClassName={extra.wide ? 'sm:col-span-2' : undefined}
    />
  )

  return (
    <div className="fade-in">
      <PageHeader
        title="Store settings"
        description="Changes are saved in this browser and appear on your public store page."
        actions={
          <Link to={`/store/${record.store.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-brand-border px-5 text-sm font-semibold text-foreground hover:border-accent hover:text-accent">
            View my store
          </Link>
        }
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <Panel title="Store information">
          <div className="grid gap-5 sm:grid-cols-2">
            {text('name', 'Store name', { required: true, max: LIMITS.nameMax, wide: true, hint: 'Your store address (/store/' + record.store.slug + ') does not change.' })}
            <TextAreaField
              id={fid('description')}
              label="Store description"
              required
              maxLength={LIMITS.descriptionMax}
              value={fields.description}
              onChange={(event) => set('description', event.target.value)}
              error={errors.description}
              containerClassName="sm:col-span-2"
            />
            <SelectField id={fid('category')} label="Store category" required value={fields.category} onChange={(event) => set('category', event.target.value)} error={errors.category}>
              <option value="">Select a category</option>
              {STORE_CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectField>
            {text('tagline', 'Tagline', { max: LIMITS.taglineMax })}
          </div>
        </Panel>

        <Panel title="Branding">
          <div className="space-y-5">
            <ImageUploadField id={fid('logo')} label="Store logo" hint="PNG, JPG or WebP, up to 5 MB." value={fields.logo} rules={LOGO_RULES} shape="logo" onChange={(value) => set('logo', value)} />
            <ImageUploadField id={fid('cover')} label="Cover image" hint="A wide image works best. PNG, JPG or WebP, up to 5 MB." value={fields.cover} rules={COVER_RULES} shape="cover" onChange={(value) => set('cover', value)} />
          </div>
        </Panel>

        <Panel title="Contact and location">
          <div className="grid gap-5 sm:grid-cols-2">
            {text('email', 'Contact email', { type: 'email', required: true })}
            {text('phone', 'Phone', { type: 'tel' })}
            <SelectField id={fid('country')} label="Country" required value={fields.country} onChange={(event) => set('country', event.target.value)} error={errors.country}>
              <option value="">Select your country</option>
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>{country.name}</option>
              ))}
            </SelectField>
            {text('city', 'City', { required: true, max: LIMITS.cityMax })}
            {text('address', 'Business address', { required: true, max: LIMITS.addressMax, wide: true })}
          </div>
        </Panel>

        <Panel title="Social links">
          <div className="grid gap-5 sm:grid-cols-2">
            {text('website', 'Website', { hint: 'Like https://example.com' })}
            {text('instagram', 'Instagram')}
            {text('facebook', 'Facebook')}
            {text('x', 'X')}
          </div>
        </Panel>

        <Panel title="Shipping and policies">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextAreaField id={fid('shipping')} label="Shipping information" required maxLength={LIMITS.policyMax} value={fields.shipping} onChange={(event) => set('shipping', event.target.value)} error={errors.shipping} containerClassName="sm:col-span-2" />
            <SelectField id={fid('processingTime')} label="Processing time" required value={fields.processingTime} onChange={(event) => set('processingTime', event.target.value)} error={errors.processingTime}>
              {PROCESSING_TIMES.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </SelectField>
            {text('supportEmail', 'Customer support email', { type: 'email', required: true })}
            <TextAreaField id={fid('returns')} label="Return policy" required maxLength={LIMITS.policyMax} value={fields.returns} onChange={(event) => set('returns', event.target.value)} error={errors.returns} containerClassName="sm:col-span-2" />
            <TextAreaField id={fid('refunds')} label="Refund policy" required maxLength={LIMITS.policyMax} value={fields.refunds} onChange={(event) => set('refunds', event.target.value)} error={errors.refunds} containerClassName="sm:col-span-2" />
          </div>
        </Panel>

        <div className="sticky bottom-0 -mx-2 flex flex-wrap items-center gap-4 border-t border-brand-border bg-background/90 px-2 py-4 backdrop-blur">
          <Button type="submit" variant="secondary" size="lg" disabled={!dirty} className="min-h-12">Save changes</Button>
          <Button variant="ghost" disabled={!dirty} onClick={() => { setFields(saved); setErrors({}); setMessage(null) }}>Discard changes</Button>
          <p aria-live="polite" className={`text-sm ${message?.ok ? 'text-success' : 'text-danger'}`}>{message?.text}</p>
        </div>
      </form>
    </div>
  )
}
