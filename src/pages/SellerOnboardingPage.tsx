import { ArrowLeft, ArrowRight, Info, Store } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandingStep from '../components/onboarding/BrandingStep'
import BusinessStep from '../components/onboarding/BusinessStep'
import LeaveDialog from '../components/onboarding/LeaveDialog'
import OnboardingProgress from '../components/onboarding/OnboardingProgress'
import PoliciesStep from '../components/onboarding/PoliciesStep'
import ReviewStep from '../components/onboarding/ReviewStep'
import StoreInfoStep from '../components/onboarding/StoreInfoStep'
import { fieldId } from '../components/onboarding/stepTypes'
import Breadcrumb from '../components/ui/Breadcrumb'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { useLeaveGuard } from '../hooks/useLeaveGuard'
import { useOnboardingDraft } from '../hooks/useOnboardingDraft'
import { useMyStore, useStores } from '../hooks/useStores'
import { storeRegistry } from '../services/storeRegistry'
import type { User } from '../types/auth'
import type { OnboardingErrors, OnboardingField } from '../types/onboarding'
import {
  LAST_STEP,
  ONBOARDING_STEPS,
  buildStoreRecord,
  isNameInUse,
  validateAll,
  validateStep,
} from '../utils/onboarding'

const STEP_INTRO: ReadonlyArray<string> = [
  'Tell us the basics about your store.',
  'Add your logo and cover so shoppers recognise you. Everything here is optional.',
  'A few details about your business. Required fields are marked with *.',
  'Describe how orders, returns and refunds work in your store.',
  'One last look before your store goes live in this demo.',
]

function AlreadyHasStore({ slug, name }: { slug: string; name: string }) {
  return (
    <main className="px-5 py-24">
      <div className="mx-auto max-w-md text-center">
        <Store size={36} className="mx-auto text-accent" aria-hidden="true" />
        <h1 className="mt-4 font-display text-4xl font-medium text-foreground">You already have a store</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          {name} is set up. Each seller account can create one store in this demo.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to={`/store/${slug}`} className="inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-sm font-bold text-on-accent hover:bg-accent-hover">
            View my store
          </Link>
          <Link to="/account/store" className="inline-flex min-h-11 items-center rounded-full border border-brand-border px-6 text-sm font-semibold text-foreground hover:border-accent hover:text-accent">
            Store settings
          </Link>
        </div>
      </div>
    </main>
  )
}

