import type { RatingBreakdown, Store } from '../types/store'
import type { CategoryMeta } from './categories'
import { PRODUCTS } from './products'

/*
  Sample stores (mock data, no backend yet).
  These are NOT real registered stores: names, numbers and dates are invented
  for the design preview. Delete this file's content when real stores exist.

  Store names match the `store` field of every product in data/products.ts,
  which is how a storefront finds its products.
*/

export const SAMPLE_DATA_NOTICE =
  'Sample data for design preview. These are not real stores.'

const cover = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1200&q=75`

/** Reviews per star: [1 star, 2 stars, 3 stars, 4 stars, 5 stars] */
const RATING_BREAKDOWNS: Readonly<Record<string, RatingBreakdown>> = {
  'modern-style': [3, 4, 12, 53, 240],
  'tech-haven': [5, 7, 20, 104, 350],
  'home-essence': [0, 1, 2, 18, 133],
  'atelier-nord': [2, 3, 9, 41, 128],
  'casa-luna': [1, 2, 7, 30, 81],
  'urban-thread': [3, 4, 10, 27, 56],
  'peak-and-pace': [4, 8, 24, 96, 243],
  'kobo-studio': [0, 1, 3, 12, 48],
  'lumiere-atelier': [0, 0, 2, 9, 25],
  'lumiere-beaute': [2, 5, 15, 70, 208],
}

type StoreSeed = Omit<Store, 'productCount' | 'rating' | 'reviewCount'>

const SEEDS: StoreSeed[] = [
  {
    id: 1, slug: 'modern-style', name: 'Modern Style',
    description: 'Timeless leather bags and everyday accessories, designed in London and made to last.',
    logo: '', coverImage: cover('1441986300917-64674bd600d8'),
    category: 'fashion', country: 'United Kingdom', city: 'London',
    followers: 18400, verified: true, createdAt: '2025-03-14',
  },
  {
    id: 2, slug: 'tech-haven', name: 'Tech Haven',
    description: 'Carefully tested gadgets and audio gear for people who like technology that just works.',
    logo: '', coverImage: cover('1498049794561-7780e7231661'),
    category: 'electronics', country: 'United States', city: 'Austin',
    followers: 25300, verified: true, createdAt: '2024-11-02',
  },
  {
    id: 3, slug: 'home-essence', name: 'Home Essence',
    description: 'Warm lighting, natural scents and simple furniture for calm, lived-in homes.',
    logo: '', coverImage: cover('1600210492486-724fe5c67fb0'),
    category: 'home-living', country: 'Germany', city: 'Hamburg',
    followers: 9200, verified: false, createdAt: '2025-06-21',
  },
  {
    id: 4, slug: 'atelier-nord', name: 'Atelier Nord',
    description: 'Scandinavian knitwear and wardrobe essentials in natural, responsibly sourced fabrics.',
    logo: '', coverImage: '',
    category: 'fashion', country: 'Sweden', city: 'Stockholm',
    followers: 7800, verified: true, createdAt: '2025-09-09',
  },
  {
    id: 5, slug: 'casa-luna', name: 'Casa Luna',
    description: 'A Spanish concept store: linen, ceramics, brass lighting and small-batch self-care.',
    logo: '', coverImage: '',
    category: 'home-living', country: 'Spain', city: 'Valencia',
    followers: 5100, verified: false, createdAt: '2026-02-17',
  },
  {
    id: 6, slug: 'urban-thread', name: 'Urban Thread',
    description: 'Vintage-inspired streetwear, denim and leather goods with an easy city feel.',
    logo: '', coverImage: cover('1491553895911-0055eca6402d'),
    category: 'fashion', country: 'United States', city: 'Portland',
    followers: 3600, verified: false, createdAt: '2026-05-30',
  },
  {
    id: 7, slug: 'peak-and-pace', name: 'Peak & Pace',
    description: 'Running, training and trail gear from Vancouver, tested on real mountains and roads.',
    logo: '', coverImage: cover('1542291026-7eec264c27ff'),
    category: 'sports', country: 'Canada', city: 'Vancouver',
    followers: 14100, verified: true, createdAt: '2025-01-25',
  },
  {
    id: 8, slug: 'kobo-studio', name: 'Kōbō Studio',
    description: 'Small-run cameras, desk tools and ceramics from a Kyoto design workshop.',
    logo: '', coverImage: cover('1526170375885-4d8ecf77b99f'),
    category: 'home-living', country: 'Japan', city: 'Kyoto',
    followers: 6700, verified: true, createdAt: '2026-09-18',
  },
  {
    id: 9, slug: 'lumiere-atelier', name: 'Lumière Atelier',
    description: 'Hand-finished silver and gold-plated jewelry, designed in Lyon.',
    logo: '', coverImage: '',
    category: 'accessories', country: 'France', city: 'Lyon',
    followers: 2400, verified: false, createdAt: '2026-10-12',
  },
  {
    id: 10, slug: 'lumiere-beaute', name: 'Lumière Beauté',
    description: 'French skincare, fragrance and hair care built around simple, gentle formulas.',
    logo: '', coverImage: '',
    category: 'beauty', country: 'France', city: 'Paris',
    followers: 11900, verified: true, createdAt: '2025-08-04',
  },
]

const EMPTY_BREAKDOWN: RatingBreakdown = [0, 0, 0, 0, 0]

/** Average star rating, rounded to one decimal. 0 when there are no reviews. */
export function getAverageRating(breakdown: RatingBreakdown): number {
  const total = breakdown.reduce((sum, count) => sum + count, 0)
  if (total === 0) return 0

  const points = breakdown.reduce((sum, count, index) => sum + count * (index + 1), 0)
  return Math.round((points / total) * 10) / 10
}

export function getRatingBreakdown(slug: string): RatingBreakdown {
  return RATING_BREAKDOWNS[slug] ?? EMPTY_BREAKDOWN
}

export const STORES: ReadonlyArray<Store> = SEEDS.map((seed) => {
  const breakdown = getRatingBreakdown(seed.slug)

  return {
    ...seed,
    productCount: PRODUCTS.filter((product) => product.store === seed.name).length,
    rating: getAverageRating(breakdown),
    reviewCount: breakdown.reduce((sum, count) => sum + count, 0),
  }
})

export function getStoreBySlug(slug: string | undefined): Store | undefined {
  return slug === undefined ? undefined : STORES.find((store) => store.slug === slug)
}

export function getStoreByName(name: string): Store | undefined {
  return STORES.find((store) => store.name === name)
}

/** Category tabs of the directory, in the order the design uses. */
export const STORE_CATEGORY_ITEMS: ReadonlyArray<CategoryMeta> = [
  { id: 'all', name: 'All Stores' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'home-living', name: 'Home & Living' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'sports', name: 'Sports' },
]
