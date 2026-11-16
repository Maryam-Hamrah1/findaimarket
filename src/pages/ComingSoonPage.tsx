import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

/** Placeholder for pages that are not built yet, so no link leads to a blank screen. */
export default function ComingSoonPage() {
  return (
    <main className="px-5 py-28">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Coming soon
        </p>

        <h1 className="mt-4 font-display text-5xl font-medium text-foreground">
          This page is on its way
        </h1>

        <p className="mt-4 text-base leading-7 text-muted">
          We are building Findaimarket one page at a time.
        </p>

        <Link
          to="/explore"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-on-accent transition-colors hover:bg-accent-hover"
        >
          <ArrowLeft size={18} />
          Explore products
        </Link>
      </div>
    </main>
  )
}
