import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AccountLayout from '../components/account/AccountLayout'
import DemoNotice from '../components/auth/DemoNotice'
import Button from '../components/ui/Button'
import { SelectField, TextField } from '../components/ui/FormFields'
import { COUNTRIES, getCountry } from '../data/countries'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { loadOrders } from '../services/orderHistory'

export default function AccountPage() {
  const { user, updateProfile } = useAuth()
  const { itemCount } = useCart()
  const { ids } = useWishlist()

  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [country, setCountry] = useState(user?.country ?? '')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    document.title = 'My account · Findaimarket'
  }, [])

  if (!user) return null

  const orderCount = loadOrders(user.id).length
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const startEdit = () => {
    setFullName(user.fullName)
    setCountry(user.country)
    setError('')
    setSaved(false)
    setEditing(true)
  }

  const handleSave = async (event: FormEvent) => {
    event.preventDefault()
    const result = await updateProfile({ fullName, country })
    if (!result.ok) {
      setError(result.message)
      return
    }
    setEditing(false)
    setSaved(true)
  }

  const stats = [
    { label: 'Demo orders', value: orderCount, to: '/account/orders' },
    { label: 'Wishlist', value: ids.length, to: '/account/wishlist' },
    { label: 'Cart items', value: itemCount, to: '/cart' },
  ]

  return (
    <AccountLayout title="My account">
      <div className="space-y-6">
        <section className="rounded-2xl border border-brand-border bg-surface p-6 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="font-display text-2xl font-medium text-foreground">Profile</h2>
            {!editing && (
              <Button variant="outline" size="sm" onClick={startEdit}>
                Edit profile
              </Button>
            )}
          </div>

          {saved && !editing && (
            <p role="status" className="mt-3 text-sm font-semibold text-success">Profile updated.</p>
          )}

          {editing ? (
            <form onSubmit={handleSave} noValidate className="mt-5 grid gap-5 sm:grid-cols-2">
              <TextField
                id="acc-name"
                label="Full name"
                required
                autoComplete="name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
              <SelectField id="acc-country" label="Country" required value={country} onChange={(event) => setCountry(event.target.value)}>
                {COUNTRIES.map((item) => (
                  <option key={item.code} value={item.code}>{item.name}</option>
                ))}
              </SelectField>
              <p className="text-xs text-muted sm:col-span-2">Your email address cannot be changed in this demo.</p>
              {error && (
                <p role="alert" className="text-sm text-danger sm:col-span-2">{error}</p>
              )}
              <div className="flex gap-3 sm:col-span-2">
                <Button type="submit" variant="secondary">Save changes</Button>
                <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <dl className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
              <div><dt className="text-muted">Full name</dt><dd className="mt-1 font-semibold text-foreground">{user.fullName}</dd></div>
              <div><dt className="text-muted">Email</dt><dd className="mt-1 break-all font-semibold text-foreground">{user.email}</dd></div>
              <div><dt className="text-muted">Country</dt><dd className="mt-1 font-semibold text-foreground">{getCountry(user.country)?.name ?? user.country}</dd></div>
              <div>
                <dt className="text-muted">Account type</dt>
                <dd className="mt-1 font-semibold capitalize text-foreground">{user.roles.join(' + ')}</dd>
              </div>
              <div><dt className="text-muted">Member since</dt><dd className="mt-1 font-semibold text-foreground">{memberSince}</dd></div>
            </dl>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-3" aria-label="Summary">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.to}
              className="rounded-2xl border border-brand-border bg-surface p-5 transition-colors hover:border-accent"
            >
              <p className="font-display text-4xl font-medium text-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </Link>
          ))}
        </section>

        <DemoNotice />
      </div>
    </AccountLayout>
  )
}
