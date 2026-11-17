import type { CategoryId, Product } from './product'

/* ---------------------------------------------------------
   Store (shown in the directory and on the storefront header)
   --------------------------------------------------------- */

export interface Store {
  id: number
  /** URL-safe identifier used in /store/:slug */
  slug: string
  name: string
  description: string
  /** Image URL. An empty string shows a monogram instead. */
  logo: string
  /** Image URL. An empty string shows the brand background instead. */
  coverImage: string
  category: CategoryId
  country: string
  city: string
  /** Counted from the product catalogue, so it can never disagree with the storefront */
  productCount: number
  /** Calculated from the rating breakdown (1 decimal) */
  rating: number
  /** Sum of the rating breakdown */
  reviewCount: number
  followers: number
  verified: boolean
  /** ISO date (YYYY-MM-DD) */
  createdAt: string
}

/** Number of reviews per star: index 0 = 1 star ... index 4 = 5 stars */
export type RatingBreakdown = readonly [number, number, number, number, number]

/* ---------------------------------------------------------
   Stores directory (/stores)
   --------------------------------------------------------- */

export type StoreSortOption =
  | 'recommended'
  | 'popular'
  | 'rating'
  | 'newest'
  | 'products'

export interface StoreFilters {
  countries: string[]
  /** 0 means any rating */
  minRating: number
  verifiedOnly: boolean
  popularOnly: boolean
  newOnly: boolean
}

/* ---------------------------------------------------------
   Storefront (/store/:slug)
   --------------------------------------------------------- */

export type StoreTab = 'home' | 'products' | 'about' | 'reviews'

export interface StoreReview {
  id: string
  author: string
  /** 1 to 5 */
  rating: number
  /** ISO date (YYYY-MM-DD) */
  date: string
  text: string
}

export interface StoreSeller {
  name: string
  role: string
  bio: string
}

export interface StoreContactInfo {
  email: string
  phone?: string
  hours: string
}

export interface StorePolicies {
  shipping: string
  returns: string
  payments: string[]
}

export type SocialPlatform = 'instagram' | 'facebook' | 'x' | 'website'

export interface StoreSocialLink {
  platform: SocialPlatform
  url: string
}

/** Everything the storefront shows beyond the basic Store fields. */
export interface StoreDetails {
  slug: string
  /** Story paragraphs, in reading order */
  story: string[]
  seller: StoreSeller
  /** Only shown when provided */
  established?: number
  contact: StoreContactInfo
  policies: StorePolicies
  socials: StoreSocialLink[]
  reviews: StoreReview[]
}

/** A catalogue product plus the store's own category for it (e.g. "Bags"). */
export interface StoreProduct extends Product {
  section: string
}

export interface StoreSection {
  name: string
  count: number
}
