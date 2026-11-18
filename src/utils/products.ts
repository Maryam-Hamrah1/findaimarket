import type {
  Availability,
  CategoryFilter,
  ParsedQuery,
  Product,
  ProductFilters,
  ScoredProduct,
  SortOption,
} from '../types/product'

export const PAGE_SIZE = 12

export const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
]

/* ---------------------------------------------------------
   Popularity: what shoppers actually do (buy, read, review)
   --------------------------------------------------------- */

export function getEngagementScore(product: Product): number {
  return product.sales * 5 + product.reviews * 2 + product.views * 0.1
}

function getRecommendedScore(product: Product): number {
  return (
    product.rating * Math.log10(product.reviews + 10) +
    (product.isFeatured ? 1.5 : 0) +
    (product.isNew ? 0.3 : 0)
  )
}

/* ---------------------------------------------------------
   Natural-language query understanding (local stand-in for the
   AI service: keywords + budget). The real AI replaces this later.
   --------------------------------------------------------- */

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'for', 'my', 'me', 'to', 'of', 'with', 'in', 'on', 'and', 'or',
  'i', 'we', 'want', 'need', 'looking', 'look', 'find', 'show', 'something', 'that',
  'is', 'are', 'it', 'its', 'some', 'good', 'best', 'nice', 'please', 'can', 'you',
  'get', 'buy', 'would', 'like', 'have', 'has', 'by', 'at', 'from', 'as', 'be',
  'under', 'below', 'over', 'above', 'than', 'less', 'more', 'up', 'around', 'about',
  'budget', 'max', 'maximum', 'price', 'who', 'loves', 'love',
])

const SYNONYMS: Record<string, string[]> = {
  present: ['gift'],
  mom: ['mother'],
  mum: ['mother'],
  dad: ['father'],
  sneaker: ['shoe'],
  trainer: ['shoe'],
  runner: ['running'],
  cozy: ['warm'],
  cosy: ['warm'],
  espresso: ['coffee'],
  brew: ['coffee'],
  lamp: ['light'],
  tshirt: ['tee'],
}

function stem(word: string): string {
  if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1)
  return word
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map(stem)
}

export function parseQuery(raw: string): ParsedQuery {
  let text = raw.toLowerCase()
  let minPrice: number | null = null
  let maxPrice: number | null = null

  const maxMatch = text.match(
    /(?:under|below|less than|up to|within|max(?:imum)?(?: of)?)\s*\$?\s*(\d+(?:\.\d+)?)/,
  )
  if (maxMatch) {
    maxPrice = Number(maxMatch[1])
    text = text.replace(maxMatch[0], ' ')
  }

  const minMatch = text.match(
    /(?:over|above|more than|at least|from)\s*\$?\s*(\d+(?:\.\d+)?)/,
  )
  if (minMatch) {
    minPrice = Number(minMatch[1])
    text = text.replace(minMatch[0], ' ')
  }

  const keywords = Array.from(
    new Set(
      tokenize(text).filter(
        (word) => word.length > 1 && !STOP_WORDS.has(word) && !/^\d+$/.test(word),
      ),
    ),
  )

  return { keywords, minPrice, maxPrice }
}

function tokenMatches(token: string, keyword: string): boolean {
  return (
    token === keyword ||
    (keyword.length >= 4 && token.startsWith(keyword)) ||
    (token.length >= 4 && keyword.startsWith(token))
  )
}

function scoreProduct(product: Product, keywords: string[]): number {
  const nameTokens = tokenize(product.name)
  const tagTokens = product.tags.flatMap(tokenize)
  const metaTokens = tokenize(
    `${product.category.replace('-', ' ')} ${product.store} ${product.location}`,
  )

  let total = 0

  for (const keyword of keywords) {
    const variants: Array<{ word: string; weight: number }> = [
      { word: keyword, weight: 1 },
      ...(SYNONYMS[keyword] ?? []).map((word) => ({ word, weight: 0.7 })),
    ]

    let best = 0
    for (const { word, weight } of variants) {
      if (nameTokens.some((token) => tokenMatches(token, word))) {
        best = Math.max(best, 4 * weight)
      } else if (tagTokens.some((token) => tokenMatches(token, word))) {
        best = Math.max(best, 3 * weight)
      } else if (metaTokens.some((token) => tokenMatches(token, word))) {
        best = Math.max(best, 1.5 * weight)
      }
    }
    total += best
  }

  return total
}

