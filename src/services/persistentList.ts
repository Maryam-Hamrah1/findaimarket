import type { KeyValueStorage } from './demoAuth'

/*
  A list of records kept in one storage key, shared by the whole app.
  Reads are defensive, writes are all-or-nothing and other tabs are followed.
  A backend replaces this later; callers keep using the same functions.
*/

export type CommitResult = 'ok' | 'aborted' | 'storage-failed'

export interface PersistentList<T> {
  /** Same array object until something changes, so it is safe to subscribe to */
  get(): ReadonlyArray<T>
  /**
   * Reads what is saved right now (another tab may have changed it), lets
   * `mutate` build the new list, then saves. Return null from `mutate` to cancel.
   */
  commit(mutate: (current: T[]) => T[] | null): CommitResult
  subscribe(listener: () => void): () => void
}

export function createPersistentList<T>(
  storage: KeyValueStorage,
  key: string,
  parse: (raw: string | null) => T[],
): PersistentList<T> {
  const read = (): T[] => {
    try {
      return parse(storage.getItem(key))
    } catch {
      return []
    }
  }

  let items: ReadonlyArray<T> = read()
  const listeners = new Set<() => void>()
  const notify = () => listeners.forEach((listener) => listener())

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key !== key && event.key !== null) return
      const next = read()
      if (JSON.stringify(next) !== JSON.stringify(items)) {
        items = next
        notify()
      }
    })
  }

  return {
    get: () => items,

    commit(mutate) {
      const current = read()
      const next = mutate(current)

      if (next === null) {
        // Pick up what another tab saved, even though nothing is written
        if (JSON.stringify(current) !== JSON.stringify(items)) {
          items = current
          notify()
        }
        return 'aborted'
      }

      try {
        storage.setItem(key, JSON.stringify(next))
      } catch {
        return 'storage-failed'
      }

      items = next
      notify()
      return 'ok'
    },

    subscribe(listener) {
      listeners.add(listener)
      return () => void listeners.delete(listener)
    },
  }
}

/** localStorage, or a memory stand-in for this visit when the browser blocks it. */
export function browserStorage(probeKey: string): KeyValueStorage {
  try {
    const storage = window.localStorage
    storage.getItem(probeKey)
    return storage
  } catch {
    const data = new Map<string, string>()
    return {
      getItem: (name) => data.get(name) ?? null,
      setItem: (name, value) => void data.set(name, value),
      removeItem: (name) => void data.delete(name),
    }
  }
}
