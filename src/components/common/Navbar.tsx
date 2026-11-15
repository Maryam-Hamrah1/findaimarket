import {
  Heart,
  ShoppingCart,
  Menu,
  X,
  UserRound,
  Store,
} from 'lucide-react'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
          <button
            type="button"
            aria-label="Wishlist"
            className="rounded-full p-2 text-foreground transition-colors hover:bg-surface hover:text-accent"
          >
            <Heart size={21} />
          </button>

          <button
            type="button"
            aria-label="Shopping cart"
            className="rounded-full p-2 text-foreground transition-colors hover:bg-surface hover:text-accent"
          >
            <ShoppingCart size={21} />
          </button>

          <Button variant="ghost" size="md">
            Sign In
          </Button>

          <Button variant="outline" size="md">
            Become a Seller
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-foreground hover:bg-surface md:hidden"
        >
          {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
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
            <Button variant="outline" fullWidth>
              Sign In
            </Button>

            <Button variant="secondary" fullWidth>
              Become a Seller
            </Button>

            <div className="flex justify-center gap-6 pt-3 text-foreground">
              <Heart size={21} />
              <ShoppingCart size={21} />
              <UserRound size={21} />
              <Store size={21} />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
