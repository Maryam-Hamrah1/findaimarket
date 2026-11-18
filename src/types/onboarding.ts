import type { Store, StoreDetails } from './store'

/*
  Seller onboarding models. The same shapes can be sent to a backend later.
*/

/** Every value the seller types or picks across the five steps. */
export interface OnboardingFields {
  // Step 1: store information
  name: string
  description: string
  category: string
  businessType: string
  /** ISO country code, same codes as checkout and registration */
  country: string
  city: string
  email: string
  phone: string
  // Step 2: branding (images are small data URLs made in the browser)
  logo: string
  cover: string
  brandName: string
  tagline: string
  brandDescription: string
  // Step 3: business information
  businessName: string
  registrationNumber: string
  address: string
  website: string
  instagram: string
  facebook: string
  x: string
  // Step 4: policies
  returns: string
  refunds: string
  shipping: string
  processingTime: string
  supportEmail: string
}

export type OnboardingField = keyof OnboardingFields

export type OnboardingErrors = Partial<Record<OnboardingField | 'acceptedTerms', string>>

/** Progress that is saved on this device until the store is submitted. */
export interface OnboardingDraft {
  /** Index of the step being edited, 0 to 4 */
  step: number
  /** Furthest step reached, so finished steps stay clickable */
  furthest: number
  fields: OnboardingFields
  acceptedTerms: boolean
}

export interface OnboardingStep {
  id: 'info' | 'branding' | 'business' | 'policies' | 'review'
  label: string
  fields: ReadonlyArray<OnboardingField>
}

/** What is saved when a seller submits: the public store, its page content and the private form answers. */
export interface StoreRecord {
  ownerId: string
  store: Store
  details: StoreDetails
  /** The private part of the form (business email, address, registration number...). Images live on `store`. */
  profile: Omit<OnboardingFields, 'logo' | 'cover'>
}

export type OnboardingStatus = 'not-started' | 'in-progress' | 'completed'
