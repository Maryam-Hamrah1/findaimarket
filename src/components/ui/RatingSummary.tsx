import { Star } from 'lucide-react'
import type { RatingBreakdown } from '../../types/store'
import { Stars } from './FilterControls'

interface RatingSummaryProps {
  average: number
  total: number
  breakdown: RatingBreakdown
  /** Small print under the bars, e.g. a "sample data" notice */
  note?: string
}

/** Average rating, star count and the five-star distribution bars. */
export default function RatingSummary({
  average,
  total,
  breakdown,
  note,
}: RatingSummaryProps) {
  return (
    <section
      aria-label="Rating summary"
      className="self-start rounded-2xl border border-brand-border bg-surface p-6"
    >
      <p className="font-display text-6xl font-medium leading-none text-foreground">
        {average.toFixed(1)}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <Stars count={Math.round(average)} size={18} />
        <span className="sr-only">{average.toFixed(1)} out of 5 stars</span>
      </div>

      <p className="mt-2 text-sm text-muted">
        Based on {total.toLocaleString('en')} {total === 1 ? 'rating' : 'ratings'}
      </p>

      <ul className="mt-6 space-y-2.5">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = breakdown[stars - 1]
          const percent = total === 0 ? 0 : (count / total) * 100

          return (
            <li key={stars} className="flex items-center gap-3 text-xs text-muted">
              <span className="flex w-8 items-center gap-1 text-foreground">
                {stars}
                <Star size={12} className="fill-warning text-warning" aria-hidden="true" />
              </span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-hover">
                <span
                  className="block h-full rounded-full bg-accent"
                  style={{ width: `${percent}%` }}
                />
              </span>
              <span className="w-10 text-right">{count.toLocaleString('en')}</span>
            </li>
          )
        })}
      </ul>

      {note && <p className="mt-5 text-xs leading-5 text-muted">{note}</p>}
    </section>
  )
}
