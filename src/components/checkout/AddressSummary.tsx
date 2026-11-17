import { getCountry } from '../../data/countries'
import type { ShippingAddress } from '../../types/checkout'

/** The delivery address as a short block of text, in a sensible order for any country. */
export default function AddressSummary({ address }: { address: ShippingAddress }) {
  const country = getCountry(address.country)

  const cityLine = [address.postalCode, address.city].filter(Boolean).join(' ')
  const lines = [
    address.fullName,
    [address.street, address.apartment].filter(Boolean).join(', '),
    cityLine,
    address.region,
    country?.name ?? address.country,
  ].filter((line) => line !== '')

  return (
    <address className="text-sm not-italic leading-6 text-foreground">
      {lines.map((line, index) => (
        <span key={`${index}-${line}`} className="block">
          {line}
        </span>
      ))}
      <span className="mt-2 block text-muted">{address.email}</span>
      <span className="block text-muted">{address.phone}</span>
    </address>
  )
}
