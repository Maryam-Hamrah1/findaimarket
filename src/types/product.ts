export type CategoryId =
  | 'fashion'
  | 'electronics'
  | 'accessories'
  | 'home-living'
  | 'beauty'
  | 'sports'

export type CategoryFilter = CategoryId | 'all'

export type Condition = 'new' | 'used'

export type Availability = 'in-stock' | 'out-of-stock'

export type SortOption =
  | 'recommended'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'popular'
  | 'best-match'

export interface Product {
  id: number
  name: string
  category: CategoryId
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  image: string
  store: string
  location: string
  condition: Condition
  inStock: boolean
  isNew?: boolean
  isFeatured?: boolean
  /** Units sold, used for popularity ranking */
  sales: number
  /** Product page views, used for popularity ranking */
  views: number
  /** ISO date (YYYY-MM-DD) */
  addedAt: string
  /** Words the AI search can match besides the name */
  tags: string[]
}

export interface ProductFilters {
  minPrice: number | null
  maxPrice: number | null
  /** 0 means any rating */
  minRating: number
  availability: Availability[]
  conditions: Condition[]
  locations: string[]
}

export interface ParsedQuery {
  keywords: string[]
  minPrice: number | null
  maxPrice: number | null
}

export interface ScoredProduct {
  product: Product
  score: number
}
