import { CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import DemoNotice from '../components/auth/DemoNotice'
import Button from '../components/ui/Button'
import { TextField } from '../components/ui/FormFields'
import { useAuth } from '../hooks/useAuth'
import { isValidEmail } from '../utils/validation'

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    document.title = 'Reset password · Findaimarket'
  }, [])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (email.trim() === '') return setError('Enter your email address.')
    if (!isValidEmail(email)) return setError('Enter a valid email address, like name@example.com.')

    setError('')
    setBusy(true)
    await requestPasswordReset(email)
    setBusy(false)
    setSent(true)
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we will pretend to send a reset link."
      footer={
        <Link to="/login" className="font-semibold text-accent hover:text-accent-hover">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div role="status" className="fade-in rounded-xl border border-brand-border bg-background p-5">
          <CheckCircle2 size={24} className="text-success" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold text-foreground">Demo: reset link “sent”</p>
          <p className="mt-1 text-sm leading-6 text-muted">
            If an account exists for {email.trim()}, a reset link would be on its way. In this
            demo no email is sent and passwords cannot be reset.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <TextField
            id="reset-email"
            label="Email address"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={error}
          />
          <Button type="submit" variant="secondary" size="lg" fullWidth disabled={busy} className="min-h-12">
            {busy ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      )}

      <DemoNotice className="mt-5" />
    </AuthLayout>
  )
}
