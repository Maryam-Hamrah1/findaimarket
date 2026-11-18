import type { OnboardingFields, StoreRecord } from '../types/onboarding'
import type { KeyValueStorage } from './demoAuth'
import { isImageDataUrl } from '../utils/images'
import { normaliseUrl } from '../utils/onboarding'

/*
  Stores created through seller onboarding, kept in this browser only (demo).
  Sample stores live in data/stores.ts; this registry adds the ones sellers make.
  Both are read through the functions in data/stores.ts, so the directory, the
  storefront, the cart and the account area all use one source.
  A backend replaces this file later; callers do not change.
*/

export const STORES_KEY = 'findaimarket-demo-stores-v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const str = (value: unknown): string => (typeof value === 'string' ? value : '')
const num = (value: unknown): number => (typeof value === 'number' && Number.isFinite(value) ? value : 0)

/** Reads saved stores defensively: anything damaged is dropped, never trusted. */
export function parseStoreRecords(raw: string | null): StoreRecord[] {
  if (!raw) return []

  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return []
  }
  if (!Array.isArray(data)) return []

  const seenSlugs = new Set<string>()
  const records: StoreRecord[] = []

  for (const item of data) {
    if (!isRecord(item) || !isRecord(item.store) || !isRecord(item.details) || !isRecord(item.profile)) continue
    const store = item.store
    const details = item.details
    const slug = str(store.slug)
    const ownerId = str(item.ownerId)

    if (ownerId === '' || slug === '' || str(store.name) === '' || seenSlugs.has(slug)) continue
    if (typeof store.id !== 'number') continue
    seenSlugs.add(slug)

    const contact = isRecord(details.contact) ? details.contact : {}
    const policies = isRecord(details.policies) ? details.policies : {}
    const seller = isRecord(details.seller) ? details.seller : {}
    const story = Array.isArray(details.story) ? details.story.filter((p): p is string => typeof p === 'string') : []
    const socials = Array.isArray(details.socials) ? details.socials : []
    const platforms = ['instagram', 'facebook', 'x', 'website'] as const

    records.push({
      ownerId,
      store: {
        id: store.id,
        slug,
        name: str(store.name),
        description: str(store.description),
        logo: isImageDataUrl(store.logo) ? store.logo : '',
        coverImage: isImageDataUrl(store.coverImage) ? store.coverImage : '',
        category: store.category === 'other' ? 'other' : validCategory(store.category),
        categoryLabel: str(store.categoryLabel) || undefined,
        country: str(store.country),
        city: str(store.city),
        productCount: 0,
        rating: 0,
        reviewCount: 0,
        followers: num(store.followers),
        verified: false,
        createdAt: str(store.createdAt),
      },
      details: {
        slug,
        userCreated: true,
        story: story.length > 0 ? story : [str(store.description)],
        seller: { name: str(seller.name), role: str(seller.role), bio: str(seller.bio) },
        established: typeof details.established === 'number' ? details.established : undefined,
        contact: {
          email: str(contact.email),
          phone: str(contact.phone) || undefined,
          hours: str(contact.hours),
        },
        policies: { shipping: str(policies.shipping), returns: str(policies.returns), payments: [] },
        socials: socials.flatMap((link) => {
          if (!isRecord(link)) return []
          const platform = platforms.find((candidate) => candidate === link.platform)
          const url = normaliseUrl(str(link.url))
          return platform && url ? [{ platform, url }] : []
        }),
        reviews: [],
      },
      profile: cleanProfile(item.profile),
    })
  }

  return records
}

function validCategory(value: unknown): StoreRecord['store']['category'] {
  const known = ['fashion', 'electronics', 'accessories', 'home-living', 'beauty', 'sports'] as const
  return known.find((candidate) => candidate === value) ?? 'other'
}

function cleanProfile(value: Record<string, unknown>): StoreRecord['profile'] {
  const keys: ReadonlyArray<keyof Omit<OnboardingFields, 'logo' | 'cover'>> = [
    'name', 'description', 'category', 'businessType', 'country', 'city', 'email', 'phone',
    'brandName', 'tagline', 'brandDescription', 'businessName', 'registrationNumber', 'address',
    'website', 'instagram', 'facebook', 'x', 'returns', 'refunds', 'shipping', 'processingTime', 'supportEmail',
  ]
  const profile = {} as StoreRecord['profile']
  for (const key of keys) profile[key] = str(value[key])
  return profile
}

export type AddStoreResult = { ok: true } | { ok: false; reason: 'owner-has-store' | 'name-taken' | 'slug-taken' | 'storage-failed'; message: string }

