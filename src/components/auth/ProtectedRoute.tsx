import { ShieldAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import type { UserRole } from '../../types/auth'

interface ProtectedRouteProps {
  children: ReactNode
  /** Only people with this role may see the page */
  role?: UserRole
}

/** Guests go to the login page and return here afterwards. */
export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, hasRole } = useAuth()
  const location = useLocation()

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: `${location.pathname}${location.search}`,
          notice: 'Please sign in to continue.',
        }}
      />
    )
  }

  if (role && !hasRole(role)) {
    return (
      <main className="px-5 py-24">
        <div className="mx-auto max-w-md text-center">
          <ShieldAlert size={36} className="mx-auto text-accent" aria-hidden="true" />
          <h1 className="mt-4 font-display text-4xl font-medium text-foreground">
            Seller account needed
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            This area is only for seller accounts. Your account is a buyer account.
          </p>
          <Link
            to="/account"
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-sm font-bold text-on-accent hover:bg-accent-hover"
          >
            Back to my account
          </Link>
        </div>
      </main>
    )
  }

  return <>{children}</>
}
