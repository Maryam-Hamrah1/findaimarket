import { Store } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/** Placeholder: the real seller dashboard is a later task. */
export default function SellerDashboardPage() {
  const { user } = useAuth()

  useEffect(() => {
    document.title = 'Seller dashboard · Findaimarket'
  }, [])

  return (
    <main className="px-5 py-24">
      <div className="mx-auto max-w-lg text-center">
        <Store size={36} className="mx-auto text-accent" aria-hidden="true" />
        <h1 className="mt-4 font-display text-4xl font-medium text-foreground">
          Welcome{user ? `, ${user.fullName.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Your seller account is ready. Store setup, products and sales tools are coming in a later
          step. Nothing here is live yet.
        </p>
        <Link to="/account" className="mt-6 inline-flex min-h-11 items-center rounded-full border border-brand-border px-6 text-sm font-semibold text-foreground hover:border-accent hover:text-accent">
          Go to my account
        </Link>
      </div>
    </main>
  )
}
