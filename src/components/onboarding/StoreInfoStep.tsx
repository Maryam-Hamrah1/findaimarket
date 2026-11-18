import { COUNTRIES } from '../../data/countries'
import { BUSINESS_TYPES, LIMITS, STORE_CATEGORY_OPTIONS } from '../../utils/onboarding'
import { SelectField, TextAreaField, TextField } from '../ui/FormFields'
import { fieldId, type StepProps } from './stepTypes'

export default function StoreInfoStep({ fields, errors, onChange }: StepProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <TextField
        id={fieldId('name')}
        label="Store name"
        required
        maxLength={LIMITS.nameMax}
        value={fields.name}
        onChange={(event) => onChange('name', event.target.value)}
        error={errors.name}
        hint="This is how customers will find you. It also becomes your store address."
        containerClassName="sm:col-span-2"
      />
      <TextAreaField
        id={fieldId('description')}
        label="Store description"
        required
        maxLength={LIMITS.descriptionMax}
        value={fields.description}
        onChange={(event) => onChange('description', event.target.value)}
        error={errors.description}
        hint={`What do you sell, and what makes your store special? ${fields.description.length}/${LIMITS.descriptionMax}`}
        containerClassName="sm:col-span-2"
      />
      <SelectField
        id={fieldId('category')}
        label="Store category"
        required
        value={fields.category}
        onChange={(event) => onChange('category', event.target.value)}
        error={errors.category}
      >
        <option value="">Select a category</option>
        {STORE_CATEGORY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </SelectField>
      <SelectField
        id={fieldId('businessType')}
        label="Business type"
        required
        value={fields.businessType}
        onChange={(event) => onChange('businessType', event.target.value)}
        error={errors.businessType}
      >
        <option value="">Select a type</option>
        {BUSINESS_TYPES.map((type) => (
          <option key={type.value} value={type.value}>{type.label}</option>
        ))}
      </SelectField>
      <SelectField
        id={fieldId('country')}
        label="Country"
        required
        value={fields.country}
        onChange={(event) => onChange('country', event.target.value)}
        error={errors.country}
      >
        <option value="">Select your country</option>
        {COUNTRIES.map((country) => (
          <option key={country.code} value={country.code}>{country.name}</option>
        ))}
      </SelectField>
      <TextField
        id={fieldId('city')}
        label="City"
        required
        autoComplete="address-level2"
        maxLength={LIMITS.cityMax}
        value={fields.city}
        onChange={(event) => onChange('city', event.target.value)}
        error={errors.city}
      />
      <TextField
        id={fieldId('email')}
        label="Business email"
        type="email"
        required
        autoComplete="email"
        value={fields.email}
        onChange={(event) => onChange('email', event.target.value)}
        error={errors.email}
      />
      <TextField
        id={fieldId('phone')}
        label="Business phone"
        type="tel"
        autoComplete="tel"
        value={fields.phone}
        onChange={(event) => onChange('phone', event.target.value)}
        error={errors.phone}
        hint="Shown on your store page if you add it."
      />
    </div>
  )
}
