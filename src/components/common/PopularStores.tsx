import { ArrowRight, BadgeCheck, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getStoreBySlug } from '../../data/stores'
import { getStoreCategoryLabel } from '../../utils/stores'
import type { Store } from '../../types/store'
import CoverImage from '../ui/CoverImage'
import SectionHeading from '../ui/SectionHeading'
import StoreLogo from '../ui/StoreLogo'

const FEATURED_SLUGS = ['modern-style', 'tech-haven', 'home-essence']

const featuredStores: Store[] = FEATURED_SLUGS.flatMap((slug) => {
  const store = getStoreBySlug(slug)
  return store ? [store] : []
})

export default function PopularStores() {
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Independent Stores"
          title="Real shops, one marketplace"
          description="Explore independent stores and discover their unique collections."
          linkText="Explore All Stores"
          linkTo="/stores"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredStores.map((store) => (
            <article
              key={store.id}
              className="group relative overflow-hidden rounded-3xl border border-brand-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-card"
            >
              <CoverImage src={store.coverImage} className="h-48" />

              <div className="px-5 pb-5">
                <StoreLogo name={store.name} logo={store.logo} className="-mt-10" />

                <h3 className="mt-3 flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
                  {store.name}
                  {store.verified && (
                    <span className="text-accent" title="Verified store">
                      <BadgeCheck size={20} aria-hidden="true" />
                      <span className="sr-only">Verified store</span>
                    </span>
                  )}
                </h3>

                <p className="mt-1 text-sm text-muted">{getStoreCategoryLabel(store)}</p>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-brand-border pt-4">
                  <span className="flex items-center gap-1.5 text-xs text-muted">
                    <MapPin size={15} aria-hidden="true" />
                    {store.country}
                  </span>

                  <Link
                    to={`/store/${store.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-foreground after:absolute after:inset-0 after:content-[''] hover:text-accent"
                  >
                    Visit Store
                    <span className="sr-only"> {store.name}</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
