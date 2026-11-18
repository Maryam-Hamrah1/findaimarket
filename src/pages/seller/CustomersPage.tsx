import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../components/seller/PageHeader'
import SearchBox from '../../components/seller/SearchBox'
import { TABLE, TD, TH } from '../../components/seller/table'
import { useSellerOrders } from '../../hooks/useSellerData'
import { useSellerStore } from '../../hooks/useSellerStore'
import { formatMoney } from '../../utils/money'
import { customersFrom } from '../../utils/sellerOrders'

export default function CustomersPage() {
  const { store } = useSellerStore()
  const orders = useSellerOrders(store.id)
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.title = 'Customers · Seller dashboard · Findaimarket'
  }, [])

  const customers = useMemo(() => customersFrom(orders), [orders])
  const needle = query.trim().toLowerCase()
  const visible = customers.filter((customer) => needle === '' || customer.name.toLowerCase().includes(needle))

  return (
    <div className="fade-in">
      <PageHeader
        title="Customers"
        description="People who ordered from your store, built from your orders. Contact details and addresses are not shown here."
      />

      {customers.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-surface px-6 py-14 text-center">
          <h2 className="font-display text-2xl font-medium text-foreground">No customers yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">Customers appear after someone orders from your store in this demo.</p>
        </div>
      ) : (
        <>
          <div className="mb-5 flex"><SearchBox id="customer-search" label="Search customers" placeholder="Search by name" value={query} onChange={setQuery} /></div>
          <div className="overflow-x-auto rounded-2xl border border-brand-border bg-surface">
            <table className={TABLE}>
              <caption className="sr-only">Customers of your store</caption>
              <thead>
                <tr>
                  <th className={TH}>Customer</th>
                  <th className={TH}>Country</th>
                  <th className={TH}>Orders</th>
                  <th className={TH}>Total spent</th>
                  <th className={TH}>Last order</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((customer) => (
                  <tr key={customer.key}>
                    <td className={`${TD} font-semibold`}>{customer.name}</td>
                    <td className={TD}>{customer.country}</td>
                    <td className={TD}>{customer.orderCount}</td>
                    <td className={`${TD} font-semibold`}>{formatMoney(customer.spentCents)}</td>
                    <td className={`${TD} whitespace-nowrap`}>{new Date(customer.lastOrderAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">Total spent leaves out cancelled and refunded orders. Demo data from this browser.</p>
        </>
      )}
    </div>
  )
}
