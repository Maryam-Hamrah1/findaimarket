import { createContext } from 'react'
import type { AuthResult, ProfileUpdate, RegisterInput, User, UserRole } from '../types/auth'

export interface AuthContextValue {
  /** The signed-in person, or null for a guest */
  user: User | null
  register: (input: RegisterInput) => Promise<AuthResult<User>>
  login: (email: string, password: string, remember: boolean) => Promise<AuthResult<User>>
  logout: () => void
  updateProfile: (update: ProfileUpdate) => Promise<AuthResult<User>>
  requestPasswordReset: (email: string) => Promise<void>
  hasRole: (role: UserRole) => boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)
