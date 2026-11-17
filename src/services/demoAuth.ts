import type {
  AuthResult,
  AuthService,
  ProfileUpdate,
  RegisterInput,
  User,
  UserRole,
} from '../types/auth'
import { COUNTRIES } from '../data/countries'

/*
  DEMO AUTHENTICATION. This is NOT secure and NOT a real login system.

  Accounts live only in this browser's localStorage. Passwords are never
  saved: only a salted hash is kept so a demo account can be logged into
  again. Anyone with access to the browser can still read, copy or change
  that data, and nothing is checked by a server. A real back end replaces
  this file; the rest of the app only uses the AuthService interface.
*/

export const USERS_KEY = 'findaimarket-demo-users-v1'
export const SESSION_KEY = 'findaimarket-demo-session-v1'

/** The part of localStorage / sessionStorage this file needs (easy to fake in tests). */
export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

interface StoredUser {
  user: User
  salt: string
  hash: string
  /** Which hashing was used, so the right one is repeated on login */
  algo: 'pbkdf2' | 'fallback'
}

/* ---------------------------------------------------------
   Password hashing (demo level)
   --------------------------------------------------------- */

const PBKDF2_ITERATIONS = 120_000

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function randomHex(byteCount: number): string {
  const bytes = new Uint8Array(byteCount)
  const cryptoApi = globalThis.crypto

  if (cryptoApi?.getRandomValues) cryptoApi.getRandomValues(bytes)
  else for (let i = 0; i < byteCount; i += 1) bytes[i] = Math.floor(Math.random() * 256)

  return toHex(bytes)
}

/** Simple non-cryptographic hash. Only used when the browser has no Web Crypto (plain http). */
function fallbackHash(text: string): string {
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i)
    h1 = Math.imul(h1 ^ code, 2654435761)
    h2 = Math.imul(h2 ^ code, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16)
}

async function hashPassword(
  password: string,
  salt: string,
  algo: StoredUser['algo'],
): Promise<string> {
  const subtle = globalThis.crypto?.subtle

  if (algo === 'pbkdf2' && subtle) {
    const key = await subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits'],
    )
    const bits = await subtle.deriveBits(
      { name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
      key,
      256,
    )
    return toHex(new Uint8Array(bits))
  }

  return fallbackHash(`${salt}:${password}`)
}

/* ---------------------------------------------------------
   Reading and writing saved accounts
   --------------------------------------------------------- */

const ROLES: readonly UserRole[] = ['buyer', 'seller']

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseUser(value: unknown): User | undefined {
  if (!isRecord(value)) return undefined
  const { id, fullName, email, country, roles, createdAt } = value

  if (typeof id !== 'string' || typeof fullName !== 'string') return undefined
  if (typeof email !== 'string' || typeof country !== 'string') return undefined
  if (typeof createdAt !== 'string' || !Array.isArray(roles)) return undefined

  const cleanRoles = roles.filter((role): role is UserRole => ROLES.includes(role as UserRole))
  if (cleanRoles.length === 0) return undefined

  return { id, fullName, email, country, roles: cleanRoles, createdAt }
}

function readUsers(storage: KeyValueStorage): StoredUser[] {
  let data: unknown
  try {
    data = JSON.parse(storage.getItem(USERS_KEY) ?? '[]')
  } catch {
    return []
  }
  if (!Array.isArray(data)) return []

  return data.flatMap((entry): StoredUser[] => {
    if (!isRecord(entry)) return []
    const user = parseUser(entry.user)
    const { salt, hash, algo } = entry
    if (!user || typeof salt !== 'string' || typeof hash !== 'string') return []
    if (algo !== 'pbkdf2' && algo !== 'fallback') return []
    return [{ user, salt, hash, algo }]
  })
}

function writeUsers(storage: KeyValueStorage, users: StoredUser[]): void {
  storage.setItem(USERS_KEY, JSON.stringify(users))
}

const normaliseEmail = (email: string) => email.trim().toLowerCase()

function newId(): string {
  return `user-${randomHex(8)}`
}

