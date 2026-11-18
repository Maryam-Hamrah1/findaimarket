import { Navigate, Outlet } from 'react-router-dom'
import { SellerStoreContext } from '../../context/sellerStoreContext'
import { useMyStore } from '../../hooks/useStores'
import DashboardLayout from './DashboardLayout'

/**
 * Inside ProtectedRoute role="seller". A seller without a store goes to
 * onboarding. Everything below receives that seller's own store, and only it.
 */
export default function SellerStoreGuard() {
  const myStore = useMyStore()

  if (!myStore) return <Navigate to="/seller/onboarding" replace />

  return (
    <SellerStoreContext.Provider value={myStore}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </SellerStoreContext.Provider>
  )
}
