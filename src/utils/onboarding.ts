import { getCountry } from '../data/countries'
import type {
  OnboardingDraft,
  OnboardingErrors,
  OnboardingField,
  OnboardingFields,
  OnboardingStep,
  StoreRecord,
} from '../types/onboarding'
import type { SocialPlatform, Store, StoreCategoryId, StoreDetails, StoreSocialLink } from '../types/store'
import { slugify } from './slug'
import { isValidEmail } from './validation'

/* Everything about the onboarding form that is not UI: steps, rules, defaults, and building the store. */

export const ONBOARDING_STEPS: ReadonlyArray<OnboardingStep> = [
  { id: 'info', label: 'Store info', fields: ['name', 'description', 'category', 'businessType', 'country', 'city', 'email', 'phone'] },
  { id: 'branding', label: 'Branding', fields: ['logo', 'cover', 'brandName', 'tagline', 'brandDescription'] },
  { id: 'business', label: 'Business', fields: ['businessName', 'registrationNumber', 'address', 'website', 'instagram', 'facebook', 'x'] },
  { id: 'policies', label: 'Policies', fields: ['returns', 'refunds', 'shipping', 'processingTime', 'supportEmail'] },
  { id: 'review', label: 'Review', fields: [] },
]

export const LAST_STEP = ONBOARDING_STEPS.length - 1

export interface StoreCategoryOption {
  value: string
  label: string
  /** The directory category this maps to */
  categoryId: StoreCategoryId
}

export const STORE_CATEGORY_OPTIONS: ReadonlyArray<StoreCategoryOption> = [
  { value: 'fashion', label: 'Fashion', categoryId: 'fashion' },
  { value: 'electronics', label: 'Electronics', categoryId: 'electronics' },
  { value: 'beauty', label: 'Beauty & Personal Care', categoryId: 'beauty' },
  { value: 'home-living', label: 'Home & Living', categoryId: 'home-living' },
  { value: 'accessories', label: 'Accessories', categoryId: 'accessories' },
  { value: 'sports', label: 'Sports & Outdoors', categoryId: 'sports' },
  { value: 'books', label: 'Books & Stationery', categoryId: 'other' },
  { value: 'food', label: 'Food & Grocery', categoryId: 'other' },
  { value: 'other', label: 'Other', categoryId: 'other' },
]

export const BUSINESS_TYPES: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'individual', label: 'Individual seller' },
  { value: 'sole-proprietor', label: 'Sole proprietorship' },
  { value: 'company', label: 'Registered company' },
  { value: 'non-profit', label: 'Non-profit or community group' },
  { value: 'other', label: 'Other' },
]

export const PROCESSING_TIMES: ReadonlyArray<string> = [
  '1 business day',
  '1-2 business days',
  '3-5 business days',
  '1-2 weeks',
]

/** Editable starting text. It is only a suggestion, not a platform policy. */
export const SAMPLE_POLICIES = {
  returns:
    'Items can be returned within 14 days of delivery if they are unused and in their original packaging. Please contact us before sending anything back.',
  refunds:
    'Once a returned item reaches us and is checked, we refund the original payment method within 5 to 7 business days.',
  shipping:
    'We ship to the countries offered at checkout. Delivery time and cost depend on your location and the delivery method you choose.',
} as const

export const LIMITS = {
  nameMin: 2,
  nameMax: 60,
  descriptionMin: 20,
  descriptionMax: 500,
  cityMin: 2,
  cityMax: 60,
  taglineMax: 100,
  brandDescriptionMax: 600,
  addressMin: 5,
  addressMax: 200,
  policyMin: 10,
  policyMax: 800,
} as const

export function createEmptyFields(owner?: { email: string; country: string }): OnboardingFields {
  return {
    name: '',
    description: '',
    category: '',
    businessType: '',
    country: owner?.country ?? '',
    city: '',
    email: owner?.email ?? '',
    phone: '',
    logo: '',
    cover: '',
    brandName: '',
    tagline: '',
    brandDescription: '',
    businessName: '',
    registrationNumber: '',
    address: '',
    website: '',
    instagram: '',
    facebook: '',
    x: '',
    returns: SAMPLE_POLICIES.returns,
    refunds: SAMPLE_POLICIES.refunds,
    shipping: SAMPLE_POLICIES.shipping,
    processingTime: '1-2 business days',
    supportEmail: owner?.email ?? '',
  }
}

export function createDraft(owner?: { email: string; country: string }): OnboardingDraft {
  return { step: 0, furthest: 0, fields: createEmptyFields(owner), acceptedTerms: false }
}

