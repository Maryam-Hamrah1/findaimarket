import { ArrowRight } from 'lucide-react'
import type {
  Store,
  StoreDetails,
  StoreProduct,
  StoreSection,
  StoreTab,
} from '../../types/store'
import { getEngagementScore } from '../../utils/products'
import ProductGrid from '../explore/ProductGrid'
import Button from '../ui/Button'
import StoreCategories from './StoreCategories'
import { ReviewCard } from './StoreReviews'

const FEATURED_COUNT = 4
const REVIEW_PREVIEW = 2

interface StoreHomeProps {
  store: Store
  details: StoreDetails
  products: StoreProduct[]
  sections: StoreSection[]
  onOpenTab: (tab: StoreTab) => void
  onOpenSection: (section: string) => void
}

export default function StoreHome({
  store,
  details,
  products,
  sections,
  onOpenTab,
  onOpenSection,
}: StoreHomeProps) {
  const featured = [...products]
    .sort((a, b) => getEngagementScore(b) - getEngagementScore(a))
    .slice(0, FEATURED_COUNT)

  return (
    <div className="space-y-14">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
          Welcome to {store.name}
        </p>
        <p className="mt-3 font-display text-2xl leading-9 text-foreground sm:text-3xl sm:leading-10">
          {details.story[0]}
        </p>
        <button
          type="button"
          onClick={() => onOpenTab('about')}
          className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover"
        >
          Read the full story
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </section>

      {sections.length > 0 && (
        <section aria-labelledby="store-home-categories">
          <h2
            id="store-home-categories"
            className="font-display text-3xl font-medium text-foreground"
          >
            Shop by category
          </h2>
          <div className="mt-5">
            <StoreCategories
              sections={sections}
              variant="cards"
              onSelect={(section) => section !== null && onOpenSection(section)}
            />
          </div>
        </section>
      )}

      <section aria-labelledby="store-home-featured">
        <div className="flex items-end justify-between gap-4">
          <h2
            id="store-home-featured"
            className="font-display text-3xl font-medium text-foreground"
          >
            Featured products
          </h2>
          <Button variant="outline" size="sm" onClick={() => onOpenTab('products')}>
            View all {products.length}
          </Button>
        </div>

        {featured.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-dashed border-brand-border p-8 text-center text-sm text-muted">
            This store has not listed any products yet.
          </p>
        ) : (
          <ProductGrid products={featured} showStore={false} />
        )}
      </section>

      {details.reviews.length > 0 && (
        <section aria-labelledby="store-home-reviews">
          <div className="flex items-end justify-between gap-4">
            <h2
              id="store-home-reviews"
              className="font-display text-3xl font-medium text-foreground"
            >
              What customers say
            </h2>
            <Button variant="outline" size="sm" onClick={() => onOpenTab('reviews')}>
              All reviews
            </Button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {details.reviews.slice(0, REVIEW_PREVIEW).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
