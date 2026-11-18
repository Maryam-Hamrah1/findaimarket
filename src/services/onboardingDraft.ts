import type { KeyValueStorage } from './demoAuth'
import type { OnboardingDraft, OnboardingField, OnboardingFields } from '../types/onboarding'
import { isImageDataUrl } from '../utils/images'
import { LAST_STEP } from '../utils/onboarding'

/*
  Unfinished onboarding, saved on this device so a refresh does not lose it.
  One draft per signed-in seller. Cleared when the store is submitted.
*/

export const DRAFT_KEY = 'findaimarket-onboarding-draft-v1'

type DraftMap = Record<string, unknown>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readMap(storage: KeyValueStorage): DraftMap {
  try {
    const data: unknown = JSON.parse(storage.getItem(DRAFT_KEY) ?? '{}')
    return isRecord(data) ? data : {}
  } catch {
    return {}
  }
}

const IMAGE_FIELDS: ReadonlyArray<OnboardingField> = ['logo', 'cover']

/** Rebuilds a draft from saved data: unknown keys are ignored and every value is checked. */
export function sanitiseDraft(value: unknown, defaults: OnboardingFields): OnboardingDraft | null {
  if (!isRecord(value) || !isRecord(value.fields)) return null

  const fields = { ...defaults }
  for (const key of Object.keys(defaults) as OnboardingField[]) {
    const saved = value.fields[key]
    if (typeof saved !== 'string') continue
    fields[key] = IMAGE_FIELDS.includes(key) ? (isImageDataUrl(saved) ? saved : '') : saved
  }

  const clamp = (n: unknown) => (typeof n === 'number' && Number.isInteger(n) ? Math.min(LAST_STEP, Math.max(0, n)) : 0)
  const step = clamp(value.step)

  return {
    step,
    furthest: Math.max(step, clamp(value.furthest)),
    fields,
    acceptedTerms: value.acceptedTerms === true,
  }
}

export function loadDraft(storage: KeyValueStorage, userId: string, defaults: OnboardingFields): OnboardingDraft | null {
  return sanitiseDraft(readMap(storage)[userId], defaults)
}

/** Returns false when the browser would not store it (full or blocked). */
export function saveDraft(storage: KeyValueStorage, userId: string, draft: OnboardingDraft): boolean {
  try {
    storage.setItem(DRAFT_KEY, JSON.stringify({ ...readMap(storage), [userId]: draft }))
    return true
  } catch {
    return false
  }
}

export function clearDraft(storage: KeyValueStorage, userId: string): void {
  try {
    const map = readMap(storage)
    delete map[userId]
    if (Object.keys(map).length === 0) storage.removeItem(DRAFT_KEY)
    else storage.setItem(DRAFT_KEY, JSON.stringify(map))
  } catch {
    // Nothing to do: the draft simply stays
  }
}

export function hasDraft(storage: KeyValueStorage, userId: string): boolean {
  return readMap(storage)[userId] !== undefined
}


/** Browser storage for drafts, or a memory stand-in when the browser blocks it. */
export function browserDraftStorage(): KeyValueStorage {
  try {
    const storage = window.localStorage
    storage.getItem(DRAFT_KEY)
    return storage
  } catch {
    const data = new Map<string, string>()
    return {
      getItem: (key) => data.get(key) ?? null,
      setItem: (key, value) => void data.set(key, value),
      removeItem: (key) => void data.delete(key),
    }
  }
}
