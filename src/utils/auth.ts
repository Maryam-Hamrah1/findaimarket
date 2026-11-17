import { getCountry } from '../data/countries'
import type { RegisterErrors, RegisterFields } from '../types/auth'
import { isValidEmail } from './validation'

export const MIN_PASSWORD_LENGTH = 8

/** One friendly message, or undefined when the password is fine. */
export function checkPassword(password: string): string | undefined {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'Use both letters and numbers.'
  }
  return undefined
}

export function validateRegister(fields: RegisterFields): RegisterErrors {
  const errors: RegisterErrors = {}

  const name = fields.fullName.trim()
  if (name.length < 2 || !/\p{L}/u.test(name)) errors.fullName = 'Enter your full name.'

  if (fields.email.trim() === '') errors.email = 'Enter your email address.'
  else if (!isValidEmail(fields.email)) {
    errors.email = 'Enter a valid email address, like name@example.com.'
  }

  const passwordProblem = checkPassword(fields.password)
  if (fields.password === '') errors.password = 'Create a password.'
  else if (passwordProblem) errors.password = passwordProblem

  if (fields.confirmPassword === '') errors.confirmPassword = 'Type your password again.'
  else if (fields.confirmPassword !== fields.password) {
    errors.confirmPassword = 'The two passwords do not match.'
  }

  if (fields.country === '') errors.country = 'Choose your country.'
  else if (!getCountry(fields.country)) errors.country = 'Choose a country from the list.'

  if (!fields.acceptedTerms) {
    errors.acceptedTerms = 'Please agree to the Terms and Privacy Policy to continue.'
  }

  return errors
}

export function validateLogin(email: string, password: string): { email?: string; password?: string } {
  const errors: { email?: string; password?: string } = {}

  if (email.trim() === '') errors.email = 'Enter your email address.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.'

  if (password === '') errors.password = 'Enter your password.'

  return errors
}

/**
 * Only lets people be sent to a page inside this site. Anything else (another
 * website, a protocol-relative link) falls back to the default.
 */
export function safeRedirect(target: unknown, fallback: string): string {
  if (typeof target !== 'string') return fallback
  if (!target.startsWith('/') || target.startsWith('//') || target.includes('\\')) return fallback
  if (target === '/login' || target === '/register' || target === '/forgot-password') return fallback
  return target
}

/**
 * Where to send someone who just signed in: the page they were trying to
 * reach, otherwise the area that fits their account.
 */
export function destinationAfterSignIn(roles: readonly string[], requested: string): string {
  if (requested !== '') return requested
  return roles.includes('seller') && !roles.includes('buyer') ? '/seller/dashboard' : '/account'
}
