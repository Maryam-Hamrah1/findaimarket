import { getCountry } from '../data/countries'
import type {
  AddressErrors,
  Country,
  ShippingAddress,
} from '../types/checkout'
import { isValidEmail } from './validation'

/* ---------------------------------------------------------
   Address cleaning and validation (pure, no UI)
   --------------------------------------------------------- */

const PHONE_CHARS = /^\+?[\d\s().-]+$/

/**
 * Trims every field and clears the ones the chosen country does not use
 * (for example a postal code for a country without postal codes).
 */
export function normaliseAddress(address: ShippingAddress): ShippingAddress {
  const country = getCountry(address.country)

  return {
    fullName: address.fullName.trim().replace(/\s+/g, ' '),
    email: address.email.trim(),
    phone: address.phone.trim(),
    country: address.country,
    region: country?.region === 'none' ? '' : address.region.trim(),
    city: address.city.trim(),
    street: address.street.trim(),
    apartment: address.apartment.trim(),
    postalCode:
      country?.postal === 'none' ? '' : address.postalCode.trim().toUpperCase(),
  }
}

function digitCount(value: string): number {
  return value.replace(/\D/g, '').length
}

function validatePostal(country: Country, value: string): string | undefined {
  if (country.postal === 'none') return undefined

  if (value === '') {
    return country.postal === 'required' ? 'Enter your postal code.' : undefined
  }

  if (country.postalPattern && !country.postalPattern.test(value)) {
    return country.postalExample
      ? `Check the postal code. Example: ${country.postalExample}.`
      : 'Check the postal code.'
  }

  return undefined
}

/** Returns one friendly message per invalid field. Empty object means valid. */
export function validateAddress(input: ShippingAddress): AddressErrors {
  const address = normaliseAddress(input)
  const errors: AddressErrors = {}

  if (address.fullName.length < 2 || !/\p{L}/u.test(address.fullName)) {
    errors.fullName = 'Enter your full name.'
  }

  if (address.email === '') {
    errors.email = 'Enter your email address.'
  } else if (!isValidEmail(address.email)) {
    errors.email = 'Enter a valid email address, like name@example.com.'
  }

  if (address.phone === '') {
    errors.phone = 'Enter a phone number the courier can call.'
  } else if (
    !PHONE_CHARS.test(address.phone) ||
    digitCount(address.phone) < 7 ||
    digitCount(address.phone) > 15
  ) {
    errors.phone = 'Enter a valid phone number, with the country code if you can (+93 70 123 4567).'
  }

  const country = getCountry(address.country)

  if (address.country === '') {
    errors.country = 'Choose your country.'
  } else if (!country) {
    errors.country = 'We cannot deliver to that country yet.'
  }

  if (country) {
    if (country.region === 'required' && address.region === '') {
      errors.region = `Enter your ${country.regionLabel.toLowerCase()}.`
    }

    const postalError = validatePostal(country, address.postalCode)
    if (postalError) errors.postalCode = postalError
  }

  if (address.city === '') errors.city = 'Enter your city.'

  if (address.street.length < 3) errors.street = 'Enter your street address.'

  return errors
}

/** Field order on screen, used to focus the first problem. */
export const ADDRESS_FIELD_ORDER = [
  'fullName',
  'email',
  'phone',
  'country',
  'region',
  'city',
  'street',
  'apartment',
  'postalCode',
] as const
