import { createContext } from 'react'
import type { StoreRecord } from '../types/onboarding'

/** The signed-in seller's store. Only provided inside the dashboard, where it always exists. */
export const SellerStoreContext = createContext<StoreRecord | null>(null)