/** True when the seller has changed anything compared with the starting form. */
export function isDraftDirty(draft: OnboardingDraft, baseline: OnboardingFields): boolean {
  return (
    draft.acceptedTerms ||
    (Object.keys(baseline) as OnboardingField[]).some((key) => draft.fields[key] !== baseline[key])
  )
}

/** Turns "example.com" into "https://example.com". Returns undefined when it is not a usable web address. */
export function normaliseUrl(value: string): string | undefined {
  const trimmed = value.trim()
  if (trimmed === '') return undefined
  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const url = new URL(withProtocol)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined
    if (!url.hostname.includes('.')) return undefined
    return url.toString()
  } catch {
    return undefined
  }
}

const PHONE = /^\+?[\d\s().-]{7,20}$/

export interface ValidationContext {
  /** Does a store with this name already exist? */
  isNameTaken: (name: string) => boolean
}

function lengthError(value: string, label: string, min: number, max: number): string | undefined {
  const length = value.trim().length
  if (length === 0) return `Enter ${label}.`
  if (length < min) return `${capitalise(label)} must be at least ${min} characters.`
  if (length > max) return `${capitalise(label)} must be ${max} characters or fewer.`
  return undefined
}

function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function optionalUrl(value: string, label: string): string | undefined {
  if (value.trim() === '') return undefined
  return normaliseUrl(value) ? undefined : `Enter a valid web address for ${label}, like https://example.com.`
}

/** Checks the fields of one step. Returns only the fields with a problem. */
export function validateStep(
  stepIndex: number,
  fields: OnboardingFields,
  context: ValidationContext,
): OnboardingErrors {
  const errors: OnboardingErrors = {}
  const set = (key: OnboardingField, message: string | undefined) => {
    if (message) errors[key] = message
  }
  const step = ONBOARDING_STEPS[stepIndex]
  if (!step) return errors

  if (step.id === 'info') {
    set('name', lengthError(fields.name, 'a store name', LIMITS.nameMin, LIMITS.nameMax))
    if (!errors.name && context.isNameTaken(fields.name)) {
      errors.name = 'A store with this name already exists. Choose a different name.'
    }
    set('description', lengthError(fields.description, 'a store description', LIMITS.descriptionMin, LIMITS.descriptionMax))
    if (!STORE_CATEGORY_OPTIONS.some((option) => option.value === fields.category)) {
      errors.category = 'Choose a store category.'
    }
    if (!BUSINESS_TYPES.some((type) => type.value === fields.businessType)) {
      errors.businessType = 'Choose a business type.'
    }
    if (fields.country === '') errors.country = 'Choose your country.'
    else if (!getCountry(fields.country)) errors.country = 'Choose a country from the list.'
    set('city', lengthError(fields.city, 'your city', LIMITS.cityMin, LIMITS.cityMax))
    if (fields.email.trim() === '') errors.email = 'Enter your business email.'
    else if (!isValidEmail(fields.email)) errors.email = 'Enter a valid email address, like shop@example.com.'
    if (fields.phone.trim() !== '' && !PHONE.test(fields.phone.trim())) {
      errors.phone = 'Enter a phone number with digits only, like +44 20 7946 0000.'
    }
  }

  if (step.id === 'branding') {
    if (fields.brandName.trim().length > LIMITS.nameMax) {
      errors.brandName = `Brand name must be ${LIMITS.nameMax} characters or fewer.`
    }
    if (fields.tagline.trim().length > LIMITS.taglineMax) {
      errors.tagline = `Tagline must be ${LIMITS.taglineMax} characters or fewer.`
    }
    if (fields.brandDescription.trim().length > LIMITS.brandDescriptionMax) {
      errors.brandDescription = `Brand description must be ${LIMITS.brandDescriptionMax} characters or fewer.`
    }
  }

  if (step.id === 'business') {
    if (fields.businessName.trim().length > LIMITS.nameMax) {
      errors.businessName = `Business name must be ${LIMITS.nameMax} characters or fewer.`
    }
    if (fields.registrationNumber.trim().length > 40) {
      errors.registrationNumber = 'Registration number must be 40 characters or fewer.'
    }
    set('address', lengthError(fields.address, 'your business address', LIMITS.addressMin, LIMITS.addressMax))
    set('website', optionalUrl(fields.website, 'your website'))
    set('instagram', optionalUrl(fields.instagram, 'Instagram'))
    set('facebook', optionalUrl(fields.facebook, 'Facebook'))
    set('x', optionalUrl(fields.x, 'X'))
  }

  if (step.id === 'policies') {
    set('returns', lengthError(fields.returns, 'a return policy', LIMITS.policyMin, LIMITS.policyMax))
    set('refunds', lengthError(fields.refunds, 'a refund policy', LIMITS.policyMin, LIMITS.policyMax))
    set('shipping', lengthError(fields.shipping, 'shipping information', LIMITS.policyMin, LIMITS.policyMax))
    if (!PROCESSING_TIMES.includes(fields.processingTime)) errors.processingTime = 'Choose a processing time.'
    if (fields.supportEmail.trim() === '') errors.supportEmail = 'Enter a customer support email.'
    else if (!isValidEmail(fields.supportEmail)) errors.supportEmail = 'Enter a valid email address, like help@example.com.'
  }

  return errors
}

