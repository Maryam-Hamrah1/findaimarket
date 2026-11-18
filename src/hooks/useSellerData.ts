import { useMemo, useSyncExternalStore } from 'react'
import { productRegistry } from '../services/productRegistry'
import { sellerOrders } from '../services/sellerOrders'
import type { SellerOrder, SellerProductRecord } from '../types/seller'

/** The products of one store, drafts included. Re-renders when they change. */
export function useSellerProducts(storeId: number): SellerProductRecord[] {
  const all = useSyncExternalStore(productRegistry.subscribe, productRegistry.list)
  return useMemo(() => all.filter((record) => record.storeId === storeId), [all, storeId])
}

/** The orders of one store only. Re-renders when they change. */
export function useSellerOrders(storeId: number): SellerOrder[] {
  const all = useSyncExternalStore(sellerOrders.subscribe, sellerOrders.list)
  return useMemo(() => all.filter((order) => order.storeId === storeId), [all, storeId])
}
