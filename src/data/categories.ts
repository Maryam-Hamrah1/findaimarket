import type { CategoryFilter, CategoryId } from '../types/product'

export interface CategoryMeta {
  id: CategoryFilter
  name: string
}

export const CATEGORIES: ReadonlyArray<CategoryMeta> = [
  { id: 'all', name: 'All Products' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'home-living', name: 'Home & Living' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'sports', name: 'Sports' },
]

const CATEGORY_IDS: ReadonlyArray<CategoryId> = [
  'fashion',
  'electronics',
  'accessories',
  'home-living',
  'beauty',
  'sports',
]

export function isCategoryId(value: string | null): value is CategoryId {
  return value !== null && CATEGORY_IDS.some((id) => id === value)
}

export function getCategoryName(id: CategoryFilter): string {
  return CATEGORIES.find((category) => category.id === id)?.name ?? 'All Products'
}
