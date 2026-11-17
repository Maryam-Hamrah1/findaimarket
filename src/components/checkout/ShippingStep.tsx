import { useState, type FormEvent } from 'react'
import { COUNTRIES, getCountry } from '../../data/countries'
import {
  EMPTY_ADDRESS,
  type AddressField,
  type ShippingAddress,
} from '../../types/checkout'
import { ADDRESS_FIELD_ORDER, validateAddress } from '../../utils/checkout'
import Button from '../ui/Button'
import { SelectField, TextField } from '../ui/FormFields'

interface ShippingStepProps {
  address: ShippingAddress
  onChange: (address: ShippingAddress) => void
  /** Called with a valid address */
  onContinue: () => void
}

const fieldId = (field: AddressField) => `checkout-${field}`

export default function ShippingStep({ address, onChange, onContinue }: ShippingStepProps) {
  const [touched, setTouched] = useState<ReadonlySet<AddressField>>(new Set())
  const [submitted, setSubmitted] = useState(false)

  const country = getCountry(address.country)
  const errors = validateAddress(address)

  // Show a message once the person has left the field, or after pressing Continue
  const visibleError = (field: AddressField): string | undefined =>
    submitted || touched.has(field) ? errors[field] : undefined

  const markTouched = (field: AddressField) => () =>
    setTouched((previous) => new Set(previous).add(field))

  const update = (field: AddressField, value: string) =>
    onChange({ ...address, [field]: value })

  const handleCountry = (code: string) => {
    // Regions and postal codes differ per country, so start those fresh
    onChange({
      ...address,
      country: code,
      region: EMPTY_ADDRESS.region,
      postalCode: EMPTY_ADDRESS.postalCode,
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)

    const firstInvalid = ADDRESS_FIELD_ORDER.find((field) => errors[field])

    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus()
      return
    }

    onContinue()
  }

  const showRegion = country?.region !== 'none'
  const showPostal = country?.postal !== 'none'

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Shipping information">
      <p className="text-sm text-muted">
        Fields marked <span className="text-accent">*</span> are required.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <TextField
          id={fieldId('fullName')}
          label="Full name"
          required
          name="name"
          autoComplete="name"
          value={address.fullName}
          onChange={(event) => update('fullName', event.target.value)}
          onBlur={markTouched('fullName')}
          error={visibleError('fullName')}
          containerClassName="sm:col-span-2"
        />

        <TextField
          id={fieldId('email')}
          label="Email address"
          required
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          value={address.email}
          onChange={(event) => update('email', event.target.value)}
          onBlur={markTouched('email')}
          error={visibleError('email')}
          hint="For order updates. Nothing is sent in this demo."
        />

        <TextField
          id={fieldId('phone')}
          label="Phone number"
          required
          type="tel"
          name="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+93 70 123 4567"
          value={address.phone}
          onChange={(event) => update('phone', event.target.value)}
          onBlur={markTouched('phone')}
          error={visibleError('phone')}
          hint="Include the country code if you can."
        />

        <SelectField
          id={fieldId('country')}
          label="Country"
          required
          name="country"
          autoComplete="country"
          value={address.country}
          onChange={(event) => handleCountry(event.target.value)}
          onBlur={markTouched('country')}
          error={visibleError('country')}
          containerClassName="sm:col-span-2"
          hint={`The demo can address ${COUNTRIES.length} countries. More can be added.`}
        >
          <option value="">Select your country</option>
          {COUNTRIES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.name}
            </option>
          ))}
        </SelectField>

        {showRegion && (
          <TextField
            id={fieldId('region')}
            label={country?.regionLabel ?? 'State / Province / Region'}
            required={country?.region === 'required'}
            name="region"
            autoComplete="address-level1"
            value={address.region}
            onChange={(event) => update('region', event.target.value)}
            onBlur={markTouched('region')}
            error={visibleError('region')}
            disabled={!country}
            hint={country ? undefined : 'Choose your country first.'}
          />
        )}

        <TextField
          id={fieldId('city')}
          label="City"
          required
          name="city"
          autoComplete="address-level2"
          value={address.city}
          onChange={(event) => update('city', event.target.value)}
          onBlur={markTouched('city')}
          error={visibleError('city')}
        />

        <TextField
          id={fieldId('street')}
          label="Street address"
          required
          name="street"
          autoComplete="address-line1"
          value={address.street}
          onChange={(event) => update('street', event.target.value)}
          onBlur={markTouched('street')}
          error={visibleError('street')}
          containerClassName="sm:col-span-2"
        />

        <TextField
          id={fieldId('apartment')}
          label="Apartment / Unit"
          name="apartment"
          autoComplete="address-line2"
          value={address.apartment}
          onChange={(event) => update('apartment', event.target.value)}
        />

        {showPostal && (
          <TextField
            id={fieldId('postalCode')}
            label="Postal code"
            required={country?.postal === 'required'}
            name="postal-code"
            autoComplete="postal-code"
            placeholder={country?.postalExample}
            value={address.postalCode}
            onChange={(event) => update('postalCode', event.target.value)}
            onBlur={markTouched('postalCode')}
            error={visibleError('postalCode')}
            hint={
              country?.postal === 'optional'
                ? 'Not always used in this country. Add it if you have one.'
                : undefined
            }
          />
        )}
      </div>

      {country && country.postal === 'none' && (
        <p className="mt-5 text-xs text-muted">
          {country.name} does not use postal codes, so none is needed.
        </p>
      )}

      <div className="mt-8 flex justify-end">
        <Button type="submit" variant="secondary" size="lg" className="min-h-12 w-full sm:w-auto">
          Continue to delivery
        </Button>
      </div>
    </form>
  )
}