function OnboardingForm({ user }: { user: User }) {
  const navigate = useNavigate()
  const stores = useStores()
  const { draft, dirty, restored, saveFailed, setField, setAcceptedTerms, goTo, discard, finish } = useOnboardingDraft(user)
  const guard = useLeaveGuard(dirty)

  const [errors, setErrors] = useState<OnboardingErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showRestored, setShowRestored] = useState(restored)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const focusTarget = useRef<string | null>(null)
  const first = useRef(true)

  const { step, fields } = draft
  const context = { isNameTaken: (name: string) => isNameInUse(name, stores) }

  useEffect(() => {
    document.title = 'Set up your store · Findaimarket'
  }, [])

  // A new step starts at the top with the heading focused, unless a mistake needs the focus
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (focusTarget.current) return
    window.scrollTo({ top: 0 })
    headingRef.current?.focus()
  }, [step])

  /** Moves focus to the first mistake once the screen has updated */
  const focusField = (id: string | null) => {
    focusTarget.current = id
    window.setTimeout(() => {
      const element = id ? document.getElementById(id) : null
      element?.focus()
      focusTarget.current = null
    }, 0)
  }

  const handleChange = (key: OnboardingField, value: string) => {
    setField(key, value)
    setErrors((previous) => (previous[key] ? { ...previous, [key]: undefined } : previous))
    setSubmitError('')
  }

  const firstErrorId = (found: OnboardingErrors): string | null => {
    const key = (Object.keys(found) as Array<OnboardingField | 'acceptedTerms'>).find((candidate) => found[candidate])
    if (!key) return null
    return key === 'acceptedTerms' ? 'ob-acceptedTerms' : fieldId(key)
  }

  const handleNext = () => {
    const found = validateStep(step, fields, context)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      focusField(firstErrorId(found))
      return
    }
    goTo(step + 1)
  }

  const handleSelectStep = (target: number) => {
    // Moving forward must pass every step on the way
    for (let index = step; index < target; index += 1) {
      const found = validateStep(index, fields, context)
      if (Object.keys(found).length > 0) {
        goTo(index)
        setErrors(found)
        focusField(firstErrorId(found))
        return
      }
    }
    setErrors({})
    goTo(target)
  }

  const handleSubmit = () => {
    const { errors: found, firstInvalidStep } = validateAll(draft, context)
    setErrors(found)
    setSubmitError('')

    if (firstInvalidStep !== null) {
      focusField(firstErrorId(found))
      goTo(firstInvalidStep)
      return
    }
    if (Object.keys(found).length > 0) {
      focusField(firstErrorId(found))
      return
    }

    setSubmitting(true)
    const record = buildStoreRecord({ fields, owner: { id: user.id, fullName: user.fullName }, existingStores: stores })
    const result = storeRegistry.add(record)

    if (!result.ok) {
      setSubmitting(false)
      setSubmitError(result.message)
      if (result.reason === 'name-taken') {
        setErrors({ name: result.message })
        goTo(0)
      }
      return
    }

    guard.allowNavigation()
    finish()
    navigate(`/store/${record.store.slug}`, { replace: true })
  }

  const stepProps = { fields, errors, onChange: handleChange }
  const onReview = step === LAST_STEP

  return (
    <main>
      <div className="mx-auto max-w-3xl px-5 pb-16 pt-6 lg:pt-8">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'My account', to: '/account' }, { label: 'Set up your store' }]} />

        <h1 className="mt-6 font-display text-4xl font-medium text-foreground sm:text-5xl">Set up your store</h1>
        <p className="mt-3 flex gap-2 text-sm leading-6 text-muted">
          <Info size={17} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
          Demo only: your store is saved in this browser and is not verified or visible to others.
        </p>

        {showRestored && (
          <div role="status" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-border bg-surface px-4 py-3 text-sm text-foreground">
            <span>We restored your unfinished store setup.</span>
            <span className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => { discard(); setErrors({}); setShowRestored(false) }}>
                Start over
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowRestored(false)}>
                Dismiss
              </Button>
            </span>
          </div>
        )}

        <div className="mt-8">
          <OnboardingProgress current={step} furthest={draft.furthest} onSelect={handleSelectStep} />
        </div>

        <div className="mt-8 rounded-3xl border border-brand-border bg-surface p-5 shadow-card sm:p-8">
          <h2 ref={headingRef} tabIndex={-1} className="font-display text-3xl font-medium text-foreground outline-none">
            {ONBOARDING_STEPS[step]?.label}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">{STEP_INTRO[step]}</p>

          <form
            key={step}
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              if (onReview) handleSubmit()
              else handleNext()
            }}
            className="fade-in mt-6"
          >
            {step === 0 && <StoreInfoStep {...stepProps} />}
            {step === 1 && <BrandingStep {...stepProps} />}
            {step === 2 && <BusinessStep {...stepProps} />}
            {step === 3 && <PoliciesStep {...stepProps} />}
            {step === 4 && (
              <ReviewStep
                fields={fields}
                acceptedTerms={draft.acceptedTerms}
                errors={errors}
                submitError={submitError}
                submitting={submitting}
                onEdit={goTo}
                onTermsChange={(value) => {
                  setAcceptedTerms(value)
                  setErrors((previous) => ({ ...previous, acceptedTerms: undefined }))
                }}
              />
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              {step > 0 ? (
                <Button variant="outline" size="lg" onClick={() => { setErrors({}); goTo(step - 1) }} className="min-h-12">
                  <ArrowLeft size={18} aria-hidden="true" />
                  Previous
                </Button>
              ) : (
                <span />
              )}

              {onReview ? (
                <Button type="submit" variant="secondary" size="lg" disabled={submitting} className="min-h-12">
                  {submitting ? 'Creating store…' : 'Submit store'}
                </Button>
              ) : (
                <Button type="submit" variant="secondary" size="lg" className="min-h-12">
                  Next
                  <ArrowRight size={18} aria-hidden="true" />
                </Button>
              )}
            </div>
          </form>
        </div>

        <p aria-live="polite" className="mt-4 text-center text-xs text-muted">
          {saveFailed
            ? 'Your browser could not save your progress. Try removing large images.'
            : dirty
              ? 'Progress is saved on this device.'
              : ''}
        </p>
      </div>

      <LeaveDialog open={guard.pending !== null} onStay={guard.stay} onLeave={guard.leave} />
    </main>
  )
}

/** Route: /seller/onboarding (wrapped in ProtectedRoute role="seller"). */
export default function SellerOnboardingPage() {
  const { user } = useAuth()
  const myStore = useMyStore()

  if (!user) return null
  if (myStore) return <AlreadyHasStore slug={myStore.store.slug} name={myStore.store.name} />

  return <OnboardingForm user={user} />
}