/** Checks every step. Used before submitting. */
export function validateAll(
  draft: OnboardingDraft,
  context: ValidationContext,
): { errors: OnboardingErrors; firstInvalidStep: number | null } {
  let errors: OnboardingErrors = {}
  let firstInvalidStep: number | null = null

  for (let index = 0; index < LAST_STEP; index += 1) {
    const stepErrors = validateStep(index, draft.fields, context)
    if (Object.keys(stepErrors).length > 0) {
      errors = { ...errors, ...stepErrors }
      if (firstInvalidStep === null) firstInvalidStep = index
    }
  }

  if (!draft.acceptedTerms) {
    errors.acceptedTerms = 'Please agree to the Terms and Seller Agreement to submit your store.'
  }

  return { errors, firstInvalidStep }
}

/** "Name", "Name-2", "Name-3"... until the slug is unused. */
export function uniqueSlug(name: string, taken: Iterable<string>): string {
  const used = new Set(taken)
  const base = slugify(name) || 'store'
  if (!used.has(base)) return base

  let counter = 2
  while (used.has(`${base}-${counter}`)) counter += 1
  return `${base}-${counter}`
}

export function isNameInUse(name: string, stores: ReadonlyArray<{ name: string }>): boolean {
  const wanted = name.trim().toLowerCase()
  return stores.some((store) => store.name.trim().toLowerCase() === wanted)
}

function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter((part) => part !== '')
}

function socialLinks(fields: OnboardingFields): StoreSocialLink[] {
  const entries: Array<[SocialPlatform, string]> = [
    ['website', fields.website],
    ['instagram', fields.instagram],
    ['facebook', fields.facebook],
    ['x', fields.x],
  ]

  return entries.flatMap(([platform, value]) => {
    const url = normaliseUrl(value)
    return url ? [{ platform, url }] : []
  })
}

export interface BuildInput {
  fields: OnboardingFields
  owner: { id: string; fullName: string }
  /** Every store that already exists (sample and created), for ids and slugs */
  existingStores: ReadonlyArray<Pick<Store, 'id' | 'slug' | 'name'>>
  now?: Date
}

/** Turns a finished form into the store the rest of the site understands. */
export function buildStoreRecord({ fields, owner, existingStores, now = new Date() }: BuildInput): StoreRecord {
  const option = STORE_CATEGORY_OPTIONS.find((item) => item.value === fields.category)
  const country = getCountry(fields.country)
  const name = fields.name.trim()
  const brandName = fields.brandName.trim()
  const slug = uniqueSlug(name, existingStores.map((store) => store.slug))
  const id = existingStores.reduce((highest, store) => Math.max(highest, store.id), 0) + 1

  const store: Store = {
    id,
    slug,
    name,
    description: fields.description.trim(),
    logo: fields.logo,
    coverImage: fields.cover,
    category: option?.categoryId ?? 'other',
    categoryLabel: option?.label ?? 'Other',
    country: country?.name ?? fields.country,
    city: fields.city.trim(),
    productCount: 0,
    rating: 0,
    reviewCount: 0,
    followers: 0,
    verified: false,
    createdAt: now.toISOString().slice(0, 10),
  }

  const story = [
    fields.tagline.trim(),
    ...paragraphs(fields.brandDescription.trim() || fields.description),
  ].filter((part) => part !== '')

  const details: StoreDetails = {
    slug,
    userCreated: true,
    story: story.length > 0 ? story : [store.description],
    seller: {
      name: owner.fullName,
      role: 'Store owner',
      bio: brandName !== '' && brandName !== name ? `Sells under the brand name ${brandName}.` : '',
    },
    established: now.getFullYear(),
    contact: {
      email: fields.supportEmail.trim(),
      phone: fields.phone.trim() === '' ? undefined : fields.phone.trim(),
      hours: 'Replies by email',
    },
    policies: {
      shipping: `${fields.shipping.trim()} Orders are processed in ${fields.processingTime}.`,
      returns: `${fields.returns.trim()} Refunds: ${fields.refunds.trim()}`,
      payments: [],
    },
    socials: socialLinks(fields),
    reviews: [],
  }

  const { logo: _logo, cover: _cover, ...profile } = fields
  void _logo
  void _cover

  return { ownerId: owner.id, store, details, profile }
}

