import { CATEGORIES } from '../data/categories'
import { isCategoryId } from '../data/categories'
import type { SellerProductRecord, ProductFormErrors, ProductFormValues, ProductStatus, StockStatus } from '../types/seller'
import { slugify } from './slug'

export const LOW_STOCK_AT = 5
export const MAX_PRODUCT_IMAGES = 5

export const PRODUCT_LIMITS = {
  nameMin: 3,
  nameMax: 100,
  shortMax: 200,
  descriptionMax: 2000,
  priceMax: 1_000_000,
  stockMax: 100_000,
  optionsMax: 12,
  optionLength: 20,
} as const

export function emptyProductForm(): ProductFormValues {
  return {
    name: '',
    shortDescription: '',
    description: '',
    category: '',
    price: '',
    oldPrice: '',
    images: [],
    sku: '',
    stock: '',
    brand: '',
    weight: '',
    dimensions: '',
    shipping: '',
    sizes: '',
    colors: '',
    status: 'active',
  }
}

export function recordToForm(record: SellerProductRecord): ProductFormValues {
  return {
    name: record.name,
    shortDescription: record.shortDescription,
    description: record.description,
    category: record.category,
    price: String(record.price),
    oldPrice: record.oldPrice === undefined ? '' : String(record.oldPrice),
    images: [...record.images],
    sku: record.sku,
    stock: String(record.stock),
    brand: record.brand,
    weight: record.weight,
    dimensions: record.dimensions,
    shipping: record.shipping,
    sizes: record.sizes.join(', '),
    colors: record.colors.join(', '),
    status: record.status,
  }
}

/** "S, M,, L" becomes ["S", "M", "L"] with no repeats. */
export function parseList(text: string): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const part of text.split(',')) {
    const value = part.trim()
    const key = value.toLowerCase()
    if (value !== '' && !seen.has(key)) {
      seen.add(key)
      result.push(value)
    }
  }
  return result
}

/** A money amount typed by a person. NaN when it is not a usable number. */
export function parseMoney(text: string): number {
  const cleaned = text.trim().replace(/^\$/, '')
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return Number.NaN
  return Number(cleaned)
}

export function parseStock(text: string): number {
  return /^\d+$/.test(text.trim()) ? Number(text.trim()) : Number.NaN
}

export function validateProductForm(values: ProductFormValues): ProductFormErrors {
  const errors: ProductFormErrors = {}
  const name = values.name.trim()

  if (name === '') errors.name = 'Enter a product name.'
  else if (name.length < PRODUCT_LIMITS.nameMin) errors.name = `Product name must be at least ${PRODUCT_LIMITS.nameMin} characters.`
  else if (name.length > PRODUCT_LIMITS.nameMax) errors.name = `Product name must be ${PRODUCT_LIMITS.nameMax} characters or fewer.`
  else if (slugify(name) === '') errors.name = 'Use at least one letter or number in the name.'

  const short = values.shortDescription.trim()
  if (short === '') errors.shortDescription = 'Add a short description.'
  else if (short.length > PRODUCT_LIMITS.shortMax) errors.shortDescription = `Short description must be ${PRODUCT_LIMITS.shortMax} characters or fewer.`

  if (values.description.trim().length > PRODUCT_LIMITS.descriptionMax) {
    errors.description = `Full description must be ${PRODUCT_LIMITS.descriptionMax} characters or fewer.`
  }

  if (!isCategoryId(values.category)) errors.category = 'Choose a category.'

  const price = parseMoney(values.price)
  if (values.price.trim() === '') errors.price = 'Enter a price.'
  else if (Number.isNaN(price)) errors.price = 'Enter the price as a number, like 24.99.'
  else if (price <= 0) errors.price = 'The price must be more than 0.'
  else if (price > PRODUCT_LIMITS.priceMax) errors.price = 'This price is too high.'

  if (values.oldPrice.trim() !== '') {
    const oldPrice = parseMoney(values.oldPrice)
    if (Number.isNaN(oldPrice)) errors.oldPrice = 'Enter the original price as a number, like 39.99.'
    else if (!Number.isNaN(price) && oldPrice <= price) errors.oldPrice = 'The original price must be higher than the price.'
  }

  const stock = parseStock(values.stock)
  if (values.stock.trim() === '') errors.stock = 'Enter the stock quantity (0 if none).'
  else if (Number.isNaN(stock)) errors.stock = 'Use a whole number, like 12.'
  else if (stock > PRODUCT_LIMITS.stockMax) errors.stock = 'This quantity is too high.'

  if (values.sku.trim().length > 40) errors.sku = 'SKU must be 40 characters or fewer.'
  if (values.brand.trim().length > 60) errors.brand = 'Brand must be 60 characters or fewer.'
  if (values.weight.trim().length > 40) errors.weight = 'Weight must be 40 characters or fewer.'
  if (values.dimensions.trim().length > 60) errors.dimensions = 'Dimensions must be 60 characters or fewer.'
  if (values.shipping.trim().length > 500) errors.shipping = 'Shipping information must be 500 characters or fewer.'

  for (const key of ['sizes', 'colors'] as const) {
    const items = parseList(values[key])
    if (items.length > PRODUCT_LIMITS.optionsMax) errors[key] = `Add at most ${PRODUCT_LIMITS.optionsMax} choices.`
    else if (items.some((item) => item.length > PRODUCT_LIMITS.optionLength)) {
      errors[key] = `Each choice must be ${PRODUCT_LIMITS.optionLength} characters or fewer.`
    }
  }

  if (values.images.length > MAX_PRODUCT_IMAGES) errors.images = `Add at most ${MAX_PRODUCT_IMAGES} images.`

  return errors
}

