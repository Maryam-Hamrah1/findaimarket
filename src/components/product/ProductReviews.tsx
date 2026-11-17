import type { Product } from '../../types/product'
import type { ProductReviewSummary } from '../../types/productDetails'
import { formatFullDate, getInitials } from '../../utils/stores'
import { Stars } from '../ui/FilterControls'
import RatingSummary from '../ui/RatingSummary'

interface ProductReviewsProps {
  product: Product
  summary: ProductReviewSummary
}

export default function ProductReviews({ product, summary }: ProductReviewsProps) {
  const { breakdown, reviews } = summary

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-28">
      <h2 id="reviews-heading" className="font-display text-3xl font-medium text-foreground">
        Ratings &amp; reviews
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
        These are sample reviews for design preview, written to match the rating
        above. They are not feedback from real customers.
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[320px_1fr]">
        <RatingSummary
          average={product.rating}
          total={product.reviews}
          breakdown={breakdown}
        />

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-brand-border p-8 text-center text-sm text-muted">
              This product has no reviews yet.
            </p>
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-brand-border bg-surface p-5"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light font-display text-lg font-semibold text-accent"
                    aria-hidden="true"
                  >
                    {getInitials(review.author)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">{review.author}</h3>
                    <time dateTime={review.date} className="text-xs text-muted">
                      {formatFullDate(review.date)}
                    </time>
                  </div>

                  <div className="flex items-center gap-2">
                    <Stars count={review.rating} size={15} />
                    <span className="sr-only">{review.rating} out of 5 stars</span>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-7 text-muted">{review.text}</p>
              </article>
            ))
          )}

          {product.reviews > reviews.length && (
            <p className="text-center text-xs text-muted">
              Showing {reviews.length} of {product.reviews.toLocaleString('en')} sample reviews.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
