import { ChevronDown, Heart, LayoutDashboard, LogOut, Package, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '')).toUpperCase()
}

/** Avatar button with the account dropdown. Closes on Escape and outside click. */
export default function UserMenu() {
  const { user, logout, hasRole } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointer = (event: MouseEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        button.current?.focus()
      }
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!user) return null

  const items = [
    { to: '/account', label: 'My Account', icon: UserRound },
    { to: '/account/orders', label: 'My Orders', icon: Package },
    { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
    ...(hasRole('seller') ? [{ to: '/seller/dashboard', label: 'Seller Dashboard', icon: LayoutDashboard }] : []),
  ]

  const itemClass =
    'flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover hover:text-accent'

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-11 items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-surface"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-bold text-on-accent">
          {initials(user.fullName)}
        </span>
        <ChevronDown size={16} className="text-muted" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="fade-in absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-brand-border bg-surface p-2 shadow-card"
        >
          <div className="border-b border-brand-border px-3 pb-3 pt-2">
            <p className="truncate text-sm font-semibold text-foreground">{user.fullName}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>

          <div className="py-2">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.to} to={item.to} role="menuitem" onClick={() => setOpen(false)} className={itemClass}>
                  <Icon size={17} aria-hidden="true" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="border-t border-brand-border pt-2">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                logout()
                navigate('/')
              }}
              className={itemClass}
            >
              <LogOut size={17} aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
