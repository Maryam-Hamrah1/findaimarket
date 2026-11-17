import {
  Heart,
  ShoppingCart,
  Menu,
  X,
} from 'lucide-react'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import Button from '../ui/Button'
import UserMenu from './UserMenu'

/** Cart icon with the number of items in the cart. */
function CartLink({ className = '' }: { className?: string }) {
  const { itemCount } = useCart()

  return (
    <Link
      to="/cart"
      aria-label={
        itemCount > 0
          ? `Shopping cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
          : 'Shopping cart'
      }
      className={`relative rounded-full p-2 text-foreground transition-colors hover:bg-surface hover:text-accent ${className}`}
    >
      <ShoppingCart size={21} />
      {itemCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold leading-none text-on-accent"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  )
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout, hasRole } = useAuth()
  const navigate = useNavigate()
  const closeMenu = () => setMobileMenuOpen(false)

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Stores', path: '/stores' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">

        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-foreground">
          find<span className="text-accent">ai</span>market
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm font-medium text-foreground transition-colors hover:text-accent"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/account/wishlist"
            aria-label="Wishlist"
            className="rounded-full p-2 text-foreground transition-colors hover:bg-surface hover:text-accent"
          >
            <Heart size={21} />
          </Link>

          <CartLink />

          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
              >
                Sign In
              </Link>
              <Link
                to="/register?type=seller"
                className="inline-flex min-h-11 items-center rounded-full border border-brand-border px-5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                Become a Seller
              </Link>
            </>
          )}
        </div>

        {/* Mobile: cart stays visible, menu button next to it */}
        <div className="flex items-center gap-1 md:hidden">
        <CartLink />
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-foreground hover:bg-surface"
        >
          {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-brand-border bg-background px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-foreground hover:text-accent"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-5 flex flex-col gap-3">
            {user ? (
              <>
                <p className="truncate text-sm font-semibold text-foreground">{user.fullName}</p>
                <Link to="/account" onClick={closeMenu} className="text-sm font-medium text-foreground hover:text-accent">My Account</Link>
                <Link to="/account/orders" onClick={closeMenu} className="text-sm font-medium text-foreground hover:text-accent">My Orders</Link>
                <Link to="/account/wishlist" onClick={closeMenu} className="text-sm font-medium text-foreground hover:text-accent">Wishlist</Link>
                {hasRole('seller') && (
                  <Link to="/seller/dashboard" onClick={closeMenu} className="text-sm font-medium text-foreground hover:text-accent">Seller Dashboard</Link>
                )}
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    closeMenu()
                    logout()
                    navigate('/')
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-border text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
                >
                  Sign In
                </Link>
                <Link
                  to="/register?type=seller"
                  onClick={closeMenu}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-on-accent hover:bg-accent-hover"
                >
                  Become a Seller
                </Link>
                <Link to="/account/wishlist" onClick={closeMenu} className="flex min-h-11 items-center justify-center gap-2 text-sm text-foreground hover:text-accent">
                  <Heart size={18} /> Wishlist
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
