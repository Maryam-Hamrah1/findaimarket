import { Store as StoreIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function StoreNotFound() {
  return (
    <main className="px-5 py-24">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-accent">
          <StoreIcon size={30} strokeWidth={1.6} aria-hidden="true" />
        </div>

        <h1 className="mt-6 font-display text-4xl font-medium text-foreground sm:text-5xl">
          Store not found
        </h1>
        <p className="mt-3 text-base leading-7 text-muted">
          This store does not exist or may have moved. Check the link, or keep
          exploring products and stores from around the world.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/explore"
            className="inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover"
          >
            Back to Explore
          </Link>
          <Link
            to="/stores"
            className="inline-flex min-h-11 items-center rounded-full border border-brand-border px-6 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Browse all stores
          </Link>
        </div>
      </div>
    </main>
  )
}
