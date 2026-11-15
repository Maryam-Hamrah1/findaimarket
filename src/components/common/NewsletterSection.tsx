import { useState, type FormEvent } from 'react'
import { ArrowRight, Mail } from 'lucide-react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim()) return

    console.log('Newsletter subscription:', email)
    alert('Thank you for subscribing!')
    setEmail('')
  }

  return (
    <section className="px-5 py-16">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-brand-border bg-surface px-6 py-12 sm:px-12">
        <div className="mx-auto max-w-2xl text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-on-accent">
            <Mail size={25} />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Stay Connected
          </p>

          <h2 className="mt-3 font-display text-4xl font-medium text-foreground sm:text-5xl">
            Discover More. Stay Inspired.
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
            Subscribe to our newsletter and be the first to discover
            new products, exciting collections, and special offers.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-3xl border border-brand-border bg-background p-2 sm:flex-row sm:rounded-full sm:pl-4"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              aria-label="Email address"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted"
            />

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-on-accent transition-colors hover:bg-accent-hover"
            >
              Subscribe
              <ArrowRight size={17} />
            </button>
          </form>

          <p className="mt-4 text-xs text-muted">
            No spam. Unsubscribe whenever you want.
          </p>

        </div>
      </div>
    </section>
  )
}