export type UpdateStoreResult =
  | { ok: true; record: StoreRecord }
  | { ok: false; reason: 'not-found' | 'name-taken' | 'storage-failed'; message: string }

export interface StoreRegistry {
  list(): ReadonlyArray<StoreRecord>
  getByOwner(ownerId: string): StoreRecord | undefined
  getBySlug(slug: string): StoreRecord | undefined
  getById(id: number): StoreRecord | undefined
  /** Changes the store that belongs to `ownerId`. Nobody else's store can be reached from here. */
  update(ownerId: string, change: (record: StoreRecord) => StoreRecord): UpdateStoreResult
  add(record: StoreRecord): AddStoreResult
  subscribe(listener: () => void): () => void
}

/** Registry on top of any key-value storage (localStorage in the browser, a fake one in tests). */
export function createStoreRegistry(storage: KeyValueStorage): StoreRegistry {
  let records: ReadonlyArray<StoreRecord> = readFrom(storage)
  const listeners = new Set<() => void>()

  function readFrom(source: KeyValueStorage): StoreRecord[] {
    try {
      return parseStoreRecords(source.getItem(STORES_KEY))
    } catch {
      return []
    }
  }

  const notify = () => listeners.forEach((listener) => listener())

  /** Picks up changes made in another tab */
  const refresh = () => {
    const next = readFrom(storage)
    if (JSON.stringify(next) !== JSON.stringify(records)) {
      records = next
      notify()
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key === STORES_KEY || event.key === null) refresh()
    })
  }

  return {
    list: () => records,
    getByOwner: (ownerId) => records.find((record) => record.ownerId === ownerId),
    getBySlug: (slug) => records.find((record) => record.store.slug === slug),
    getById: (id) => records.find((record) => record.store.id === id),

    update(ownerId, change) {
      const current = readFrom(storage)
      const existing = current.find((record) => record.ownerId === ownerId)
      if (!existing) return { ok: false, reason: 'not-found', message: 'You do not have a store yet.' }

      // The owner, id and address of a store never change from here
      const changed = change(existing)
      const record: StoreRecord = {
        ...changed,
        ownerId: existing.ownerId,
        store: { ...changed.store, id: existing.store.id, slug: existing.store.slug },
        details: { ...changed.details, slug: existing.store.slug },
      }

      const name = record.store.name.trim().toLowerCase()
      if (current.some((other) => other.ownerId !== ownerId && other.store.name.toLowerCase() === name)) {
        return { ok: false, reason: 'name-taken', message: 'A store with this name already exists. Choose a different name.' }
      }

      const next = current.map((other) => (other.ownerId === ownerId ? record : other))
      try {
        storage.setItem(STORES_KEY, JSON.stringify(next))
      } catch {
        return {
          ok: false,
          reason: 'storage-failed',
          message: 'Your browser could not save the change (storage may be full or blocked). Try removing the images.',
        }
      }

      records = next
      notify()
      return { ok: true, record }
    },

    add(record) {
      // Look at what is saved right now, in case another tab added a store
      const current = readFrom(storage)

      if (current.some((existing) => existing.ownerId === record.ownerId)) {
        records = current
        notify()
        return { ok: false, reason: 'owner-has-store', message: 'You already have a store. Each seller account can set up one store.' }
      }
      if (current.some((existing) => existing.store.name.toLowerCase() === record.store.name.toLowerCase())) {
        return { ok: false, reason: 'name-taken', message: 'A store with this name was just created. Choose a different name.' }
      }
      if (current.some((existing) => existing.store.slug === record.store.slug)) {
        return { ok: false, reason: 'slug-taken', message: 'That store address was just taken. Please submit again.' }
      }

      const next = [...current, record]
      try {
        storage.setItem(STORES_KEY, JSON.stringify(next))
      } catch {
        return {
          ok: false,
          reason: 'storage-failed',
          message: 'Your browser could not save the store (storage may be full or blocked). Try removing the images and submit again.',
        }
      }

      records = next
      notify()
      return { ok: true }
    },

    subscribe(listener) {
      listeners.add(listener)
      return () => void listeners.delete(listener)
    },
  }
}

function browserStorage(): KeyValueStorage {
  try {
    const storage = window.localStorage
    storage.getItem(STORES_KEY)
    return storage
  } catch {
    // Storage blocked: keep stores in memory for this visit only
    const data = new Map<string, string>()
    return {
      getItem: (key) => data.get(key) ?? null,
      setItem: (key, value) => void data.set(key, value),
      removeItem: (key) => void data.delete(key),
    }
  }
}

/** The one registry the whole app shares. */
export const storeRegistry: StoreRegistry = createStoreRegistry(browserStorage())
