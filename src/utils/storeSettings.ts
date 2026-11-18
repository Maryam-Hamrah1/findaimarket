import type { OnboardingFields, StoreRecord } from '../types/onboarding'
import { buildStoreRecord } from './onboarding'

/** The form values that belong to a saved store. */
export function recordToFields(record: StoreRecord): OnboardingFields {
  return { ...record.profile, logo: record.store.logo, cover: record.store.coverImage }
}

/**
 * Applies edited values to a saved store. The id, address, owner, creation
 * date, rating and followers stay as they were.
 */
export function applyFields(record: StoreRecord, fields: OnboardingFields, ownerName: string): StoreRecord {
  const built = buildStoreRecord({ fields, owner: { id: record.ownerId, fullName: ownerName }, existingStores: [] })

  return {
    ...record,
    store: {
      ...record.store,
      name: built.store.name,
      description: built.store.description,
      logo: built.store.logo,
      coverImage: built.store.coverImage,
      category: built.store.category,
      categoryLabel: built.store.categoryLabel,
      country: built.store.country,
      city: built.store.city,
    },
    details: {
      ...record.details,
      story: built.details.story,
      seller: { ...record.details.seller, bio: built.details.seller.bio },
      contact: built.details.contact,
      policies: built.details.policies,
      socials: built.details.socials,
    },
    profile: built.profile,
  }
}
