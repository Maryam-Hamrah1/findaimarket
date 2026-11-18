import { Store, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import DemoNotice from '../components/auth/DemoNotice'
import GoogleButton from '../components/auth/GoogleButton'
import PasswordField from '../components/auth/PasswordField'
import Button from '../components/ui/Button'
import { SelectField, TextField } from '../components/ui/FormFields'
import { COUNTRIES } from '../data/countries'
import { useAuth } from '../hooks/useAuth'
import type { RegisterErrors, RegisterFields, UserRole } from '../types/auth'
import { destinationAfterSignIn, safeRedirect, validateRegister } from '../utils/auth'

const EMPTY: RegisterFields = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  country: '',
  acceptedTerms: false,
}

const TYPES: ReadonlyArray<{ id: UserRole; title: string; text: string; icon: typeof Store }> = [
  { id: 'buyer', title: 'Buyer', text: 'Shop, save products and place demo orders.', icon: ShoppingBag },
  { id: 'seller', title: 'Seller', text: 'Get ready to open a store. Store setup comes later.', icon: Store },
]

export default function RegisterPage() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const from = safeRedirect((location.state as { from?: unknown } | null)?.from, '')

  const [accountType, setAccountType] = useState<UserRole>(
    params.get('type') === 'seller' ? 'seller' : 'buyer',
  )
  const [fields, setFields] = useState<RegisterFields>(EMPTY)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    document.title = 'Create account · Findaimarket'
  }, [])

  if (user) return <Navigate to={destinationAfterSignIn(user.roles, from)} replace />

  const seller = accountType === 'seller'
  const set = <K extends keyof RegisterFields>(key: K, value: RegisterFields[K]) => {
    setFields((previous) => ({ ...previous, [key]: value }))
    setErrors((previous) => ({ ...previous, [key]: undefined }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const found = validateRegister(fields)
    setErrors(found)
    setFormError('')
    if (Object.keys(found).length > 0) return

    setBusy(true)
    const result = await register({
      accountType,
      fullName: fields.fullName,
      email: fields.email,
      password: fields.password,
      country: fields.country,
    })
    setBusy(false)

    if (!result.ok) {
      setFormError(result.message)
      return
    }

    // Sellers continue to store setup, buyers to where they were going
    const target = seller ? '/seller/onboarding' : destinationAfterSignIn(result.value.roles, from)
    navigate(target, { replace: true })
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Choose an account type, then fill in your details."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" state={location.state} className="font-semibold text-accent hover:text-accent-hover">
            Sign in
          </Link>
        </>
      }
    >
      <fieldset className="grid grid-cols-2 gap-3">
        <legend className="sr-only">Account type</legend>
        {TYPES.map((type) => {
          const Icon = type.icon
          const active = accountType === type.id
          return (
            <label
              key={type.id}
              className={`cursor-pointer rounded-2xl border p-4 transition-colors focus-within:outline-2 focus-within:outline-accent ${
                active ? 'border-accent bg-primary-light' : 'border-brand-border bg-background hover:border-accent'
              }`}
            >
              <input
                type="radio"
                name="account-type"
                value={type.id}
                checked={active}
                onChange={() => setAccountType(type.id)}
                className="sr-only"
              />
              <Icon size={20} className={active ? 'text-accent' : 'text-muted'} aria-hidden="true" />
              <span className="mt-2 block text-sm font-bold text-foreground">{type.title}</span>
              <span className="mt-1 block text-xs leading-5 text-muted">{type.text}</span>
            </label>
          )
        })}
      </fieldset>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <TextField
          id="reg-name"
          label="Full name"
          autoComplete="name"
          required
          value={fields.fullName}
          onChange={(event) => set('fullName', event.target.value)}
          error={errors.fullName}
        />
        <TextField
          id="reg-email"
          label={seller ? 'Business email' : 'Email address'}
          type="email"
          autoComplete="email"
          required
          value={fields.email}
          onChange={(event) => set('email', event.target.value)}
          error={errors.email}
        />
        <PasswordField
          id="reg-password"
          label="Password"
          autoComplete="new-password"
          required
          hint="At least 8 characters."
          value={fields.password}
          onChange={(event) => set('password', event.target.value)}
          error={errors.password}
        />
        <PasswordField
          id="reg-confirm"
          label="Confirm password"
          autoComplete="new-password"
          required
          value={fields.confirmPassword}
          onChange={(event) => set('confirmPassword', event.target.value)}
          error={errors.confirmPassword}
        />
        <SelectField
          id="reg-country"
          label="Country"
          required
          value={fields.country}
          onChange={(event) => set('country', event.target.value)}
          error={errors.country}
        >
          <option value="">Select your country</option>
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </SelectField>

        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-6 text-foreground">
            <input
              type="checkbox"
              checked={fields.acceptedTerms}
              onChange={(event) => set('acceptedTerms', event.target.checked)}
              aria-invalid={Boolean(errors.acceptedTerms)}
              aria-describedby={errors.acceptedTerms ? 'reg-terms-error' : undefined}
              className="mt-1 h-4 w-4 shrink-0 accent-accent"
            />
            <span>
              I agree to the{' '}
              <Link to="/terms" className="font-semibold text-accent underline">Terms</Link> and{' '}
              <Link to="/privacy" className="font-semibold text-accent underline">Privacy Policy</Link>.
            </span>
          </label>
          {errors.acceptedTerms && (
            <p id="reg-terms-error" role="alert" className="mt-1.5 text-xs text-danger">
              {errors.acceptedTerms}
            </p>
          )}
        </div>

        {seller && (
          <p className="rounded-xl border border-brand-border bg-background px-4 py-3 text-xs leading-5 text-muted">
            This only creates your seller account. You will set up your store in a later step.
          </p>
        )}

        {formError && (
          <p role="alert" className="rounded-xl border border-danger px-4 py-3 text-sm text-danger">
            {formError}
          </p>
        )}

        <Button type="submit" variant="secondary" size="lg" fullWidth disabled={busy} className="min-h-12">
          {busy ? 'Creating account…' : seller ? 'Create seller account' : 'Create buyer account'}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted" aria-hidden="true">
        <span className="h-px flex-1 bg-brand-border" />
        or
        <span className="h-px flex-1 bg-brand-border" />
      </div>
      <GoogleButton />
      <DemoNotice className="mt-5" />
    </AuthLayout>
  )
}
