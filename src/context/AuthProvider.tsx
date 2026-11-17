import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { SESSION_KEY, createDemoAuthService, type KeyValueStorage } from '../services/demoAuth'
import type { AuthResult, ProfileUpdate, RegisterInput, User, UserRole } from '../types/auth'
import { AuthContext, type AuthContextValue } from './authContext'

/** Storage that lives in memory, used when the browser blocks real storage. */
function memoryStorage(): KeyValueStorage {
  const data = new Map<string, string>()
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  }
}

function pickStorage(kind: 'localStorage' | 'sessionStorage'): KeyValueStorage {
  try {
    const storage = window[kind]
    // Touching it is what throws when storage is blocked
    storage.getItem(SESSION_KEY)
    return storage
  } catch {
    return memoryStorage()
  }
}

/** One account state for the whole site. Demo only: see services/demoAuth.ts. */
export default function AuthProvider({ children }: { children: ReactNode }) {
  const service = useMemo(
    () =>
      createDemoAuthService({
        persistent: pickStorage('localStorage'),
        temporary: pickStorage('sessionStorage'),
      }),
    [],
  )

  const [user, setUser] = useState<User | null>(() => service.restoreSession())

  // Follow sign-in and sign-out done in another tab
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === SESSION_KEY || event.key === null) setUser(service.restoreSession())
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [service])

  const register = useCallback(
    async (input: RegisterInput): Promise<AuthResult<User>> => {
      const result = await service.register(input)
      if (result.ok) {
        service.saveSession(result.value.id, true)
        setUser(result.value)
      }
      return result
    },
    [service],
  )

  const login = useCallback(
    async (email: string, password: string, remember: boolean): Promise<AuthResult<User>> => {
      try {
        const result = await service.login(email, password)
        if (result.ok) {
          service.saveSession(result.value.id, remember)
          setUser(result.value)
        }
        return result
      } catch {
        return { ok: false, message: 'Something went wrong. Please try again.' }
      }
    },
    [service],
  )

  const logout = useCallback(() => {
    service.clearSession()
    setUser(null)
  }, [service])

  const updateProfile = useCallback(
    async (update: ProfileUpdate): Promise<AuthResult<User>> => {
      if (!user) return { ok: false, message: 'Please sign in first.' }
      const result = await service.updateProfile(user.id, update)
      if (result.ok) setUser(result.value)
      return result
    },
    [service, user],
  )

  const requestPasswordReset = useCallback(
    (email: string) => service.requestPasswordReset(email),
    [service],
  )

  const hasRoleOf = useCallback(
    (role: UserRole) => user !== null && user.roles.includes(role),
    [user],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      register,
      login,
      logout,
      updateProfile,
      requestPasswordReset,
      hasRole: hasRoleOf,
    }),
    [user, register, login, logout, updateProfile, requestPasswordReset, hasRoleOf],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
