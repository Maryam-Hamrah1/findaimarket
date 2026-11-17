import { PackageOpen } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import AccountLayout from '../components/account/AccountLayout'
import Badge from '../components/ui/Badge'
import { useAuth } from '../hooks/useAuth'
import { loadOrders } from '../services/orderHistory'
import { formatMoney } from '../utils/money'

export default function AccountOrdersPage() {
  const { user } = useAuth()
  const orders = useMemo(() => (user ? loadOrders(user.id) : []), [user])

  useEffect(() => {
    document.title = 'My orders · Findaimarket'
  }, [])

  return (
    <AccountLayout title="My orders">
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-surface px-6 py-14 text-center">
          <PackageOpen size={34} className="mx-auto text-accent" aria-hidden="true" />
          <h2 className="mt-4 font-display text-2xl font-medium text-foreground">No orders yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            Demo orders you place while signed in will appear here.
          </p>
          <Link to="/explore" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-accent px-6 text-sm font-bold text-on-accent hover:bg-accent-hover">
            Explore products
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const units = order.sellers.reduce(
              (sum, seller) => sum + seller.lines.reduce((total, line) => total + line.quantity, 0),
              0,
            )
            return (
              <li key={order.reference} className="rounded-2xl border border-brand-border bg-surface p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{order.reference}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {new Date(order.placedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <Badge>Demo order</Badge>
                </div>
                <p className="mt-3 text-sm text-muted">
                  {units} {units === 1 ? 'item' : 'items'} from {order.sellers.map((seller) => seller.storeName).join(', ')}
                </p>
                <p className="mt-2 text-lg font-bold text-foreground">{formatMoney(order.totals.totalCents)}</p>
              </li>
            )
          })}
        </ul>
      )}
      <p className="mt-6 text-xs leading-5 text-muted">
        These are demo orders saved in this browser. Nothing was paid for or shipped.
      </p>
    </AccountLayout>
  )
}
