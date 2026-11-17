import { Heart, Package, UserRound } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import Breadcrumb from '../ui/Breadcrumb'

const LINKS = [
  { to: '/account', label: 'Profile', icon: UserRound, end: true },
  { to: '/account/orders', label: 'My orders', icon: Package, end: false },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart, end: false },
]

interface AccountLayoutProps {
  title: string
  children: ReactNode
}

/** Shared frame for the account pages: breadcrumb, heading and side navigation. */
export default function AccountLayout({ title, children }: AccountLayoutProps) {
  return (
    <main>
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-6 lg:pt-8">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'My account', to: '/account' }, { label: title }]} />

        <h1 className="mt-6 font-display text-4xl font-medium text-foreground sm:text-5xl">{title}</h1>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[220px_1fr]">
          <nav aria-label="Account" className="flex gap-2 overflow-x-auto lg:flex-col">
            {LINKS.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-full px-4 text-sm font-semibold transition-colors ${
                      isActive ? 'bg-accent text-on-accent' : 'text-foreground hover:bg-surface hover:text-accent'
                    }`
                  }
                >
                  <Icon size={17} aria-hidden="true" />
                  {link.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="fade-in min-w-0">{children}</div>
        </div>
      </div>
    </main>
  )
}
