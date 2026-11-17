import { getRatingBreakdown } from '../../data/stores'
import type { Store, StoreReview } from '../../types/store'
import { formatFullDate } from '../../utils/stores'
import { Stars } from '../ui/FilterControls'
import RatingSummary from '../ui/RatingSummary'

interface StoreReviewsProps {
  store: Store
  reviews: StoreReview[]
  /** Only the first N reviews are shown (used on the Home tab) */
  limit?: number
}

export function ReviewCard({ review }: { review: StoreReview }) {
  return (
    <article className="rounded-2xl border border-brand-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-foreground">{review.author}</h3>
        <time dateTime={review.date} className="text-xs text-muted">
          {formatFullDate(review.date)}
        </time>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Stars count={review.rating} size={15} />
        <span className="sr-only">{review.rating} out of 5 stars</span>
      </div>
      <p className="mt-3 text-sm leading-7 text-muted">{review.text}</p>
    </article>
  )
}

export default function StoreReviews({ store, reviews, limit }: StoreReviewsProps) {
  const breakdown = getRatingBreakdown(store.slug)
  const visible = limit === undefined ? reviews : reviews.slice(0, limit)

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <RatingSummary
        average={store.rating}
        total={store.reviewCount}
        breakdown={breakdown}
        note="Sample ratings for design preview. Reviews cannot be submitted yet."
      />

      <section aria-label="Customer reviews" className="space-y-4">
        {visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-brand-border p-8 text-center text-sm text-muted">
            This store has no reviews yet.
          </p>
        ) : (
          visible.map((review) => <ReviewCard key={review.id} review={review} />)
        )}
      </section>
    </div>
  )
}
