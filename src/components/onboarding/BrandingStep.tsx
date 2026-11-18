import { COVER_RULES, LOGO_RULES } from '../../utils/images'
import { LIMITS } from '../../utils/onboarding'
import { TextAreaField, TextField } from '../ui/FormFields'
import ImageUploadField from './ImageUploadField'
import { fieldId, type StepProps } from './stepTypes'

export default function BrandingStep({ fields, errors, onChange }: StepProps) {
  return (
    <div className="space-y-5">
      <ImageUploadField
        id={fieldId('logo')}
        label="Store logo"
        hint="Square works best. PNG, JPG or WebP, up to 5 MB. It is resized in your browser."
        value={fields.logo}
        rules={LOGO_RULES}
        shape="logo"
        onChange={(value) => onChange('logo', value)}
      />
      <ImageUploadField
        id={fieldId('cover')}
        label="Store cover image"
        hint="A wide photo, around 3:1. PNG, JPG or WebP, up to 5 MB."
        value={fields.cover}
        rules={COVER_RULES}
        shape="cover"
        onChange={(value) => onChange('cover', value)}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id={fieldId('brandName')}
          label="Brand name"
          maxLength={LIMITS.nameMax}
          value={fields.brandName}
          onChange={(event) => onChange('brandName', event.target.value)}
          error={errors.brandName}
          hint="Only if it differs from your store name."
        />
        <TextField
          id={fieldId('tagline')}
          label="Store tagline"
          maxLength={LIMITS.taglineMax}
          value={fields.tagline}
          onChange={(event) => onChange('tagline', event.target.value)}
          error={errors.tagline}
          hint="One short line shown at the top of your story."
        />
        <TextAreaField
          id={fieldId('brandDescription')}
          label="Brand description"
          maxLength={LIMITS.brandDescriptionMax}
          value={fields.brandDescription}
          onChange={(event) => onChange('brandDescription', event.target.value)}
          error={errors.brandDescription}
          hint={`Your story. Leave a blank line to start a new paragraph. ${fields.brandDescription.length}/${LIMITS.brandDescriptionMax}`}
          containerClassName="sm:col-span-2"
        />
      </div>
    </div>
  )
}
