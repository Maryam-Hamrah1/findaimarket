import { ExternalLink, Store } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AccountLayout from '../components/account/AccountLayout'
import Badge from '../components/ui/Badge'
import StoreLogo from '../components/ui/StoreLogo'
import { getCountry } from '../data/countries'
import { useMyStore } from '../hooks/useStores'
import { STORE_CATEGORY_OPTIONS } from '../utils/onboarding'
import { getStoreCategoryLabel } from '../utils/stores'

/** The seller's own store: a summary of what they submitted and links to it. */
export default function AccountStorePage() {
  const record = useMyStore()

  useEffect(() => {
    document.title = 'My store · Findaimarket'
  }, [])

  if (!record) {
    return (
      <AccountLayout title="My store">
        <div className="rounded-2xl border border-brand-border bg-surface px-6 py-14 text-center">
          <Store size={34} className="mx-auto text-accent" aria-hidden="true" />
          <h2 className="mt-4 font-display text-2xl font-medium text-foreground">You have not set up a store yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            It takes about five minutes. Your progress is saved as you go.
          </p>
          <Link
            to="/seller/onboarding"
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-sm font-bold text-on-accent hover:bg-accent-hover"
          >
            Set up my store
          </Link>
        </div>
      </AccountLayout>
    )
  }

  const { store, profile } = record
  const categoryLabel = STORE_CATEGORY_OPTIONS.find((option) => option.value === profile.category)?.label ?? getStoreCategoryLabel(store)
  const rows: ReadonlyArray<[string, string]> = [
    ['Category', categoryLabel],
    ['Business type', profile.businessType],
    ['Location', `${profile.city}, ${getCountry(profile.country)?.name ?? profile.country}`],
    ['Business email', profile.email],
    ['Support email', profile.supportEmail],
    ['Processing time', profile.processingTime],
    ['Created', store.createdAt],
  ]

  return (
    <AccountLayout title="My store">
      <div className="space-y-6">
        <section className="rounded-2xl border border-brand-border bg-surface p-6 shadow-card">
          <div className="flex flex-wrap items-center gap-4">
            <StoreLogo name={store.name} logo={store.logo} size="md" />
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl font-medium text-foreground">{store.name}</h2>
              <p className="mt-1 text-sm text-muted">/store/{store.slug}</p>
            </div>
            <Badge>Demo store</Badge>
          </div>

          <p className="mt-4 text-sm leading-6 text-muted">{store.description}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to={`/store/${store.slug}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-on-accent hover:bg-accent-hover"
            >
              View my store
              <ExternalLink size={16} aria-hidden="true" />
            </Link>
            <Link
              to="/seller/dashboard"
              className="inline-flex min-h-11 items-center rounded-full border border-brand-border px-6 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
            >
              Seller dashboard
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-brand-border bg-surface p-6">
          <h2 className="font-display text-2xl font-medium text-foreground">Store details</h2>
          <dl className="mt-4 grid gap-5 text-sm sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt className="text-muted">{label}</dt>
                <dd className="mt-1 break-words font-semibold text-foreground">{value || '—'}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="text-xs leading-5 text-muted">
          Demo only: this store is saved in this browser. It is not verified and other people cannot see it.
          Editing store details and adding products will come later.
        </p>
      </div>
    </AccountLayout>
  )
}
