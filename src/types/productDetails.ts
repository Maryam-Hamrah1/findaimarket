import type { RatingBreakdown } from './store'

/** One choice of an option, e.g. "M" for Size. */
export interface ProductOptionValue {
  value: string
  /** false shows the choice greyed out and not selectable */
  available: boolean
}

/** A variation the shopper picks before buying (Size, Color, Material...). */
export interface ProductOption {
  id: string
  label: string
  values: ProductOptionValue[]
}

export interface ProductImage {
  /** Image used in the page */
  src: string
  /** Larger version used by the lightbox */
  full: string
  alt: string
}

export interface ProductVideo {
  src: string
  poster?: string
}

export interface ProductSpec {
  label: string
  value: string
}

/** Everything the product page shows beyond the catalogue entry. */
export interface ProductDetails {
  sku: string
  /** Only shown when provided */
  brand?: string
  summary: string
  features: string[]
  specs: ProductSpec[]
  /** Empty when the product has no variations */
  options: ProductOption[]
  /** Always has at least one entry; an empty list means "no photo yet" */
  gallery: ProductImage[]
  video?: ProductVideo
  /** Units available (sample value). 0 means sold out. */
  stock: number
  /** Taken from the seller's store policy unless the product has its own */
  shipping?: string
  returns?: string
}

export interface ProductReview {
  id: string
  author: string
  /** 1 to 5 */
  rating: number
  /** ISO date (YYYY-MM-DD) */
  date: string
  text: string
}

export interface ProductReviewSummary {
  breakdown: RatingBreakdown
  reviews: ProductReview[]
}
