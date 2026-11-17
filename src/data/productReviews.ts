import type { CategoryId, Product } from '../types/product'
import type { ProductReview, ProductReviewSummary } from '../types/productDetails'
import type { RatingBreakdown } from '../types/store'

/*
  Sample reviews (mock data). They are generated from the product's own rating
  and review count, so the numbers on the page always agree with the catalogue.
  They are NOT real customer feedback and the page says so.
*/

const REVIEW_LIMIT = 5
const LATEST_DATE = '2026-11-16'

const NAMES = [
  'Sara M.', 'Daniel K.', 'Yuki T.', 'Elena R.', 'Omar H.', 'Lina P.',
  'Marcus W.', 'Aisha B.', 'Tom V.', 'Nora S.', 'Ivan D.', 'Mia C.',
]

const TEXTS: Record<CategoryId, { good: string[]; mixed: string[] }> = {
  fashion: {
    good: [
      'The fabric feels well made and the fit is true to size.',
      'Looks even better in person. I have worn it every week since it arrived.',
      'Great quality for the price, and it was packed with care.',
    ],
    mixed: ['Nice piece overall, though the colour was slightly different from the photos.'],
  },
  electronics: {
    good: [
      'Works exactly as described and setup took a couple of minutes.',
      'Solid build and it has been reliable from day one.',
      'Very happy with the performance for this price.',
    ],
    mixed: ['Does the job well, but the manual could be clearer.'],
  },
  accessories: {
    good: [
      'Beautiful finish and it feels more expensive than it is.',
      'A lovely gift, the recipient was delighted.',
      'Small details are done really well.',
    ],
    mixed: ['Good quality, but it is a little smaller than I expected.'],
  },
  'home-living': {
    good: [
      'Fits our space perfectly and the quality is clear as soon as you hold it.',
      'A calm, simple design that goes with everything.',
      'Well packed, and it arrived without a scratch.',
    ],
    mixed: ['Lovely product, delivery took a little longer than the estimate.'],
  },
  beauty: {
    good: [
      'Gentle on my skin, and I noticed a difference after a couple of weeks.',
      'The scent is subtle and the texture is lovely.',
      'I have already bought a second one.',
    ],
    mixed: ['It works fine, but the effect was milder than I hoped.'],
  },
  sports: {
    good: [
      'Comfortable from the first use and it holds up well to regular training.',
      'Exactly what I needed for my weekly routine.',
      'Good grip and a sturdy build.',
    ],
    mixed: ['Good value, though the sizing runs a little small.'],
  },
}

/* ---------- Rating breakdown ---------- */

/** Average of a breakdown, for checking it matches the catalogue. */
function mean(weights: readonly number[]): number {
  const total = weights.reduce((sum, w) => sum + w, 0)
  return weights.reduce((sum, w, index) => sum + w * (index + 1), 0) / total
}

/**
 * Spreads `total` reviews over 1 to 5 stars so that their average matches
 * `rating`. Same input always gives the same output.
 */
export function getProductBreakdown(rating: number, total: number): RatingBreakdown {
  if (total <= 0) return [0, 0, 0, 0, 0]

  const target = Math.min(4.95, Math.max(1.05, rating))

  // Weights grow like exp(k * s). Find s so the average equals the target.
  const weightsFor = (s: number): number[] =>
    [1, 2, 3, 4, 5].map((star) => Math.exp(s * star))

  let low = 0
  let high = 8

  for (let step = 0; step < 50; step += 1) {
    const mid = (low + high) / 2
    if (mean(weightsFor(mid)) < target) low = mid
    else high = mid
  }

  const weights = weightsFor((low + high) / 2)
  const weightSum = weights.reduce((sum, w) => sum + w, 0)
  const exact = weights.map((w) => (w / weightSum) * total)

  // Largest remainder rounding keeps the counts adding up to `total`
  const counts = exact.map(Math.floor)
  let left = total - counts.reduce((sum, c) => sum + c, 0)

  const order = exact
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder)

  for (const { index } of order) {
    if (left === 0) break
    counts[index] += 1
    left -= 1
  }

  return [counts[0], counts[1], counts[2], counts[3], counts[4]]
}

/* ---------- Sample review cards ---------- */

function starAtQuantile(breakdown: RatingBreakdown, quantile: number): number {
  const total = breakdown.reduce((sum, c) => sum + c, 0)
  let seen = 0

  for (let star = 5; star >= 1; star -= 1) {
    seen += breakdown[star - 1]
    if (seen / total >= quantile) return star
  }

  return 1
}

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  const result = date.toISOString().slice(0, 10)
  return result > LATEST_DATE ? LATEST_DATE : result
}

const QUANTILES = [0.1, 0.35, 0.55, 0.8, 0.97]

export function getProductReviewSummary(product: Product): ProductReviewSummary {
  const breakdown = getProductBreakdown(product.rating, product.reviews)
  const count = Math.min(REVIEW_LIMIT, product.reviews)
  const texts = TEXTS[product.category]

  const reviews: ProductReview[] = []

  for (let index = 0; index < count; index += 1) {
    const rating = starAtQuantile(breakdown, QUANTILES[index])
    const pool = rating >= 4 ? texts.good : texts.mixed

    reviews.push({
      id: `${product.id}-${index}`,
      author: NAMES[(product.id * 3 + index * 5) % NAMES.length],
      rating,
      date: addDays(product.addedAt, 6 + index * 9 + (product.id % 4)),
      text: pool[(product.id + index) % pool.length],
    })
  }

  return {
    breakdown,
    reviews: reviews.sort((a, b) => b.date.localeCompare(a.date)),
  }
}
