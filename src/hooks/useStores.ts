import { useSyncExternalStore } from 'react'
import { getAllStores } from '../data/stores'
import { subscribeCatalog } from '../data/catalog'
import { storeRegistry } from '../services/storeRegistry'
import type { StoreRecord } from '../types/onboarding'
import type { Store } from '../types/store'
import { useAuth } from './useAuth'

/** Every store (sample and seller-created). Re-renders when a store is added. */
export function useStores(): ReadonlyArray<Store> {
  return useSyncExternalStore(subscribeCatalog, getAllStores)
}

/** The signed-in seller's store, if they have created one. */
export function useMyStore(): StoreRecord | undefined {
  const { user } = useAuth()
  const records = useSyncExternalStore(storeRegistry.subscribe, storeRegistry.list)
  return user ? records.find((record) => record.ownerId === user.id) : undefined
}
