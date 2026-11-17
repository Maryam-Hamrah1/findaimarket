import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

/** Centred card used by the login, register and forgot-password pages. */
export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <main className="px-5 py-12 sm:py-16">
      <div className="fade-in mx-auto w-full max-w-md">
        <Link
          to="/"
          className="mb-8 block text-center text-2xl font-extrabold tracking-tight text-foreground"
        >
          find<span className="text-accent">ai</span>market
        </Link>

        <div className="rounded-3xl border border-brand-border bg-surface p-6 shadow-card sm:p-8">
          <h1 className="font-display text-3xl font-medium text-foreground">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>

          <div className="mt-6">{children}</div>
        </div>

        {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
      </div>
    </main>
  )
}
