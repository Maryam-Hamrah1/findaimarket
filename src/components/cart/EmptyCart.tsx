import { ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

interface EmptyCartProps {
  /** Items waiting in "saved for later", which a visitor may want to bring back */
  hasSavedItems: boolean
}

export default function EmptyCart({ hasSavedItems }: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-brand-border bg-surface px-6 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-light text-accent">
        <ShoppingBag size={38} strokeWidth={1.5} aria-hidden="true" />
      </div>

      <h2 className="mt-6 font-display text-3xl font-medium text-foreground sm:text-4xl">
        Your shopping cart is empty.
      </h2>

      <p className="mt-3 max-w-md text-base leading-7 text-muted">
        {hasSavedItems
          ? 'Your saved items are waiting below. Move one back to your cart, or find something new.'
          : 'Browse products from independent stores around the world and add what you love.'}
      </p>

      <Link
        to="/explore"
        className="mt-8 inline-flex min-h-12 items-center rounded-full bg-accent px-8 text-base font-semibold text-on-accent transition-colors hover:bg-accent-hover"
      >
        Explore Products
      </Link>
    </div>
  )
}