/** "name", "name-2", "name-3"... until the address is not used by any product. */
export function uniqueProductSlug(name: string, taken: Iterable<string>): string {
  const used = new Set(taken)
  const base = slugify(name) || 'product'
  if (!used.has(base)) return base

  let counter = 2
  while (used.has(`${base}-${counter}`)) counter += 1
  return `${base}-${counter}`
}

/** Turns a validated form into the fields a record stores. Call only when there are no errors. */
export function formToFields(values: ProductFormValues): Omit<SellerProductRecord, 'id' | 'storeId' | 'slug' | 'createdAt' | 'updatedAt'> {
  const category = CATEGORIES.find((item) => item.id === values.category)
  const oldPrice = values.oldPrice.trim() === '' ? undefined : parseMoney(values.oldPrice)

  return {
    name: values.name.trim(),
    shortDescription: values.shortDescription.trim(),
    description: values.description.trim(),
    category: category && category.id !== 'all' ? category.id : 'accessories',
    price: parseMoney(values.price),
    oldPrice,
    images: values.images,
    sku: values.sku.trim(),
    brand: values.brand.trim(),
    weight: values.weight.trim(),
    dimensions: values.dimensions.trim(),
    shipping: values.shipping.trim(),
    sizes: parseList(values.sizes),
    colors: parseList(values.colors),
    stock: parseStock(values.stock),
    status: values.status,
  }
}

export function stockStatus(stock: number): StockStatus {
  if (stock <= 0) return 'out-of-stock'
  return stock <= LOW_STOCK_AT ? 'low-stock' : 'in-stock'
}

export const STOCK_LABELS: Record<StockStatus, string> = {
  'in-stock': 'In stock',
  'low-stock': 'Low stock',
  'out-of-stock': 'Out of stock',
}

export type ProductSort = 'newest' | 'name' | 'price-asc' | 'price-desc' | 'stock-asc'

export const PRODUCT_SORTS: ReadonlyArray<{ value: ProductSort; label: string }> = [
  { value: 'newest', label: 'Newest first' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'stock-asc', label: 'Stock: low to high' },
]

export interface ProductListFilter {
  query: string
  category: string
  availability: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock'
  status: ProductStatus | 'all'
  sort: ProductSort
}

export function filterSellerProducts(
  products: readonly SellerProductRecord[],
  { query, category, availability, status, sort }: ProductListFilter,
): SellerProductRecord[] {
  const needle = query.trim().toLowerCase()

  const matches = products.filter((product) => {
    if (category !== 'all' && product.category !== category) return false
    if (status !== 'all' && product.status !== status) return false
    if (availability !== 'all' && stockStatus(product.stock) !== availability) return false
    if (needle === '') return true
    return (
      product.name.toLowerCase().includes(needle) ||
      product.sku.toLowerCase().includes(needle) ||
      product.brand.toLowerCase().includes(needle)
    )
  })

  const sorters: Record<ProductSort, (a: SellerProductRecord, b: SellerProductRecord) => number> = {
    newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
    name: (a, b) => a.name.localeCompare(b.name),
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'stock-asc': (a, b) => a.stock - b.stock,
  }
  return matches.sort(sorters[sort])
}
