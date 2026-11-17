/*
  Account models. The same shapes will be used when a real backend replaces
  the demo service, so pages and components never need to change.
*/

export type UserRole = 'buyer' | 'seller'

/** What the app knows about a signed-in person. Never contains a password. */
export interface User {
  id: string
  fullName: string
  email: string
  /** ISO country code, same codes as the checkout */
  country: string
  /** A person can hold more than one role, for example buyer and seller later */
  roles: UserRole[]
  /** ISO date-time */
  createdAt: string
}

export interface RegisterInput {
  accountType: UserRole
  fullName: string
  email: string
  password: string
  country: string
}

export interface ProfileUpdate {
  fullName: string
  country: string
}

export type AuthResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string }

/** Everything the UI needs from an authentication back end. */
export interface AuthService {
  register(input: RegisterInput): Promise<AuthResult<User>>
  login(email: string, password: string): Promise<AuthResult<User>>
  updateProfile(userId: string, update: ProfileUpdate): Promise<AuthResult<User>>
  /** Never says whether the address has an account */
  requestPasswordReset(email: string): Promise<void>
  /** Reads the saved session, if any */
  restoreSession(): User | null
  saveSession(userId: string, remember: boolean): void
  clearSession(): void
}

export interface RegisterFields {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  country: string
  acceptedTerms: boolean
}

export type RegisterErrors = Partial<Record<keyof RegisterFields, string>>

export function hasRole(user: User | null, role: UserRole): boolean {
  return user !== null && user.roles.includes(role)
}