/** Returns the products that fit the request, best fit first. */
export function matchProducts(products: readonly Product[], parsed: ParsedQuery): ScoredProduct[] {
  const inBudget = products.filter(
    (product) =>
      (parsed.minPrice === null || product.price >= parsed.minPrice) &&
      (parsed.maxPrice === null || product.price <= parsed.maxPrice),
  )

  if (parsed.keywords.length === 0) {
    return inBudget.map((product) => ({ product, score: 0 }))
  }

  const scored = inBudget
    .map((product) => ({ product, score: scoreProduct(product, parsed.keywords) }))
    .filter((item) => item.score > 0)

  if (scored.length === 0) return []

  const top = Math.max(...scored.map((item) => item.score))

  return scored
    .filter((item) => item.score >= top * 0.3)
    .sort(
      (a, b) =>
        b.score - a.score ||
        getEngagementScore(b.product) - getEngagementScore(a.product),
    )
}

/* ---------------------------------------------------------
   Filtering, sorting, counting
   --------------------------------------------------------- */

export function filterProducts(
  products: readonly Product[],
  filters: ProductFilters,
  category: CategoryFilter,
): Product[] {
  return products.filter((product) => {
    if (category !== 'all' && product.category !== category) return false
    if (filters.minPrice !== null && product.price < filters.minPrice) return false
    if (filters.maxPrice !== null && product.price > filters.maxPrice) return false
    if (filters.minRating > 0 && product.rating < filters.minRating) return false

    if (filters.availability.length > 0) {
      const status: Availability = product.inStock ? 'in-stock' : 'out-of-stock'
      if (!filters.availability.includes(status)) return false
    }

    if (filters.conditions.length > 0 && !filters.conditions.includes(product.condition)) {
      return false
    }

    if (filters.locations.length > 0 && !filters.locations.includes(product.location)) {
      return false
    }

    return true
  })
}

export function sortProducts(
  products: readonly Product[],
  sort: SortOption,
  scores: Map<number, number>,
): Product[] {
  const list = [...products]

  switch (sort) {
    case 'best-match':
      return list.sort(
        (a, b) =>
          (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0) ||
          getEngagementScore(b) - getEngagementScore(a),
      )
    case 'newest':
      return list.sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price)
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    case 'recommended':
      return list.sort((a, b) => getRecommendedScore(b) - getRecommendedScore(a))
    case 'popular':
    default:
      return list.sort((a, b) => getEngagementScore(b) - getEngagementScore(a))
  }
}

export function countByCategory(products: readonly Product[]): Record<CategoryFilter, number> {
  const counts: Record<CategoryFilter, number> = {
    all: products.length,
    fashion: 0,
    electronics: 0,
    accessories: 0,
    'home-living': 0,
    beauty: 0,
    sports: 0,
  }

  for (const product of products) {
    counts[product.category] += 1
  }

  return counts
}

export function getLocations(products: readonly Product[]): string[] {
  return Array.from(new Set(products.map((product) => product.location))).sort()
}

/* ---------------------------------------------------------
   Filter helpers shared by the Explore page
   --------------------------------------------------------- */

export const EMPTY_FILTERS: ProductFilters = {
  minPrice: null,
  maxPrice: null,
  minRating: 0,
  availability: [],
  conditions: [],
  locations: [],
}

export function countActiveFilters(filters: ProductFilters): number {
  return (
    (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    filters.availability.length +
    filters.conditions.length +
    filters.locations.length
  )
}
