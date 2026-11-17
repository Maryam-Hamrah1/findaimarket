import { CheckCircle2, X } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'
import { useDialog } from '../../hooks/useDialog'
import Button from '../ui/Button'
import Input from '../ui/Input'

interface StoreContactModalProps {
  storeName: string
  open: boolean
  onClose: () => void
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Demo contact form: it validates input but sends nothing. */
export default function StoreContactModal({
  storeName,
  open,
  onClose,
}: StoreContactModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [done, setDone] = useState(false)

  useDialog(open, onClose, panelRef)

  if (!open) return null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const next: FormErrors = {}
    if (name.trim() === '') next.name = 'Please enter your name.'
    if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Please enter a valid email address.'
    if (message.trim().length < 10) next.message = 'Please write at least 10 characters.'

    setErrors(next)
    if (Object.keys(next).length === 0) setDone(true)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-5">
      <div
        className="drawer-overlay absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        className="rise-in relative max-h-full w-full max-w-lg overflow-y-auto rounded-t-3xl border border-brand-border bg-surface p-6 sm:rounded-3xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="contact-title" className="font-display text-3xl font-semibold text-foreground">
            Contact {storeName}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close contact form"
            className="rounded-full p-2 text-foreground transition-colors hover:bg-surface-hover"
          >
            <X size={22} />
          </button>
        </div>

        {done ? (
          <div className="mt-6 text-center">
            <CheckCircle2 size={44} className="mx-auto text-accent" aria-hidden="true" />
            <p className="mt-4 text-base font-semibold text-foreground">
              Thanks, this is a preview.
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Messaging is not connected yet, so nothing was sent to the seller.
            </p>
            <Button className="mt-6" variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <Input
              id="contact-name"
              label="Your name"
              autoComplete="name"
              value={name}
              error={errors.name}
              onChange={(event) => setName(event.target.value)}
            />
            <Input
              id="contact-email"
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              error={errors.email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <div className="flex flex-col gap-2">
              <label htmlFor="contact-message" className="text-sm font-semibold text-foreground">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                className={`w-full resize-y rounded-xl border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 ${
                  errors.message ? 'border-danger' : 'border-brand-border'
                }`}
              />
              {errors.message && (
                <span id="contact-message-error" className="text-xs text-danger">
                  {errors.message}
                </span>
              )}
            </div>

            <p className="text-xs text-muted">
              Demo form: your message is not sent anywhere.
            </p>

            <Button type="submit" variant="secondary" fullWidth size="lg">
              Send message
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
