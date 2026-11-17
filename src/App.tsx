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
import SellerDashboardPage from './pages/SellerDashboardPage'
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
        <Route path="/seller/dashboard" element={<ProtectedRoute role="seller"><SellerDashboardPage /></ProtectedRoute>} />
        <Route path="*" element={<ComingSoonPage />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
