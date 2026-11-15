import { ArrowRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from '../ui/SectionHeading'

const stores = [
  {
    id: 1,
    name: 'Modern Style',
    category: 'Fashion & Accessories',
    location: 'United Kingdom',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  },
  {
    id: 2,
    name: 'Tech Haven',
    category: 'Electronics & Gadgets',
    location: 'United States',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600',
    logo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
  },
  {
    id: 3,
    name: 'Home Essence',
    category: 'Home & Living',
    location: 'Germany',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600',
    logo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
  },
]

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

        {/* Store Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <article
              key={store.id}
              className="group overflow-hidden rounded-3xl border border-brand-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-card"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={store.image}
                  alt={store.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="relative px-5 pb-5">
                <img
                  src={store.logo}
                  alt={`${store.name} logo`}
                  className="-mt-10 h-16 w-16 rounded-xl border-4 border-surface object-cover shadow-card"
                />

                <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">
                  {store.name}
                </h3>

                <p className="mt-1 text-sm text-muted">
                  {store.category}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-brand-border pt-4">
                  <span className="flex items-center gap-1.5 text-xs text-muted">
                    <MapPin size={15} />
                    {store.location}
                  </span>

                  <Link
                    to={`/store/${store.id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-accent"
                  >
                    Visit Store
                    <ArrowRight size={15} />
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
