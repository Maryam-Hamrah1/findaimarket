import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Footer from './components/common/Footer'
import Navbar from './components/common/Navbar'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AccountOrdersPage from './pages/AccountOrdersPage'
import AccountPage from './pages/AccountPage'
import AccountWishlistPage from './pages/AccountWishlistPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AccountStorePage from './pages/AccountStorePage'
import SellerOnboardingPage from './pages/SellerOnboardingPage'
import SellerStoreGuard from './components/seller/SellerStoreGuard'
import AnalyticsPage from './pages/seller/AnalyticsPage'
import CustomersPage from './pages/seller/CustomersPage'
import InventoryPage from './pages/seller/InventoryPage'
import OrdersPage from './pages/seller/OrdersPage'
import OverviewPage from './pages/seller/OverviewPage'
import ProductFormPage from './pages/seller/ProductFormPage'
import ProductsPage from './pages/seller/ProductsPage'
import SettingsPage from './pages/seller/SettingsPage'
import CheckoutPage from './pages/CheckoutPage'
import ComingSoonPage from './pages/ComingSoonPage'
import CartPage from './pages/CartPage'
import ExplorePage from './pages/ExplorePage'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import StorePage from './pages/StorePage'
import StoresPage from './pages/StoresPage'

/** Jump to the top when the page (not just the query string) changes. */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/store/:slug" element={<StorePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="/account/orders" element={<ProtectedRoute><AccountOrdersPage /></ProtectedRoute>} />
        <Route path="/account/wishlist" element={<ProtectedRoute><AccountWishlistPage /></ProtectedRoute>} />
        <Route path="/seller/register" element={<Navigate to="/register?type=seller" replace />} />
        <Route path="/account/store" element={<ProtectedRoute role="seller"><AccountStorePage /></ProtectedRoute>} />
        <Route path="/seller/onboarding" element={<ProtectedRoute role="seller"><SellerOnboardingPage /></ProtectedRoute>} />
        <Route path="/seller/dashboard" element={<ProtectedRoute role="seller"><SellerStoreGuard /></ProtectedRoute>}>
          <Route index element={<OverviewPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:productId/edit" element={<ProductFormPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<ComingSoonPage />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
