import { useContext } from 'react'
import { SellerStoreContext } from '../context/sellerStoreContext'
import type { StoreRecord } from '../types/onboarding'

export function useSellerStore(): StoreRecord {
  const record = useContext(SellerStoreContext)
  if (!record) throw new Error('useSellerStore must be used inside the seller dashboard')
  return record
}
