import { ArrowRight, Store, Globe, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SellerBanner() {
  return (
    <section className="px-5 py-20">
      <div className="bg-cta relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-brand-border px-7 py-14 sm:px-12 lg:px-16">

        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-brand-border" />
        <div className="absolute -bottom-32 right-40 h-80 w-80 rounded-full border border-brand-border" />

        <div className="relative grid items-center gap-10 md:grid-cols-2">

          {/* Content */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-border bg-glass px-4 py-2 text-sm font-medium text-foreground">
              <Store size={17} className="text-accent" />
              For Independent Sellers
            </div>

            <h2 className="max-w-xl font-display text-4xl font-medium leading-tight text-foreground sm:text-5xl">
              Have a store?
              <span className="block italic text-accent">
                Bring it to Findaimarket.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-foreground/75 sm:text-base">
              Connect your existing shop and get your own store page
              here, plus a personal link to promote it anywhere.
            </p>

            <Link
              to="/seller/register"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-on-accent transition-colors hover:bg-accent-hover"
            >
              Open your store
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Benefits */}
          <div className="grid gap-4 sm:grid-cols-2">

            <div className="rounded-3xl border border-brand-border bg-glass p-6 backdrop-blur-md">
              <Globe size={28} className="text-accent" />

              <h3 className="mt-5 text-lg font-bold text-foreground">
                Global Reach
              </h3>

              <p className="mt-2 text-sm leading-6 text-foreground/70">
                Make your products visible to customers around the world.
              </p>
            </div>

            <div className="rounded-3xl border border-brand-border bg-glass p-6 backdrop-blur-md sm:translate-y-8">
              <TrendingUp size={28} className="text-accent" />

              <h3 className="mt-5 text-lg font-bold text-foreground">
                Grow Your Business
              </h3>

              <p className="mt-2 text-sm leading-6 text-foreground/70">
                Manage your products and build your online presence.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
