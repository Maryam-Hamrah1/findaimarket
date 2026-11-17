import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import DemoNotice from '../components/auth/DemoNotice'
import GoogleButton from '../components/auth/GoogleButton'
import PasswordField from '../components/auth/PasswordField'
import Button from '../components/ui/Button'
import { TextField } from '../components/ui/FormFields'
import { useAuth } from '../hooks/useAuth'
import { destinationAfterSignIn, safeRedirect, validateLogin } from '../utils/auth'

interface LocationState {
  from?: unknown
  notice?: unknown
}

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state ?? {}) as LocationState
  const from = safeRedirect(state.from, '')
  const notice = typeof state.notice === 'string' ? state.notice : ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    document.title = 'Sign in · Findaimarket'
  }, [])

  // Already signed in (or just signed in): go on to the destination
  if (user) return <Navigate to={destinationAfterSignIn(user.roles, from)} replace />

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const found = validateLogin(email, password)
    setErrors(found)
    setFormError('')
    if (Object.keys(found).length > 0) return

    setBusy(true)
    const result = await login(email, password, remember)
    setBusy(false)

    if (!result.ok) {
      setFormError(result.message)
      return
    }

    navigate(destinationAfterSignIn(result.value.roles, from), { replace: true })
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your demo account."
      footer={
        <>
          New to Findaimarket?{' '}
          <Link
            to="/register"
            state={location.state}
            className="font-semibold text-accent hover:text-accent-hover"
          >
            Create an account
          </Link>
        </>
      }
    >
      {notice && (
        <p role="status" className="mb-5 rounded-xl border border-brand-border bg-background px-4 py-3 text-sm text-foreground">
          {notice}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <TextField
          id="login-email"
          label="Email address"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />

        <PasswordField
          id="login-password"
          label="Password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-semibold text-accent hover:text-accent-hover">
            Forgot password?
          </Link>
        </div>

        {formError && (
          <p role="alert" className="rounded-xl border border-danger px-4 py-3 text-sm text-danger">
            {formError}
          </p>
        )}

        <Button type="submit" variant="secondary" size="lg" fullWidth disabled={busy} className="min-h-12">
          {busy ? 'Signing in…' : 'Sign in'}
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
