import {
  BarChart3,
  Boxes,
  ExternalLink,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useDialog } from '../../hooks/useDialog'
import { useSellerStore } from '../../hooks/useSellerStore'
import StoreLogo from '../ui/StoreLogo'

const NAV = [
  { to: '/seller/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/seller/dashboard/products', label: 'Products', icon: Package, end: false },
  { to: '/seller/dashboard/orders', label: 'Orders', icon: ShoppingBag, end: false },
  { to: '/seller/dashboard/inventory', label: 'Inventory', icon: Boxes, end: false },
  { to: '/seller/dashboard/customers', label: 'Customers', icon: Users, end: false },
  { to: '/seller/dashboard/analytics', label: 'Analytics', icon: BarChart3, end: false },
  { to: '/seller/dashboard/settings', label: 'Store Settings', icon: Settings, end: false },
] as const

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { store } = useSellerStore()
  const linkBase =
    'flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition-colors'

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-brand-border px-4 py-5">
        <StoreLogo name={store.name} logo={store.logo} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">{store.name}</p>
          <p className="text-xs text-muted">Seller dashboard</p>
        </div>
      </div>

      <nav aria-label="Seller dashboard" className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? 'bg-accent text-on-accent' : 'text-foreground hover:bg-surface-hover hover:text-accent'}`
              }
            >
              <Icon size={18} aria-hidden="true" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-brand-border p-3">
        <Link
          to={`/store/${store.slug}`}
          onClick={onNavigate}
          className={`${linkBase} text-foreground hover:bg-surface-hover hover:text-accent`}
        >
          <ExternalLink size={18} aria-hidden="true" />
          View My Store
        </Link>
      </div>
    </div>
  )
}

/** Frame for every seller dashboard page: sidebar on desktop, drawer on small screens. */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { store } = useSellerStore()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useDialog(open, () => setOpen(false), panelRef)

  // Close the drawer when the page changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-brand-border lg:block">
        <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile bar */}
      <div className="flex items-center justify-between gap-3 border-b border-brand-border px-5 py-3 lg:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <StoreLogo name={store.name} logo={store.logo} size="sm" className="!h-10 !w-10 !rounded-xl !text-base" />
          <p className="truncate text-sm font-bold text-foreground">{store.name}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open dashboard menu"
          className="flex min-h-11 items-center gap-2 rounded-full border border-brand-border px-4 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
        >
          <Menu size={18} aria-hidden="true" />
          Menu
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="drawer-overlay absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard menu"
            tabIndex={-1}
            className="drawer-panel absolute inset-y-0 left-0 w-[85%] max-w-xs border-r border-brand-border bg-surface"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close dashboard menu"
              className="absolute right-3 top-4 rounded-full p-2 text-foreground hover:bg-surface-hover"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1 px-5 pb-16 pt-6 lg:px-8 lg:pt-8">{children}</main>
    </div>
  )
}