/** Same message for a wrong email and a wrong password, so neither is revealed. */
const BAD_LOGIN = 'The email or password is not correct. Please check them and try again.'
const STORAGE_PROBLEM =
  'This browser is blocking storage, so the demo cannot save accounts. Allow site data and try again.'

/* ---------------------------------------------------------
   The service
   --------------------------------------------------------- */

interface Storages {
  /** Accounts and "remember me" sessions */
  persistent: KeyValueStorage
  /** Sessions that end when the browser tab closes */
  temporary: KeyValueStorage
}

export function createDemoAuthService({ persistent, temporary }: Storages): AuthService {
  const findByEmail = (users: StoredUser[], email: string) =>
    users.find((entry) => normaliseEmail(entry.user.email) === normaliseEmail(email))

  return {
    async register(input: RegisterInput): Promise<AuthResult<User>> {
      try {
        const users = readUsers(persistent)

        if (findByEmail(users, input.email)) {
          return { ok: false, message: 'An account with this email already exists. Try signing in instead.' }
        }

        if (!COUNTRIES.some((country) => country.code === input.country)) {
          return { ok: false, message: 'Please choose a country from the list.' }
        }

        const algo: StoredUser['algo'] = globalThis.crypto?.subtle ? 'pbkdf2' : 'fallback'
        const salt = randomHex(16)

        const user: User = {
          id: newId(),
          fullName: input.fullName.trim().replace(/\s+/g, ' '),
          email: input.email.trim(),
          country: input.country,
          roles: [input.accountType],
          createdAt: new Date().toISOString(),
        }

        users.push({ user, salt, algo, hash: await hashPassword(input.password, salt, algo) })
        writeUsers(persistent, users)

        return { ok: true, value: user }
      } catch {
        return { ok: false, message: STORAGE_PROBLEM }
      }
    },

    async login(email: string, password: string): Promise<AuthResult<User>> {
      const entry = findByEmail(readUsers(persistent), email)
      if (!entry) return { ok: false, message: BAD_LOGIN }

      const attempt = await hashPassword(password, entry.salt, entry.algo)
      return attempt === entry.hash
        ? { ok: true, value: entry.user }
        : { ok: false, message: BAD_LOGIN }
    },

    async updateProfile(userId: string, update: ProfileUpdate): Promise<AuthResult<User>> {
      try {
        const users = readUsers(persistent)
        const entry = users.find((candidate) => candidate.user.id === userId)
        if (!entry) return { ok: false, message: 'We could not find this account.' }

        entry.user = {
          ...entry.user,
          fullName: update.fullName.trim().replace(/\s+/g, ' '),
          country: update.country,
        }
        writeUsers(persistent, users)

        return { ok: true, value: entry.user }
      } catch {
        return { ok: false, message: STORAGE_PROBLEM }
      }
    },

    async requestPasswordReset(): Promise<void> {
      // Demo: no email is sent and nothing is looked up, so the answer never depends on the address
    },

    restoreSession(): User | null {
      for (const storage of [persistent, temporary]) {
        try {
          const raw = storage.getItem(SESSION_KEY)
          if (raw === null) continue

          const data: unknown = JSON.parse(raw)
          if (!isRecord(data) || typeof data.userId !== 'string') continue

          const entry = readUsers(persistent).find((candidate) => candidate.user.id === data.userId)
          if (entry) return entry.user
        } catch {
          // A damaged session is ignored; the person simply signs in again
        }
      }
      return null
    },

    saveSession(userId: string, remember: boolean): void {
      const session = JSON.stringify({ userId })
      try {
        // Only one place holds the session at a time
        persistent.removeItem(SESSION_KEY)
        temporary.removeItem(SESSION_KEY)
        ;(remember ? persistent : temporary).setItem(SESSION_KEY, session)
      } catch {
        // Without storage the person stays signed in until the page is closed
      }
    },

    clearSession(): void {
      try {
        persistent.removeItem(SESSION_KEY)
        temporary.removeItem(SESSION_KEY)
      } catch {
        // Nothing saved, nothing to clear
      }
    },
  }
}
